// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NotesForm from '../../components/NotesForm';
import UploadImages from '../UploadImages';
import ClassesManager from '../ClassesManager';
import OutlinedTextValidator from '../../components/OutlinedTextValidator';
import TagsAutoComplete from '../TagsAutoComplete';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {
  loading: boolean,
  title: string,
  userClass: number | string,
  summary: string
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    title: '',
    userClass: '',
    summary: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.uploadImages) {
      this.uploadImages.handleUploadImages().then(images => {
        console.log(images);
        this.setState({ loading: false });
      });
    }
  };

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClassChange = event => {
    this.setState({ userClass: event.target.value });
  };

  uploadImages: {
    handleUploadImages: Function
  };

  render() {
    const { classes } = this.props;
    const { loading, title, userClass, summary } = this.state;
    return (
      <div className={classes.root}>
        <NotesForm loading={loading} handleSubmit={this.handleSubmit}>
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
              <ClassesManager
                value={userClass}
                onChange={this.handleClassChange}
              />
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
              <TagsAutoComplete />
            </Grid>
          </Grid>
          <UploadImages
            innerRef={node => {
              this.uploadImages = node;
            }}
          />
        </NotesForm>
      </div>
    );
  }
}

export default withStyles(styles)(CreateNotes);
