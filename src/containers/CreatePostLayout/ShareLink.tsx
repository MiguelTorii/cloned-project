// @flow

import React from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { processClasses } from 'containers/ClassesSelector/utils';
import { withRouter } from 'react-router';
import { cypher } from 'utils/crypto';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import RichTextEditor from 'containers/RichTextEditor/RichTextEditor';
import postingImage from 'assets/gif/loading-rocket.gif';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm/CreatePostForm';
import OutlinedTextValidator from '../../components/OutlinedTextValidator/OutlinedTextValidator';
import LinkPreview from '../../components/LinkPreview/LinkPreview';
import SimpleErrorDialog from '../../components/SimpleErrorDialog/SimpleErrorDialog';
import {
  updateShareURL,
  createBatchShareLink,
  createShareLink,
  getShareLink
} from '../../api/posts';
import { logEvent, logEventLocally } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import type { CampaignState } from '../../reducers/campaign';

const styles = (theme) => ({
  preview: {
    padding: theme.spacing(2)
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
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
      borderColor: '#6515CF'
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
  },
  toolbarClass: {
    backgroundColor: theme.circleIn.palette.appBar
  },
  dialogPaper: {
    '&.MuiDialog-paper': {
      background: 'transparent',
      boxShadow: 'none'
    }
  },
  label: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: '65px',
    textAlign: 'center',
    marginTop: '-60px'
  },
  link: {
    color: theme.circleIn.palette.brand
  }
});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function,
  campaign: CampaignState,
  sharelinkId: number,
  location: {
    search: string
  },
  enqueueSnackbar: Function
};

type State = {
  loading: boolean,
  title: string,
  summary: string,
  url: string,
  preview: string,
  classId: number,
  sectionId: ?number,
  tags: Array<SelectType>,
  tagsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  changed: ?boolean,
  classList: array,
  errorBody: string,
  isPosting: boolean
};

