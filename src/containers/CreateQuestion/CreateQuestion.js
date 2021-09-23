// @flow

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import { withRouter } from 'react-router';
import { cypher, decypherClass } from 'utils/crypto';
import AnonymousButton from 'components/AnonymousButton/AnonymousButton';
import ClassMultiSelect from 'containers/ClassMultiSelect/ClassMultiSelect';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import Tooltip from 'containers/Tooltip/Tooltip';
import { PERMISSIONS } from 'constants/common';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import CreatePostForm from '../../components/CreatePostForm/CreatePostForm';
import ClassesSelector from '../ClassesSelector/ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator/OutlinedTextValidator';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
// import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog/SimpleErrorDialog';
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
    fontSize: 12
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
  enqueueSnackbar: Function
};

const CreateQuestion = ({
  classes,
  user: {
    expertMode,
    data: { permission, segment, userId },
    userClasses
  },
  campaign,
  pushTo,
  questionId,
  location: { pathname },
  enqueueSnackbar
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [classId, setClassId] = useState(0);
  const [sectionId, setSectionId] = useState(null);
  const [errorDialog, setErrorDialog] = useState(false);
  const [anonymousActive, setAnonymousActive] = useState(false);
  const [changed, setChanged] = useState(null);
  const [errorBody, setErrorBody] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [classList, setClassList] = useState([]);
  const [questionToolbar, setQuestionToolbar] = useState(null);
  const [editor, setEditor] = useState(null);

  const isEdit = useMemo(() => pathname.includes('/edit'), [pathname]);
  const canBatchPost = useMemo(
    () => expertMode && permission.includes(PERMISSIONS.ONE_TOUCH_SEND_POSTS),
    [expertMode, permission]
  );

  const handlePush = useCallback(
    (path) => {
      if (campaign.newClassExperience) {
        const search = !canBatchPost ? `?class=${cypher(`${classId}:${sectionId}`)}` : '';
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
    if (questionId && userId) {
      loadData();
    }
    const { classId, sectionId } = decypherClass();

    setClassId(Number(classId));
    setSectionId(Number(sectionId));
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

      if (!res.success) {
        throw new Error('Couldnt update');
      }

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
          if (r.status !== 'Success') {
            hasError = true;
          }
        });
        if (hasError || resClasses.length === 0) {
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

      handlePush('/feed');
    } catch (err) {
      setLoading(false);
      setErrorBody('Please try again');
      setErrorTitle('Unknown Error');
      setErrorDialog(true);
    }
  }, [
    anonymousActive,
    body,
    classId,
    classList,
    classes.stackbar,
    enqueueSnackbar,
    canBatchPost,
    handlePush,
    sectionId,
    title,
    userId
  ]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (questionId) {
        updateQuestion();
      } else {
        createQuestion();
      }
    },
    [createQuestion, questionId, updateQuestion]
  );

  const handleTextChange = useCallback(
    () => (event) => {
      setChanged(true);
      setTitle(event.target.value);
    },
    []
  );

  const handleRTEChange = useCallback(
    (value) => {
      if (changed === null) {
        setChanged(false);
      } else {
        setChanged(true);
      }
      setBody(value);
    },
    [changed]
  );

  const handleClassChange = useCallback(
    ({ classId, sectionId }: { classId: number, sectionId: number }) => {
      const selected = userClasses.classList.find((c) => c.classId === classId);
      if (selected) {
        setClassList([
          {
            ...selected,
            sectionId
          }
        ]);
      }
      setSectionId(sectionId);
      setClassId(classId);
    },
    [userClasses.classList]
  );

  const handleErrorDialogClose = useCallback(() => {
    setErrorDialog(false);
    setErrorTitle('');
    setErrorBody('');
  }, []);

  const toggleAnonymousActive = useCallback(() => {
    setAnonymousActive((a) => !a);
  }, []);

  const handleClasses = useCallback((classList) => {
    setClassList(classList);
    if (classList.length > 0) {
      setSectionId(classList[0].sectionId);
      setClassId(classList[0].classId);
    }
  }, []);

  return (
    <div className={classes.root}>
      <ErrorBoundary>
        <CreatePostForm
          title="Ask a Question"
          subtitle="When you enter a question here, the question gets sent to your classmates to provide you with the help you need"
          loading={loading}
          changed={changed}
          handleSubmit={handleSubmit}
          buttonLabel={questionId ? 'Save' : 'Create'}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} sm={12} md={2}>
              <Typography variant="subtitle1">What's your question?</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={10}>
              <OutlinedTextValidator
                label="Enter your question here"
                onChange={handleTextChange}
                name="title"
                value={title}
                validators={['required']}
                errorMessages={['Title is required']}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <Typography variant="subtitle1">Description</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={10}>
              <ToolbarTooltip toolbar={questionToolbar} />
              <RichTextEditor
                setEditor={setEditor}
                placeholder="Add more details to your question to increase the chances of getting an answer"
                value={body}
                onChange={handleRTEChange}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Typography variant="subtitle1">Class</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={10}>
              {canBatchPost && !isEdit ? (
                <Tooltip
                  id={9050}
                  placement="right"
                  text="In Expert Mode, you can post the same thing in more than one class! 🙌"
                >
                  <ClassMultiSelect selected={classList} onSelect={handleClasses} />
                </Tooltip>
              ) : (
                <ClassesSelector
                  classId={classId}
                  sectionId={sectionId}
                  onChange={handleClassChange}
                />
              )}
            </Grid>

            {!questionId && !canBatchPost && (
              <Grid item xs={12} sm={12} md={2}>
                <Typography variant="subtitle1">Ask Anonymously</Typography>
              </Grid>
            )}

            {!questionId && !canBatchPost && (
              <Grid item xs={12} sm={12} md={10}>
                <AnonymousButton active={anonymousActive} toggleActive={toggleAnonymousActive} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography className={classes.anonymouslyExplanation}>
                When you post a question anonymously, classmates cannot see who asked the question.
                However, your post can still be flagged for academic dishonesty.
              </Typography>
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
