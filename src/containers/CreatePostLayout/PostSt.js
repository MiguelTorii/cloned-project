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
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip'
import CreatePostForm from 'components/CreatePostForm';
import OutlinedTextValidator from 'components/OutlinedTextValidator';
import SimpleErrorDialog from 'components/SimpleErrorDialog';
import { cypher } from 'utils/crypto'
import RichTextEditor from '../RichTextEditor';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as api from '../../api/posts';
import { logEvent, logEventLocally } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary';
import type { CampaignState } from '../../reducers/campaign';

const styles = theme => ({
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
      borderColor: '#03A9F4'
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
          opacity: 1,
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
  postId: number,
  location: {
    search: string,
    pathname: string
  },
  enqueueSnackbar: Function,
  setIsPosting: Function,
  classList: Array,
};

const CreatePostSt = ({
  classes,
  currentTag,
  user: {
    expertMode,
    data: {
      permission,
      segment,
      userId
    },
    userClasses,
  },
  campaign,
  pushTo,
  postId,
  enqueueSnackbar,
  classList,
  classId: currentSelectedClassId,
  sectionId: currentSelectedSectionId,
  setIsPosting,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [classId, setClassId] = useState(currentSelectedClassId || 0)
  const [sectionId, setSectionId] = useState(currentSelectedSectionId || 0)
  const [errorDialog, setErrorDialog] = useState(false)
  const [anonymousActive, setAnonymousActive] = useState(false)
  const [changed, setChanged] = useState(false)
  const [error, setError] = useState({ title: '', body: '' })
  const [postToolbar, setPostToolbar] = useState(null)
  const [editor, setEditor] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('postSt')) {
      const postSt = JSON.parse(localStorage.getItem('postSt'))
      if ('title' in postSt) {
        setTitle(postSt.title)
      }

      if ('body' in postSt) {
        setBody(postSt.body)
      }

      if ('changed' in postSt) {
        setChanged(postSt.changed)
      }
    }
  }, [])

  const canBatchPost = useMemo(() => (
    expertMode && permission.includes('one_touch_send_posts')
  ), [expertMode, permission])

  const handlePush = useCallback(path => {
    if (campaign.newClassExperience) {
      const search = !canBatchPost
        ? `?class=${cypher(`${classId}:${sectionId}`)}`
        : ''
      pushTo(`${path}${search}`)
    } else {
      pushTo(path)
    }
  }, [campaign.newClassExperience, classId, canBatchPost, pushTo, sectionId])

  const loadData = useCallback(async () => {
    const post = await api.getPost({ userId, postId });
    const uc = processClasses({ classes: userClasses.classList, segment });
    const { sectionId } = JSON.parse(uc[0].value);
    const { content, title, classId } = post
    setBody(content)
    setTitle(title)
    setClassId(classId)
    setSectionId(sectionId)
    const {
      postInfo: { feedId }
    } = post;

    logEvent({
      event: 'Feed- Edit Post',
      props: { 'Internal ID': feedId }
    });
  }, [postId, segment, userClasses.classList, userId])

  useEffect(() => {
    if (postId && userId) loadData()
    // const { classId, sectionId } = decypherClass()

    // setClassId(Number(classId))
    // setSectionId(Number(sectionId))
    logEvent({
      event: 'Home- Start Post',
      props: {}
    });

  }, [loadData, postId, userId])

  useEffect(() => {
    if (editor) {
      setPostToolbar(editor.getEditor().theme.modules.toolbar)
    }
  }, [editor])

  const updatePostSt = useCallback(async () => {
    setLoading(true)

    try {
      if (!body) {
        setLoading(false)
  
        setError({
          title: 'Please write something',
          body: 'Please input any description',
        })
        setErrorDialog(true)
        return
      }

      const res = await api.updatePostSt({
        postId,
        classId,
        title,
        content: body
      });

      if (!res.success) throw new Error('Couldnt update')

      enqueueSnackbar({
        notification: {
          message: `Successfully updated`,
          nextPath: `/post/${postId}`,
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

      localStorage.removeItem('postSt');
      handlePush(`/post/${postId}`);
      setLoading(false)
    } catch (err) {
      console.log('err', err)
      setLoading(false)
      setError({
        title: 'Unknown Error',
        body: 'Please try again',
      })
      setErrorDialog(true)
    }
  }, [body, classes.stackbar, enqueueSnackbar, handlePush, postId, classId, title])

  const createPostSt = useCallback(async () => {
    setLoading(true)
    try {
      if (canBatchPost && !classList.length) {
        setLoading(false)
        setError({
          title: 'Select one more classes',
          body: 'Please try again',
        })
        setErrorDialog(true)
        return
      }
      if (!canBatchPost && !classId && !sectionId) {
        setLoading(false)
        setError({
          title: 'Choose a class',
          body: 'Please try again',
        })
        setErrorDialog(true)
        return
      }
      if (!body) {
        setLoading(false)
        setError({
          title: 'Please write something',
          body: 'Please input any description',
        })
        setErrorDialog(true)
        return
      }

      setIsPosting()
      const {
        points,
        user: { firstName },
        classes: resClasses,
        postId,
      } = canBatchPost
        ? await api.createBatchPostSt({
          userId,
          title,
          sectionIds: classList.map(c => c.sectionId),
          body,
        })
        : await api.createPostSt({
          userId,
          title,
          content: body,
          anonymous: anonymousActive,
          classId,
          sectionId,
        });

      let hasError = false
      if (canBatchPost && resClasses) {
        resClasses.forEach(r => {
          if (r.status !== 'Success') hasError = true
        })
        if (hasError || resClasses.length === 0) {
          setLoading(false)
          setError({
            title: 'Error creating posts',
            body: 'Please try again',
          })
          setErrorDialog(true)
          return
        }
      }

      logEventLocally({
        category: 'Post',
        objectId: postId,
        type: 'Created',
      });

      if (
        points > 0 ||
        canBatchPost
      ){
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

      localStorage.removeItem('postSt');
      handlePush('/feed');
    } catch (err) {
      setLoading(false)
      setTitle('')
      setBody('')
    }
  }, [anonymousActive, body, canBatchPost, setIsPosting, classId, classList, classes.stackbar, enqueueSnackbar, handlePush, sectionId, title, userId])

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    if (postId) updatePostSt()
    else createPostSt()
  }, [createPostSt, postId, updatePostSt])

  const handleTextChange = useCallback(() => event => {
    setChanged(true)
    setTitle(event.target.value)
    if (localStorage.getItem('postSt')) {
      const currentPost = JSON.parse(localStorage.getItem('postSt'))
      currentPost.title = event.target.value
      currentPost.changed = true
      localStorage.setItem('postSt', JSON.stringify(currentPost))
    } else {
      const postSt = {
        title: event.target.value,
        changed: true,
      }
      localStorage.setItem('postSt', JSON.stringify(postSt));
    }
  }, [])

  const handleRTEChange = useCallback(value => {  
    setChanged(true)
    setBody(value)

    if (localStorage.getItem('postSt')) {
      const currentPost = JSON.parse(localStorage.getItem('postSt'))
      currentPost.body = value
      currentPost.changed = true
      localStorage.setItem('postSt', JSON.stringify(currentPost))
    } else {
      const postSt = {
        body: value,
        changed: true,
      }
      localStorage.setItem('postSt', JSON.stringify(postSt));
    }
  }, [])

  const handleErrorDialogClose = useCallback(() => {
    setErrorDialog(false)
    setError({ title: '', body: '' })
  }, [])

  const toggleAnonymousActive = useCallback(() => {
    setAnonymousActive(a => !a)
  }, [])

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
          buttonLabel={postId ? 'Save' : 'Post! 🚀'}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} sm={12}>
              <OutlinedTextValidator
                label="Title of Post"
                labelClass={classes.labelClass}
                inputClass={classes.textValidator}
                placeholder="This is optional, but it might help grab attention!"
                onChange={handleTextChange}
                name="title"
                value={title}
              />
            </Grid>
            <Grid item xs={12} sm={12} className={classes.quillGrid}>
              <ToolbarTooltip toolbar={postToolbar} toolbarClass={classes.toolbarClass} />
              <RichTextEditor
                setEditor={setEditor}
                placeholder="Looking for someone to study with? Wanna share your thoughts? Write anything! :) "
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
          title={error['title']}
          body={error['body']}
          handleClose={handleErrorDialogClose}
        />
      </ErrorBoundary>
    </div >
  );
}

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
)(withStyles(styles)(withRouter(CreatePostSt)));
