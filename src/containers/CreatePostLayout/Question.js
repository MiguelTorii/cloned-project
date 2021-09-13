/* eslint-disable no-nested-ternary */
// @flow

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { processClasses } from 'containers/ClassesSelector/utils';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import CreatePostForm from 'components/CreatePostForm/CreatePostForm';
import OutlinedTextValidator from 'components/OutlinedTextValidator/OutlinedTextValidator';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';
import { cypher } from 'utils/crypto';
import RichTextEditor from 'containers/RichTextEditor/RichTextEditor';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as api from '../../api/posts';
import { logEvent, logEventLocally } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import type { CampaignState } from '../../reducers/campaign';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  anonymouslyExplanation: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    fontSize: 12
  },
  toolbarClass: {
    backgroundColor: theme.circleIn.palette.appBar
  },
  labelClass: {
    fontWeight: 'bold',
    position: 'absolute',
    top: 6,
    left: 24,
    backgroundColor: theme.circleIn.palette.formBackground,
    zIndex: 9,
    padding: theme.spacing(0, 0.5)
  },
  textValidator: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.appBar
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#60B515'
    }
  },
  quillGrid: {
    '& .quill': {
      '& .ql-toolbar': {
        backgroundColor: theme.circleIn.palette.appBar,
        borderColor: theme.circleIn.palette.appBar
      },
      '& .ql-container': {
        borderColor: theme.circleIn.palette.appBar,

        '& .ql-editor.ql-blank::before': {
          opacity: 1
        }
      }
    }
  }
});

type Props = {
  classes: Object,
  user: UserState,
  campaign: CampaignState,
  pushTo: Function,
  questionId: number,
  location: {
    search: string,
    pathname: string
  },
  enqueueSnackbar: Function,
  setIsPosting: Function,
  classList: Array
};

