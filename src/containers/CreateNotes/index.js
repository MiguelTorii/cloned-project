// @flow

import React from 'react';
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
import UploadImages from '../UploadImages';
import ClassesSelector from '../ClassesSelector';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import TagsAutoComplete from '../TagsAutoComplete';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import { createPhotoNote } from '../../api/posts';

const styles = () => ({});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function
};

type State = {
  loading: boolean,
  title: string,
  classId: number,
  sectionId: ?number,
  summary: string,
  tags: Array<SelectType>,
  tagsError: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    classId: 0,
    sectionId: null,
    summary: '',
    tags: [],
    tagsError: false,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
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
    if (this.uploadImages) {
      try {
        const {
          user: {
            data: { userId = '' }
          },
          pushTo
        } = this.props;
        const { title, classId, sectionId, summary } = this.state;
        const images = await this.uploadImages.handleUploadImages();
        const fileNames = images.map(item => item.id);
        const tagValues = tags.map(item => Number(item.value));
        await createPhotoNote({
          userId,
          title,
          classId,
          sectionId,
          fileNames,
          comment: summary,
          tags: tagValues
        });
        pushTo('/feed');
      } catch (err) {
        if (err.message === 'no images')
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Error',
            errorBody: 'You must add at least 1 image'
          });
        else
          this.setState({
            loading: false,
            errorDialog: true,
            errorTitle: 'Unknown Error',
            errorBody: 'Please try again'
          });
      }
    }
  };

  handleTextChange = name => event => {
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

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  uploadImages: {
    handleUploadImages: Function
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      title,
      summary,
      tags,
      tagsError,
      errorDialog,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <div className={classes.root}>
        <CreatePostForm
          title="Share Notes"
          loading={loading}
          handleSubmit={this.handleSubmit}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="subtitle1">Title</Typography>
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
              <ClassesSelector onChange={this.handleClassChange} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Summary</Typography>
            </Grid>
            <Grid item xs={10}>
              <OutlinedTextValidator
                label="Summary"
                onChange={this.handleTextChange}
                name="summary"
                multiline
                rows={4}
                value={summary}
                validators={['required']}
                errorMessages={['Summary is required']}
              />
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
            <Grid item xs={2}>
              <Typography variant="subtitle1">Notes</Typography>
            </Grid>
            <Grid item xs={10}>
              <UploadImages
                innerRef={node => {
                  this.uploadImages = node;
                }}
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
)(withStyles(styles)(CreateNotes));
