// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import NotesForm from '../../components/NotesForm';
import UploadImages from '../UploadImages';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {
  loading: boolean
};

class CreateNotes extends React.PureComponent<Props, State> {
  state = {
    loading: false
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

  uploadImages: {
    handleUploadImages: Function
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div className={classes.root}>
        <NotesForm loading={loading} handleSubmit={this.handleSubmit}>
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
