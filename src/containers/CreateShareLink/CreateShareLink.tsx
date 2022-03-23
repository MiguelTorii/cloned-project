import React from 'react';

import { push } from 'connected-react-router';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { PERMISSIONS } from 'constants/common';
import { cypherClass, decypherClass } from 'utils/crypto';

import * as notificationsActions from 'actions/notifications';
import { logEvent, logEventLocally } from 'api/analytics';
import { updateShareURL, createBatchShareLink, createShareLink, getShareLink } from 'api/posts';
import CreatePostForm from 'components/CreatePostForm/CreatePostForm';
import LinkPreview from 'components/LinkPreview/LinkPreview';
import OutlinedTextValidator from 'components/OutlinedTextValidator/OutlinedTextValidator';
import SimpleErrorDialog from 'components/SimpleErrorDialog/SimpleErrorDialog';

import ClassesSelector from '../ClassesSelector/ClassesSelector';
import { processClasses } from '../ClassesSelector/utils';
import ClassMultiSelect from '../ClassMultiSelect/ClassMultiSelect';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tooltip from '../Tooltip/Tooltip';

import type { UserState } from 'reducers/user';
import type { SelectType } from 'types/models';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
  preview: {
    padding: theme.spacing(2)
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  pushTo?: (...args: Array<any>) => any;
  sharelinkId?: number;
  location?: {
    pathname: string;
    search: string;
  };
  enqueueSnackbar?: (...args: Array<any>) => any;
};
type State = {
  loading: boolean;
  title: string;
  summary: string;
  url: string;
  preview: string;
  classId: number;
  sectionId: number | null | undefined;
  tags: Array<SelectType>;
  errorDialog: boolean;
  errorTitle: string;
  changed: boolean | null | undefined;
  classList: any[];
  errorBody: string;
};

class CreateShareLink extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    summary: '',
    url: '',
    preview: '',
    classId: 0,
    classList: [],
    sectionId: null,
    tags: [],
    changed: null,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  canBatchPost = () => {
    const {
      user: {
        expertMode,
        data: { permission }
      }
    } = this.props;
    return expertMode && permission.includes(PERMISSIONS.ONE_TOUCH_SEND_POSTS);
  };

  handlePush = (path) => {
    const { pushTo } = this.props;
    const { sectionId, classId } = this.state;
    const search = !this.canBatchPost() ? `?class=${cypherClass({ classId, sectionId })}` : '';

    pushTo(`${path}${search}`);
  };

  componentDidMount = () => {
    const { sharelinkId } = this.props;

    if (sharelinkId) {
      this.loadData();
    }

    const { classId, sectionId } = decypherClass();
    this.setState({
      classId: Number(classId),
      sectionId: Number(sectionId)
    });
    this.updatePreview = debounce(this.updatePreview, 1000);
    logEvent({
      event: 'Home- Start Share Link',
      props: {}
    });
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
      const shareLink = await getShareLink({
        userId,
        sharelinkId
      });
      const userClasses = processClasses({
        classes,
        segment
      });
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
        props: {
          'Internal ID': feedId
        }
      });
    } catch (e) {
      this.handlePush('/feed');
    }
  };

  componentWillUnmount = () => {
    if (
      (this.updatePreview as any).cancel &&
      typeof (this.updatePreview as any).cancel === 'function'
    ) {
      (this.updatePreview as any).cancel();
    }
  };

  updateSharelink = async () => {
    this.setState({
      loading: true
    });

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
      this.handlePush(`/sharelink/${sharelinkId}`);
      this.setState({
        loading: false
      });
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
    const { tags } = this.state;

    if (tags.length < 0) {
      return;
    }

    this.setState({
      loading: true
    });

    try {
      const {
        user: {
          data: { userId = '' }
        }
      } = this.props;
      const { classList, title, summary, url, classId, sectionId } = this.state;
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
        resClasses.forEach((r: any) => {
          if (r.status !== 'Success') {
            hasError = true;
          }
        });

        if (hasError || resClasses.length === 0) {
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Website not allowed',
            errorBody: `We're sorry, the website you entered is not allowed on CircleIn at this time, please contact support@circleinapp.com if you'd like for us to allow this website to be shared with your classmates`
          });
          return;
        }
      }

      if (!this.canBatchPost() && !linkId) {
        this.setState({
          loading: false,
          errorDialog: true,
          errorTitle: 'Website not allowed',
          errorBody: `We're sorry, the website you entered is not allowed on CircleIn at this time, please contact support@circleinapp.com if you'd like for us to allow this website to be shared with your classmates`
        });
        return;
      }

      logEvent({
        event: 'Feed- Share Link',
        props: {}
      });
      logEventLocally({
        category: 'Link',
        objectId: String(linkId),
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
    this.setState({
      [name]: event.target.value,
      changed: true
    } as any);

    if (name === 'url') {
      this.updatePreview(event.target.value);
    }
  };

  handleClassChange = ({ classId, sectionId }: { classId: number; sectionId: number }) => {
    const { user } = this.props;
    const selected = user.userClasses.classList.find((c) => c.classId === classId);

    if (selected) {
      this.setState({
        classList: [selected]
      });
    }

    this.setState({
      classId,
      sectionId
    });
  };

  handleClasses = (classList) => {
    this.setState({
      classList
    });

    if (classList.length > 0) {
      this.setState({
        sectionId: classList[0].sectionId,
        classId: classList[0].classId
      });
    } else {
      this.setState({
        sectionId: null,
        classId: 0
      });
    }
  };

  handleErrorDialogClose = () => {
    this.setState({
      errorDialog: false,
      errorTitle: '',
      errorBody: ''
    });
  };

  updatePreview = (value) => {
    this.setState({
      preview: value
    });
  };

  render() {
    const {
      location: { pathname },
      sharelinkId,
      classes
    } = this.props;
    const {
      loading,
      title,
      classId,
      sectionId,
      summary,
      url,
      preview,
      errorDialog,
      classList,
      changed,
      errorTitle,
      errorBody
    } = this.state;
    const isEdit = pathname.includes('/edit');
    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title="Share Resource"
            subtitle="If you find something helpful or insightful, get the link, and share with your classmates. You’ll find out quickly that other students will benefit like you."
            loading={loading}
            buttonLabel={sharelinkId ? 'Save' : 'Create'}
            changed={changed}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={12} md={2}>
                <Typography variant="subtitle1">{"What's the title of your resource?"}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={10}>
                <OutlinedTextValidator
                  label="Title"
                  onChange={this.handleTextChange}
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
              <Grid item xs={12} sm={12} md={2}>
                <Typography variant="subtitle1">Url</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={10}>
                <OutlinedTextValidator
                  label="Url"
                  onChange={this.handleTextChange}
                  name="url"
                  value={url}
                  validators={['required']}
                  errorMessages={['URL is required']}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2}>
                <Typography variant="subtitle1">Class</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={10}>
                {this.canBatchPost() && !isEdit ? (
                  <Tooltip
                    id={9050}
                    placement="right"
                    text="In Expert Mode, you can post the same thing in more than one class! 🙌"
                  >
                    <ClassMultiSelect selected={classList} onSelect={this.handleClasses} />
                  </Tooltip>
                ) : (
                  <ClassesSelector
                    classId={classId}
                    sectionId={sectionId}
                    onChange={this.handleClassChange}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={2} />
              <Grid item xs={12} sm={12} md={10} className={classes.preview}>
                <LinkPreview uri={preview} />
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

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      pushTo: push,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(withRouter(CreateShareLink)));
