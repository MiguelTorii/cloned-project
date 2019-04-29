// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gallery: {
    width: 600
  }
});

type Images = {
  original: string,
  thumbnail: string
};

type Props = {
  classes: Object,
  images: Array<Images>
};

class ImageGallery extends React.PureComponent<Props> {
  render() {
    const { classes, images } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.gallery}>
          <Gallery
            items={images}
            lazyLoad
            thumbnailPosition="bottom"
            showPlayButton={false}
            showBullets
            showIndex
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ImageGallery);
