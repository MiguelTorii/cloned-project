// @flow

import React from 'react';
import uuidv4 from 'uuid/v4';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import queryString from 'query-string'
import { withRouter } from 'react-router';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { CampaignState } from '../../reducers/campaign';
import type { SelectType, Flashcard } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import FlashcardEditor from '../../components/FlashcardEditor';
import NewFlashcard from '../../components/FlashcardEditor/NewFlashcard';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createFlashcards , getFlashcards, updateFlashcards } from '../../api/posts';
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
  enqueueSnackbar: Function,
};

type State = {
  loading: boolean,
  title: string,
  summary: string,
  classId: number,
  sectionId: ?number,
  tags: Array<SelectType>,
  tagsError: boolean,
  flashcards: Array<Flashcard & { id: string, isNew: boolean }>,
  flashcardsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string,
  changed: ?boolean,
  className: string,
};

class CreateFlashcards extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    className: '',
    title: '',
    summary: '',
    classId: 0,
    sectionId: null,
    tags: [],
    tagsError: false,
    flashcards: [],
    flashcardsError: false,
    errorDialog: false,
    errorTitle: '',
    changed: false,
    errorBody: ''
  };

  handlePush = path => {
    const { location: { search }, pushTo, campaign } = this.props
    if(campaign.newClassExperience) {
      pushTo(`${path}${search}`)
    } else {
      pushTo(path)
    }
  }

  componentDidMount = async () => {
    this.loadData();
    const {
      location: { search = '' },
    } = this.props
    const {
      classId,
      sectionId,
    } = queryString.parse(search);
    this.setState({ classId: Number(classId), sectionId: Number(sectionId) })
  };

  loadData = async () => {
    const {
      user: {
        data: { userId, segment }
      },
      flashcardId
    } = this.props;
    if(!flashcardId) return null
    const res= await getFlashcards({
      userId,
      flashcardId,
    });

    const { classes } = await getUserClasses({ userId });
    const userClasses = processClasses({ classes, segment });
    const { sectionId } = JSON.parse(userClasses[0].value);
    const { courseDisplayName, deck = [], title, classId, tags = [], summary } = res

    this.setState({
      sectionId,
      className: courseDisplayName,
      flashcards: deck.map(item => ({
        question: item.question,
        isNew: false,
        answer: item.answer,
        id: uuidv4()
      })),
      title,
      classId,
      tags,
      summary
    })
    return null
  };

  updateFlashcards = async () => {
    const { tags, flashcards } = this.state;
    if (tags.length < 0) {
      this.setState({ tagsError: true });
      return;
    }
    if (flashcards.length === 0) {
      this.setState({ flashcardsError: true });
      return;
    }
    this.setState({ tagsError: false, flashcardsError: false });
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '' }
        },
        flashcardId,
      } = this.props;
      const { title, sectionId, summary, classId } = this.state;

      const id = String(flashcardId)
      await updateFlashcards({
        flashcardId: id,
        userId,
        classId,
        sectionId,
        title,
        summary,
        deck: flashcards.map(item => ({
          question: item.question,
          answer: item.answer
        })),
      });
      logEvent({
        event: 'Feed- Update Flashcards',
        props: { 'Number of cards': flashcards.length, Title: title }
      });

      const { enqueueSnackbar, classes } = this.props;
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
      this.handlePush(`/flashcards/${flashcardId}`)
      this.setState({
        loading: false,
      })
 
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }

  }

  createFlashcards = async () => {
    const { tags, flashcards } = this.state;
    if (tags.length < 0) {
      this.setState({ tagsError: true });
      return;
    }
    if (flashcards.length === 0) {
      this.setState({ flashcardsError: true });
      return;
    }
    this.setState({ tagsError: false, flashcardsError: false });
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '', grade }
        },
      } = this.props;
      const { title, summary, classId, sectionId } = this.state;

      const tagValues = tags.map(item => Number(item.value));
      const {
        points,
        user: { firstName },
        fcId,
      } = await createFlashcards({
        userId,
        title,
        summary,
        deck: flashcards.map(item => ({
          question: item.question,
          answer: item.answer
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
        type: 'Created',
      });

      if (points > 0) {
        const { enqueueSnackbar, classes } = this.props;
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

      this.handlePush('/feed');
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  handleSubmit= () => {
    const {flashcardId} = this.props
    if(flashcardId) this.updateFlashcards()
    else this.createFlashcards()
  }

  handleTextChange = name => event => {
    this.setState({ changed: true })
    this.setState({ [name]: event.target.value });
  };

  handleClassChange = ({
    classId,
    sectionId
  }: {
    classId: number,
    sectionId: number
  }) => {
    this.setState({ classId, sectionId });
  };

  handleTagsChange = values => {
    this.setState({ tags: values });
    if (values.length === 0) this.setState({ tagsError: true });
    else this.setState({ tagsError: false });
  };

  handleAddNew = () => {
    this.setState({ changed: true })
    this.setState(({ flashcards }) => ({
      flashcards: [...flashcards, { id: uuidv4(), question: '', answer: '', isNew: true }]
    }));
  };

  handleDelete = id => {
    const newState = update(this.state, {
      changed: { $set: true },
      flashcards: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, { $splice: [[index, 1]] });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleUpdate = ({ id, question, answer }) => {
    const newState = update(this.state, {
      changed: { $set: true },
      flashcards: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, {
              [index]: {
                question: { $set: question },
                answer: { $set: answer }
              }
            });
          }
          return b;
        }
      }
    });
    this.setState(newState);

    const { enqueueSnackbar, classes } = this.props;
    enqueueSnackbar({ notification: {
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
      }}});
    this.handleAddNew();
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  handleDrop = ({ id, image, type }) => {
    console.log(id, image, type);
  };

  handleDropRejected = () => {};

  render() {
    const { classes, flashcardId } = this.props;
    const {
      loading,
      title,
      summary,
      tags,
      tagsError,
      flashcards,
      flashcardsError,
      errorDialog,
      errorTitle,
      classId,
      sectionId,
      changed,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title={`${flashcardId ? 'Edit': 'Create'  } Flashcards`}
            buttonLabel={flashcardId ? 'Update': 'Create'}
            subtitle="Yes, tests are make or break. Take a little time to get prepared, and when you create your cards, they will go on the feed where classmates can also view them."
            loading={loading}
            changed={changed}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Title</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Title"
                  onChange={this.handleTextChange}
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
                  onChange={this.handleClassChange} 
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
                  onChange={this.handleTextChange}
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
                  onChange={this.handleTagsChange}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">Flashcards</Typography>
              </Grid>
              <Grid item xs={12} sm={10} className={classes.flashcards}>
                {flashcards.map((flashcard, index) => (
                  <FlashcardEditor
                    key={flashcard.id}
                    isNew={flashcard.isNew}
                    id={flashcard.id}
                    index={index + 1}
                    loading={loading}
                    question={flashcard.question}
                    answer={flashcard.answer}
                    onDelete={this.handleDelete}
                    onSubmit={this.handleUpdate}
                    onDrop={this.handleDrop}
                    onDropRejected={this.handleDropRejected}
                  />
                ))}
                <NewFlashcard
                  error={flashcardsError && flashcards.length === 0}
                  loading={loading}
                  onClick={this.handleAddNew}
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
            handleClose={this.handleErrorDialogClose}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

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
