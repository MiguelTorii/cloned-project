// @flow

import React from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import CreatePostForm from '../../components/CreatePostForm';
import ClassesManager from '../ClassesManager';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import LinkPreview from '../../components/LinkPreview';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createShareLink } from '../../api/posts';

const styles = theme => ({
  preview: {
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function
};

type State = {
  loading: boolean,
  title: string,
  url: string,
  preview: string,
  userClass: number | string,
  tags: Array<SelectType>,
  tagsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string
};

class CreateShareLink extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    url: '',
    preview: '',
    userClass: '',
    tags: [],
    tagsError: false,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  componentDidMount = () => {
    this.updatePreview = debounce(this.updatePreview, 1000);
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { tags } = this.state;
    if (tags.length === 0) {
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
      const { title, url, userClass } = this.state;

      const tagValues = tags.map(item => Number(item.value));
      await createShareLink({
        userId,
        title,
        uri: url,
        classId: Number(userClass),
        tags: tagValues
      });
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

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value });
    if (name === 'url') this.updatePreview(event.target.value);
  };

  handleClassChange = event => {
    this.setState({ userClass: event.target.value });
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
    const { classes } = this.props;
    const {
      loading,
      title,
      url,
      preview,
      userClass,
      tags,
      tagsError,
      errorDialog,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <CreatePostForm
          title="Share Link"
          loading={loading}
          handleSubmit={this.handleSubmit}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="subtitle1">
                {"What's the title of your link??"}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <OutlinedTextValidator
                label="Title"
                onChange={this.handleTextChange}
                name="title"
                value={title}
                validators={['required']}
                errorMessages={['Title is required']}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Class</Typography>
            </Grid>
            <Grid item xs={10}>
              <ClassesManager
                value={userClass}
                onChange={this.handleClassChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Url</Typography>
            </Grid>
            <Grid item xs={10}>
              <OutlinedTextValidator
                label="Url"
                onChange={this.handleTextChange}
                name="url"
                value={url}
                validators={['required']}
                errorMessages={['URL is required']}
              />
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={10} className={classes.preview}>
              <LinkPreview uri={preview} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Tags</Typography>
            </Grid>
            <Grid item xs={10}>
              <TagsAutoComplete
                tags={tags}
                error={tagsError}
                onChange={this.handleTagsChange}
              />
            </Grid>
          </Grid>
        </CreatePostForm>
        <SimpleErrorDialog
          open={errorDialog}
          title={errorTitle}
          body={errorBody}
          handleClose={this.handleErrorDialogClose}
        />
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
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateShareLink));
