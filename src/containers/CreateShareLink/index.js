// @flow

import React from 'react';
import debounce from 'lodash/debounce';
// import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { processClasses } from 'containers/ClassesSelector/utils';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import LinkPreview from '../../components/LinkPreview';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { updateShareURL, createShareLink , getShareLink } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import * as notificationsActions from '../../actions/notifications';
import ErrorBoundary from '../ErrorBoundary';
import { getUserClasses } from '../../api/user';


const styles = theme => ({
  preview: {
    padding: theme.spacing(2)
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function,
  sharelinkId: number,
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
  errorBody: string
};

class CreateShareLink extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    summary: '',
    url: '',
    preview: '',
    classId: 0,
    sectionId: null,
    tags: [],
    changed: null,
    tagsError: false,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  componentDidMount = () => {
    const { sharelinkId } = this.props
    if (sharelinkId) this.loadData()

    this.updatePreview = debounce(this.updatePreview, 1000);
    logEvent({
      event: 'Home- Start Share Link',
      props: {}
    });
  };

  loadData = async () => {
    const {
      pushTo,
      user: {
        data: { userId, segment }
      },
      sharelinkId
    } = this.props;
    try {
      const shareLink = await getShareLink({ userId, sharelinkId });
      const { classes } = await getUserClasses({ userId });
      const userClasses = processClasses({ classes, segment });
      const { sectionId } = JSON.parse(userClasses[0].value);
      const { classId, summary, title, uri} = shareLink
      this.updatePreview(uri)
      this.setState({ 
        title,
        summary,
        url: uri,
        classId,
        sectionId,
      });
      const {
        postInfo: { feedId }
      } = shareLink;

      logEvent({
        event: 'Feed- Edit Link',
        props: { 'Internal ID': feedId }
      });
    } catch(e) {
      pushTo('/feed')
    }
  };
  
  componentWillUnmount = () => {
    if (
      this.updatePreview.cancel &&
      typeof this.updatePreview.cancel === 'function'
    )
      this.updatePreview.cancel();
  };

  updateSharelink = async () => {
    this.setState({ loading: true });
    try {
      const {
        sharelinkId,
        pushTo,
        user: {
          data: { userId = '' }
        },
      } = this.props;
      const { title, summary, url, classId, sectionId } = this.state;

      const res = await updateShareURL({
        userId,
        sharelinkId,
        title,
        summary,
        uri: url,
        classId,
        sectionId,
      });

      if (!res.success) throw new Error(`Couldn't update`)

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
      
      pushTo(`/sharelink/${sharelinkId}`)
      this.setState({ loading: false })
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
      this.setState({ tagsError: true });
      return;
    }
    this.setState({ tagsError: false });
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId = '' }
        },
        pushTo
      } = this.props;
      const { title, summary, url, classId, sectionId } = this.state;

      const tagValues = tags.map(item => Number(item.value));

      const {
        points,
        user: { firstName }
      } = await createShareLink({
        userId,
        title,
        summary,
        uri: url,
        classId,
        sectionId,
        tags: tagValues
      });

      logEvent({
        event: 'Feed- Share Link',
        props: {}
      });

      if (points > 0) {
        const { enqueueSnackbar, classes } = this.props;
        enqueueSnackbar({
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

      pushTo('/feed');
    } catch (err) {
      this.setState({
        loading: false,
        errorDialog: true,
        errorTitle: 'Unknown Error',
        errorBody: 'Please try again'
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const {sharelinkId} = this.props
    if(sharelinkId) this.updateSharelink()
    else this.createSharelink()
  }

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value, changed: true });
    if (name === 'url') this.updatePreview(event.target.value);
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

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  updatePreview = value => {
    this.setState({ preview: value });
  };

  render() {
    const { sharelinkId, classes } = this.props;
    const {
      loading,
      title,
      classId,
      sectionId,
      summary,
      url,
      preview,
      tags,
      tagsError,
      errorDialog,
      changed,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <CreatePostForm
            title="Share Link"
            subtitle="If you find something helpful or insightful, get the link, and share with your classmates. You’ll find out quickly that other students will benefit like you."
            loading={loading}
            buttonLabel={sharelinkId ? 'Save' : 'Create'}
            changed={changed}
            handleSubmit={this.handleSubmit}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  What's the title of your link??
                </Typography>
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
                  classId={classId}
                  sectionId={sectionId}
                  onChange={this.handleClassChange} 
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
                <Typography variant="subtitle1">Url</Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <OutlinedTextValidator
                  label="Url"
                  onChange={this.handleTextChange}
                  name="url"
                  value={url}
                  validators={['required']}
                  errorMessages={['URL is required']}
                />
              </Grid>
              <Grid item xs={12} sm={2} />
              <Grid item xs={12} sm={10} className={classes.preview}>
                <LinkPreview uri={preview} />
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
)(withStyles(styles)(CreateShareLink));