class CreateShareLink extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const { classId: currentSelectedClassId, sectionId: curretnSelectedSectoinId } = props;

    this.state = {
      loading: false,
      title: '',
      summary: '',
      url: '',
      preview: '',
      classId: currentSelectedClassId || 0,
      sectionId: curretnSelectedSectoinId || 0,
      tags: [],
      changed: false,
      errorDialog: false,
      errorTitle: '',
      errorBody: '',
      editor: null,
      isPosting: false
    };
  }

  canBatchPost = () => {
    const {
      user: {
        expertMode,
        data: { permission }
      }
    } = this.props;

    return expertMode && permission.includes('one_touch_send_posts');
  };

  handlePush = (path) => {
    const { pushTo, campaign } = this.props;

    const { sectionId, classId } = this.state;

    if (campaign.newClassExperience) {
      const search = !this.canBatchPost() ? `?class=${cypher(`${classId}:${sectionId}`)}` : '';
      pushTo(`${path}${search}`);
    } else {
      pushTo(path);
    }
  };

  componentDidMount = () => {
    const { sharelinkId } = this.props;
    const { editor } = this.state;

    if (sharelinkId) {
      this.loadData();
    }

    // const { classId, sectionId } = decypherClass()
    // this.setState({ classId: Number(classId), sectionId: Number(sectionId) })

    if (localStorage.getItem('shareLink')) {
      const shareLink = JSON.parse(localStorage.getItem('shareLink'));

      if ('title' in shareLink) {
        this.setState({ title: shareLink.title });
      }
      if ('summary' in shareLink) {
        this.setState({ summary: shareLink.summary });
      }
      if ('url' in shareLink) {
        this.setState({ url: shareLink.url });
      }
      if ('changed' in shareLink) {
        this.setState({ changed: shareLink.changed });
      }
    }

    this.updatePreview = debounce(this.updatePreview, 1000);
    logEvent({
      event: 'Home- Start Share Link',
      props: {}
    });

    if (editor) {
      this.setState({
        resourceToolbar: editor.getEditor().theme.modules.toolbar
      });
    }
  };

  loadData = async () => {
    const {
      user: {
        data: { userId, segment },
        userClasses: { classList: classes }
      },
      sharelinkId
    } = this.props;
    try {
      const shareLink = await getShareLink({ userId, sharelinkId });
      const userClasses = processClasses({ classes, segment });
      const { sectionId } = JSON.parse(userClasses[0].value);
      const { classId, summary, title, uri } = shareLink;
      this.updatePreview(uri);
      this.setState({
        title,
        summary,
        url: uri,
        classId,
        sectionId
      });
      const {
        postInfo: { feedId }
      } = shareLink;

      logEvent({
        event: 'Feed- Edit Link',
        props: { 'Internal ID': feedId }
      });
    } catch (e) {
      this.handlePush('/feed');
    }
  };

  componentWillUnmount = () => {
    if (this.updatePreview.cancel && typeof this.updatePreview.cancel === 'function') {
      this.updatePreview.cancel();
    }
  };

  updateSharelink = async () => {
    this.setState({ loading: true });
    try {
      const {
        sharelinkId,
        user: {
          data: { userId = '' }
        }
      } = this.props;
      const { title, summary, url, classId, sectionId } = this.state;

      const res = await updateShareURL({
        userId,
        sharelinkId,
        title,
        summary,
        uri: url,
        classId,
        sectionId
      });

      if (!res.success) {
        throw new Error(`Couldn't update`);
      }

      logEvent({
        event: 'Feed- Update Share Link',
        props: {}
      });

      const { enqueueSnackbar, classes } = this.props;
      enqueueSnackbar({
        notification: {
          message: `Successfully updated`,
          nextPath: `/sharelink/${sharelinkId}`,
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

      localStorage.removeItem('shareLink');
      this.handlePush(`/sharelink/${sharelinkId}`);
      this.setState({ loading: false });
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  createSharelink = async () => {
    const { tags, classId, sectionId } = this.state;
    if (tags.length < 0) {
      return;
    }
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '' }
        },
        classList
      } = this.props;

      if (this.canBatchPost() && !classList.length) {
        this.setState({
          loading: false,
          errorDialog: true,
          errorTitle: 'Select one more classes',
          errorBody: 'Please try again'
        });
        return;
      }
      if (!this.canBatchPost() && !classId && !sectionId) {
        this.setState({
          loading: false,
          errorDialog: true,
          errorTitle: 'Choose a class',
          errorBody: 'Please try again'
        });
        return;
      }

      const { title, summary, url } = this.state;

      this.setState({ isPosting: true });

      const tagValues = tags.map((item) => Number(item.value));

      const res = this.canBatchPost()
        ? await createBatchShareLink({
            userId,
            title,
            summary,
            uri: url,
            sectionIds: classList.map((c) => c.sectionId),
            tags: tagValues
          })
        : await createShareLink({
            userId,
            title,
            summary,
            uri: url,
            classId,
            sectionId,
            tags: tagValues
          });

      const {
        points,
        linkId,
        classes: resClasses,
        user: { firstName }
      } = res;

      const { enqueueSnackbar, classes } = this.props;

      let hasError = false;
      if (this.canBatchPost()) {
        resClasses.forEach((r) => {
          if (r.status !== 'Success') {
            hasError = true;
          }
        });
        if (hasError || resClasses.length === 0) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Website not allowed',
            errorBody: (
              <div>
                It’s not you, it’s us! We maintain a whitelist of allowable URLs. The website you
                entered is not currently on our list. Please contact us at&nbsp;
                <a href="mailto:support@circleinapp.com" className={classes.link}>
                  support@circleinapp.com
                </a>
                &nbsp; and send us your link, we will review it and most likely allow it so you can
                share it with your classmates! Sorry for the inconvenience, we want to make sure we
                keep CircleIn a welcoming space for all.
              </div>
            ),
            isPosting: false
          });
          return;
        }
      }

      if (!this.canBatchPost() && !linkId) {
        this.setState({
          loading: false,
          errorDialog: true,
          errorTitle: 'Website not allowed',
          errorBody: (
            <div>
              It’s not you, it’s us! We maintain a whitelist of allowable URLs. The website you
              entered is not currently on our list. Please contact us at&nbsp;
              <a href="mailto:support@circleinapp.com" className={classes.link}>
                support@circleinapp.com
              </a>
              &nbsp; and send us your link, we will review it and most likely allow it so you can
              share it with your classmates! Sorry for the inconvenience, we want to make sure we
              keep CircleIn a welcoming space for all.
            </div>
          ),
          isPosting: false
        });
        return;
      }

      logEvent({
        event: 'Feed- Share Link',
        props: {}
      });

      logEventLocally({
        category: 'Link',
        objectId: linkId,
        type: 'Created'
      });

      if (points > 0 || this.canBatchPost()) {
        enqueueSnackbar({
          notification: {
            message: !this.canBatchPost()
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
      localStorage.removeItem('shareLink');
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

  handleSubmit = (event) => {
    event.preventDefault();
    const { sharelinkId } = this.props;
    if (sharelinkId) {
      this.updateSharelink();
    } else {
      this.createSharelink();
    }
  };

  handleTextChange = (name) => (event) => {
    this.setState({ [name]: event.target.value, changed: true });
    if (name === 'url') {
      this.updatePreview(event.target.value);
    }

    if (localStorage.getItem('shareLink')) {
      const currentShareLink = JSON.parse(localStorage.getItem('shareLink'));
      currentShareLink[name] = event.target.value;
      currentShareLink.changed = true;
      localStorage.setItem('shareLink', JSON.stringify(currentShareLink));
    } else {
      const shareLink = {
        [name]: event.target.value,
        changed: true
      };
      localStorage.setItem('shareLink', JSON.stringify(shareLink));
    }
  };

  handleRTEChange = (value) => {
    this.setState({ summary: value, changed: true });

    if (localStorage.getItem('shareLink')) {
      const currentShareLink = JSON.parse(localStorage.getItem('shareLink'));
      currentShareLink.summary = value;
      currentShareLink.changed = true;
      localStorage.setItem('shareLink', JSON.stringify(currentShareLink));
    } else {
      const shareLink = {
        summary: value,
        changed: true
      };
      localStorage.setItem('shareLink', JSON.stringify(shareLink));
    }
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  updatePreview = (value) => {
    this.setState({ preview: value });
  };

  setEditor = (editor) => {
    this.setState(editor);
  };

  render() {
    const { sharelinkId, classes } = this.props;
    const {
      loading,
      resourceToolbar,
      title,
      summary,
      url,
      preview,
      errorDialog,
      changed,
      errorTitle,
      errorBody,
      isPosting
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            loading={loading}
            buttonLabel={sharelinkId ? 'Save' : 'Post! 🚀'}
            changed={changed}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={12} md={12}>
                <OutlinedTextValidator
                  required
                  label="Title of Post"
                  labelClass={classes.labelClass}
                  inputClass={classes.textValidator}
                  placeholder="e.g. A colorful Periodic Table"
                  onChange={this.handleTextChange}
                  name="title"
                  value={title}
                  validators={['required']}
                  errorMessages={['Title is required']}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} className={classes.quillGrid}>
                <ToolbarTooltip toolbar={resourceToolbar} toolbarClass={classes.toolbarClass} />
                <RichTextEditor
                  setEditor={this.setEditor}
                  placeholder="(Optional) Write a description to help your classmates understand what resource(s) you’re sharing."
                  value={summary}
                  onChange={this.handleRTEChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <OutlinedTextValidator
                  required
                  label="Type/Paste URL here"
                  labelClass={classes.labelClass}
                  inputClass={classes.textValidator}
                  placeholder="Share links to PDFs, PowerPoints, YouTube, Google Drive or DropBox documents or a URL here."
                  onChange={this.handleTextChange}
                  name="url"
                  value={url}
                  validators={['required']}
                  errorMessages={['URL is required']}
                />
              </Grid>
              {/*
              <Grid item xs={12} sm={12} md={12}>
                <OutlinedTextValidator
                  required
                  label="Description"
                  labelClass={classes.labelClass}
                  inputClass={classes.textValidator}
                  placeholder="Type a description to help your classmates "
                  onChange={this.handleTextChange}
                  name="summary"
                  multiline
                  rows={2}
                  value={summary}
                  validators={['required']}
                  errorMessages={['Description is required']}
                />
              </Grid> */}

              <Grid item xs={12} sm={12} md={12} className={classes.preview}>
                <LinkPreview uri={preview} />
              </Grid>
            </Grid>
          </CreatePostForm>
        </ErrorBoundary>
        <ErrorBoundary>
          <Dialog
            open={isPosting}
            classes={{
              paper: classes.dialogPaper
            }}
          >
            <img src={postingImage} alt="Posting" className={classes.postingImage} />
            <div className={classes.label}>Posting...</div>
          </Dialog>
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
)(withStyles(styles)(withRouter(CreateShareLink)));
