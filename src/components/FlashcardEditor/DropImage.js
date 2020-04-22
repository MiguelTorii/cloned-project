// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: 50,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.borderColor,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  uploadIconSize: {
    paddingTop: theme.spacing(),
    width: 31,
    height: 31,
    // color: '#909090'
  }
});

// type Image = {
//   id: string,
//   image: string,
//   loaded: boolean,
//   loading: boolean,
//   error: boolean
// };

type Props = {
  classes: Object,
  isDropzoneDisabled: boolean,
  onDrop: Function,
  onDropRejected: Function
};

class DropImage extends React.PureComponent<Props> {
  render() {
    const { classes, isDropzoneDisabled, onDrop, onDropRejected } = this.props;
    return (
      <div className={classes.root}>
        <Dropzone
          accept={['image/*']}
          onDrop={onDrop}
          onDropRejected={onDropRejected}
          maxSize={4 * 10000000}
          multiple={false}
          disabled={isDropzoneDisabled}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={classes.dropZone}>
                  <ImageIcon className={classes.uploadIconSize} />
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default withStyles(styles)(DropImage);
