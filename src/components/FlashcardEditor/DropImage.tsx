import React from 'react';

import Dropzone from 'react-dropzone';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';

import { styles } from '../_styles/FlashcardEditor/DropImage';
// type Image = {
//   id: string,
//   image: string,
//   loaded: boolean,
//   loading: boolean,
//   error: boolean
// };
type Props = {
  classes: Record<string, any>;
  isDropzoneDisabled: boolean;
  onDrop: (...args: Array<any>) => any;
  onDropRejected: (...args: Array<any>) => any;
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

export default withStyles(styles as any)(DropImage);
