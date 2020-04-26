// @flow

import React, { useState, useEffect, useCallback } from 'react';
import uuidv4 from 'uuid/v4';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { CampaignState } from '../../reducers/campaign';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import FlashcardEditor from '../../components/FlashcardEditor';
import NewFlashcard from '../../components/FlashcardEditor/NewFlashcard';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import * as api from '../../api/posts';
import { logEvent, logEventLocally } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary';
import { getUserClasses } from '../../api/user';

const styles = theme => ({
  flashcards: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  location: {
    search: string
  },
  pushTo: Function,
  flashcardId: ?number,
  campaign: CampaignState,
  enqueueSnackbar: Function
};

const CreateFlashcards = ({
  classes,
  user,
  location,
  pushTo,
  flashcardId,
  campaign,
  enqueueSnackbar
}: Props) => {
  const { search } = location;
  const {
    data: { userId, segment, grade },
  } = user;
  const [classId, setClassId] = useState(0);
  const [sectionId, setSectionId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [summary, setSummary] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashcardsError, setFlashcardsError] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorBody, setErrorBody] = useState('');
  const [changed, setChanged] = useState(false);

  const handlePush = useCallback(path => {
    if (campaign.newClassExperience) {
      pushTo(`${path}${search}`);
    } else {
      pushTo(path);
    }
  }, [campaign, pushTo, search]);

  const loadData = useCallback(async () => {
    if (!flashcardId) return null;
    const res = await api.getFlashcards({
      userId,
      flashcardId
    });

    const { classes } = await getUserClasses({ userId });
    const userClasses = processClasses({ classes, segment });
    const { sectionId } = JSON.parse(userClasses[0].value);
    const { deck = [], title, classId, tags = [], summary } = res;
    setSectionId(sectionId);
    setClassId(classId);
    setFlashcards(
      deck.map(item => ({
        question: item.question,
        isNew: false,
        answer: item.answer,
        questionImage: item.question_image_url,
        answerImage: item.answer_image_url,
        id: uuidv4()
      }))
    );
    setTitle(title);
    setTags(tags);
    setSummary(summary);
    return null;
  }, [flashcardId, segment, userId]);

  const updateFlashcards = useCallback(async () => {
    if (tags.length < 0) {
      setTagsError(true);
      return;
    }
    if (flashcards.length === 0) {
      setFlashcardsError(true);
      return;
    }
    setTagsError(false);
    setFlashcardsError(false);
    setLoading(true);
    try {
      const id = String(flashcardId);
      await api.updateFlashcards({
        flashcardId: id,
        userId,
        classId,
        sectionId,
        title,
        summary,
        deck: flashcards.map(item => ({
          question: item.question,
          answer: item.answer,
          questionImage: item.questionImage,
          answerImage: item.answerImage
        }))
      });
      logEvent({
        event: 'Feed- Update Flashcards',
        props: { 'Number of cards': flashcards.length, Title: title }
      });

      await enqueueSnackbar({
        notification: {
          message: `Successfully updated`,
          nextPath: `/flashcards/${flashcardId}`,
          options: {
            variant: 'info',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 7000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });
      handlePush(`/flashcards/${flashcardId}`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorDialog(true);
      setErrorTitle('Unknown Error');
      setErrorBody('Please try again');
    }
  }, [classId, classes, flashcards, enqueueSnackbar, handlePush, sectionId, summary, userId, tags, title, flashcardId]);

  const createFlashcards = useCallback(async () => {
    if (tags.length < 0) {
      setTagsError(true);
      return;
    }
    if (flashcards.length === 0) {
      setFlashcardsError(true);
      return;
    }
    setTagsError(false);
    setFlashcardsError(false);
    setLoading(true);

    try {
      const tagValues = tags.map(item => Number(item.value));
      const {
        points,
        user: { firstName },
        fcId
      } = await api.createFlashcards({
        userId,
        title,
        summary,
        deck: flashcards.map(item => ({
          question: item.question,
          answer: item.answer,
          questionImage: item.questionImage,
          answerImage: item.answerImage
        })),
        grade,
        classId,
        sectionId,
        tags: tagValues
      });

      logEvent({
        event: 'Feed- Create Flashcards',
        props: { 'Number of cards': flashcards.length, Title: title }
      });

      logEventLocally({
        category: 'Flashcard',
        objectId: fcId,
        type: 'Created'
      });

      if (points > 0) {
        await enqueueSnackbar({
          notification: {
            message: `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`,
            nextPath: '/feed',
            options: {
              variant: 'success',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 7000,
              ContentProps: {
                classes: {
                  root: classes.stackbar
                }
              }
            }
          }
        });
      }

      handlePush('/feed');
    } catch (err) {
      setLoading(false);
      setErrorDialog(true);
      setErrorTitle('Unknown Error');
      setErrorBody('Please try again');
    }
  }, [classId, classes, flashcards, enqueueSnackbar, grade, handlePush, sectionId, summary, userId, tags, title]);

  const handleSubmit = useCallback(() => {
    if (flashcardId) updateFlashcards();
    else createFlashcards();
  }, [updateFlashcards, createFlashcards, flashcardId]);

  const handleTextChange = useCallback(
    name => event => {
      setChanged(true);
      const v = event.target.value
      if (name === 'title') setTitle(v)
      if (name === 'summary') setSummary(v)
    },
    []
  );

  const handleClassChange = useCallback(
    ({ classId: cid, sectionId: sid }) => {
      setClassId(cid);
      setSectionId(sid);
    },
    []
  );

  const handleTagsChange = useCallback(values => {
    setTags(values);
    if (values.length === 0) setTagsError(true);
    else setTagsError(false);
  }, []);

  const handleAddNew = useCallback(() => {
    setChanged(true);
    setFlashcards(f => ([
      ...f,
      {
        id: uuidv4(),
        question: '',
        answer: '',
        questionImage: null,
        answerImage: null,
        isNew: true
      }
    ]
    ));
  }, []);

  const handleDelete = useCallback(id => {
    const { flashcards: f } = update(
      { flashcards },
      {
        flashcards: {
          $apply: b => {
            const index = b.findIndex(item => item.id === id);
            if (index > -1) {
              return update(b, { $splice: [[index, 1]] });
            }
            return b;
          }
        }
      }
    );
    setFlashcards(f);
    setChanged(true);
  }, [flashcards]);

  const handleUpdate = useCallback(
    ({ id, question, answer, questionImage, answerImage, end }) => {
      const { flashcards: f } = update(
        { flashcards },
        {
          flashcards: {
            $apply: b => {
              const index = b.findIndex(item => item.id === id);
              if (index > -1) {
                return update(b, {
                  [index]: {
                    question: { $set: question },
                    answer: { $set: answer },
                    questionImage: { $set: questionImage },
                    answerImage: { $set: answerImage }
                  }
                });
              }
              return b;
            }
          }
        }
      );
      setChanged(true);
      setFlashcards(f);

      enqueueSnackbar({
        notification: {
          message: 'Flashcards Updated',
          options: {
            variant: 'info',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 2000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });
      if (!end) handleAddNew();
    },
    [classes, enqueueSnackbar, handleAddNew, flashcards]
  );

  const handleErrorDialogClose = useCallback(() => {
    setErrorDialog(false);
    setErrorTitle('');
    setErrorBody('');
  }, []);

  useEffect(() => {
    loadData();
    const { classId: cid, sectionId: sid } = queryString.parse(search);
    setClassId(Number(cid));
    setSectionId(Number(sid));
  }, [loadData, search]);

  return (
    <div className={classes.root}>
      <ErrorBoundary>
        <CreatePostForm
          title={`${flashcardId ? 'Edit' : 'Create'} Flashcards`}
          buttonLabel={flashcardId ? 'Update' : 'Create'}
          subtitle="Yes, tests are make or break. Take a little time to get prepared, and when you create your cards, they will go on the feed where classmates can also view them."
          loading={loading}
          changed={changed}
          handleSubmit={handleSubmit}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} sm={2}>
              <Typography variant="subtitle1">Title</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <OutlinedTextValidator
                label="Title"
                onChange={handleTextChange}
                name="title"
                value={title}
                validators={['required']}
                errorMessages={['Title is required']}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="subtitle1">Class</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <ClassesSelector
                onChange={handleClassChange}
                classId={classId}
                sectionId={sectionId}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="subtitle1">Description</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <OutlinedTextValidator
                label="Description"
                onChange={handleTextChange}
                name="summary"
                multiline
                rows={4}
                value={summary}
                validators={['required']}
                errorMessages={['Description is required']}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="subtitle1">Tags</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TagsAutoComplete
                tags={tags}
                error={tagsError}
                onChange={handleTagsChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="subtitle1">Flashcards</Typography>
            </Grid>
            <Grid item xs={12} sm={12} className={classes.flashcards}>
              {flashcards.map((flashcard, index) => (
                <FlashcardEditor
                  key={flashcard.id}
                  isNew={flashcard.isNew}
                  id={flashcard.id}
                  index={index + 1}
                  loading={loading}
                  question={flashcard.question}
                  answer={flashcard.answer}
                  questionImage={flashcard.questionImage}
                  answerImage={flashcard.answerImage}
                  onDelete={handleDelete}
                  onSubmit={handleUpdate}
                />
              ))}
              <NewFlashcard
                error={flashcardsError && flashcards.length === 0}
                loading={loading}
                onClick={handleAddNew}
              />
            </Grid>
          </Grid>
        </CreatePostForm>
      </ErrorBoundary>
      <ErrorBoundary>
        <SimpleErrorDialog
          open={errorDialog}
          title={errorTitle}
          body={errorBody}
          handleClose={handleErrorDialogClose}
        />
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = ({ campaign, user, router }: StoreState): {} => ({
  user,
  campaign,
  router
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CreateFlashcards)));