const CreateQuestion = ({
  classes,
  currentTag,
  user: {
    expertMode,
    data: { permission, segment, userId },
    userClasses
  },
  campaign,
  pushTo,
  questionId,
  enqueueSnackbar,
  classList,
  classId: currentSelectedClassId,
  sectionId: currentSelectedSectionId,
  setIsPosting
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [classId, setClassId] = useState(currentSelectedClassId);
  const [sectionId, setSectionId] = useState(currentSelectedSectionId);
  const [errorDialog, setErrorDialog] = useState(false);
  const [anonymousActive, setAnonymousActive] = useState(false);
  const [changed, setChanged] = useState(false);
  const [errorBody, setErrorBody] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [questionToolbar, setQuestionToolbar] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('question')) {
      const question = JSON.parse(localStorage.getItem('question'));
      if ('title' in question) {
        setTitle(question.title);
      }

      if ('body' in question) {
        setBody(question.body);
      }

      if ('changed' in question) {
        setChanged(question.changed);
      }
    }
  }, []);

  const canBatchPost = useMemo(
    () => expertMode && permission.includes('one_touch_send_posts'),
    [expertMode, permission]
  );

  const handlePush = useCallback(
    (path) => {
      if (campaign.newClassExperience) {
        const search = !canBatchPost
          ? `?class=${cypher(`${classId}:${sectionId}`)}`
          : '';
        pushTo(`${path}${search}`);
      } else {
        pushTo(path);
      }
    },
    [campaign.newClassExperience, classId, canBatchPost, pushTo, sectionId]
  );

  const loadData = useCallback(async () => {
    const question = await api.getQuestion({ userId, questionId });
    const uc = processClasses({ classes: userClasses.classList, segment });
    const { sectionId } = JSON.parse(uc[0].value);
    const { body, title, classId } = question;
    setBody(body);
    setTitle(title);
    setClassId(classId);
    setSectionId(sectionId);
    const {
      postInfo: { feedId }
    } = question;

    logEvent({
      event: 'Feed- Edit Question',
      props: { 'Internal ID': feedId }
    });
  }, [questionId, segment, userClasses.classList, userId]);

  useEffect(() => {
    if (questionId && userId) loadData();
    // const { classId, sectionId } = decypherClass()
    // setClassId(Number(classId))
    // setSectionId(Number(sectionId))
    logEvent({
      event: 'Home- Start Ask Question',
      props: {}
    });
  }, [loadData, questionId, userId]);

  useEffect(() => {
    if (editor) {
      setQuestionToolbar(editor.getEditor().theme.modules.toolbar);
    }
  }, [editor]);

  const updateQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.updateQuestion({
        userId,
        questionId,
        title,
        body,
        classId,
        sectionId
      });

      if (!res.success) throw new Error('Couldnt update');

      enqueueSnackbar({
        notification: {
          message: `Successfully updated`,
          nextPath: `/question/${questionId}`,
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
      localStorage.removeItem('question');
      handlePush(`/question/${questionId}`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorBody('Please try again');
      setErrorTitle('Unknown Error');
      setErrorDialog(true);
    }
  }, [
    body,
    classId,
    classes.stackbar,
    enqueueSnackbar,
    handlePush,
    questionId,
    sectionId,
    title,
    userId
  ]);

  const createQuestion = useCallback(async () => {
    setLoading(true);
    try {
      if (canBatchPost && !classList.length) {
        setLoading(false);
        setErrorTitle('Select one more classes');
        setErrorBody('Please try again');
        setErrorDialog(true);
        return;
      }
      if (!canBatchPost && !classId && !sectionId) {
        setLoading(false);
        setErrorTitle('Choose a class');
        setErrorBody('Please try again');
        setErrorDialog(true);
        return;
      }

      setIsPosting(true);
      const {
        points,
        user: { firstName },
        classes: resClasses,
        questionId
      } = canBatchPost
        ? await api.createBatchQuestion({
            userId,
            title,
            sectionIds: classList.map((c) => c.sectionId),
            body
          })
        : await api.createQuestion({
            userId,
            title,
            body,
            anonymous: anonymousActive,
            classId,
            sectionId
          });

      let hasError = false;
      if (canBatchPost && resClasses) {
        resClasses.forEach((r) => {
          if (r.status !== 'Success') hasError = true;
        });
        if (hasError || resClasses.length === 0) {
          setIsPosting(false);
          setLoading(false);
          setErrorBody('Please try again');
          setErrorTitle('Error creating questions');
          setErrorDialog(true);
          return;
        }
      }

      logEventLocally({
        category: 'Question',
        objectId: questionId,
        type: 'Created'
      });

      if (points > 0 || canBatchPost) {
        enqueueSnackbar({
          notification: {
            message: !canBatchPost
              ? `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`
              : 'All posts were created successfully',
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
      localStorage.removeItem('question');

      handlePush('/feed');
    } catch (err) {
      setIsPosting(false);
      setLoading(false);
      setErrorBody('Please try again');
      setErrorTitle('Unknown Error');
      setErrorDialog(true);
    }
  }, [
    anonymousActive,
    body,
    setIsPosting,
    canBatchPost,
    classId,
    classList,
    classes.stackbar,
    enqueueSnackbar,
    handlePush,
    sectionId,
    title,
    userId
  ]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (questionId) updateQuestion();
      else createQuestion();
    },
    [createQuestion, questionId, updateQuestion]
  );

  const handleTextChange = useCallback(
    () => (event) => {
      setChanged(true);
      setTitle(event.target.value);
      if (localStorage.getItem('question')) {
        const currentQuestion = JSON.parse(localStorage.getItem('question'));
        currentQuestion.title = event.target.value;
        currentQuestion.changed = true;
        localStorage.setItem('question', JSON.stringify(currentQuestion));
      } else {
        const question = {
          title: event.target.value,
          changed: true
        };
        localStorage.setItem('question', JSON.stringify(question));
      }
    },
    []
  );

  const handleRTEChange = useCallback((value) => {
    setChanged(true);
    setBody(value);

    if (localStorage.getItem('question')) {
      const currentQuestion = JSON.parse(localStorage.getItem('question'));
      currentQuestion.body = value;
      currentQuestion.changed = true;
      localStorage.setItem('question', JSON.stringify(currentQuestion));
    } else {
      const question = {
        body: value,
        changed: true
      };
      localStorage.setItem('question', JSON.stringify(question));
    }
  }, []);

  const handleErrorDialogClose = useCallback(() => {
    setErrorDialog(false);
    setErrorTitle('');
    setErrorBody('');
  }, []);

  const toggleAnonymousActive = useCallback(() => {
    setAnonymousActive((a) => !a);
  }, []);

  return (
    <div className={classes.root}>
      <ErrorBoundary>
        <CreatePostForm
          currentTag={currentTag}
          loading={loading}
          changed={changed}
          anonymousActive={anonymousActive}
          toggleAnonymousActive={toggleAnonymousActive}
          handleSubmit={handleSubmit}
          buttonLabel={questionId ? 'Save' : 'Post! 🚀'}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} sm={12}>
              <OutlinedTextValidator
                label="Ask a Question*"
                labelClass={classes.labelClass}
                inputClass={classes.textValidator}
                placeholder="Ask your main question(s) here..."
                onChange={handleTextChange}
                name="title"
                value={title}
                validators={['required']}
                errorMessages={['Title is required']}
              />
            </Grid>
            <Grid item xs={12} sm={12} className={classes.quillGrid}>
              <ToolbarTooltip
                toolbar={questionToolbar}
                toolbarClass={classes.toolbarClass}
              />
              <RichTextEditor
                setEditor={setEditor}
                placeholder="Add a description to your question to help your classmates give the best answer! You’re a hero for asking a question--some of your classmates are probably wondering the same thing too."
                value={body}
                onChange={handleRTEChange}
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

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  user,
  campaign
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
)(withStyles(styles)(withRouter(CreateQuestion)));
