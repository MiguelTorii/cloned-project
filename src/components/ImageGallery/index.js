// @flow

import React from 'react';
import Lightbox from 'react-images';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gallery: {
    width: '100%',
    height: '100%',
    maxHeight: 300,
    overflow: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  button: {
    margin: theme.spacing(),
    width: 120,
    height: 120
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

type State = {
  open: boolean,
  currentImage: number
};

class ImageGallery extends React.PureComponent<Props, State> {
  state = {
    open: false,
    currentImage: 0
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handlePrevious = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage === 0 ? 0 : currentImage - 1
    }));
  };

  handleNext = () => {
    const { images } = this.props;
    this.setState(({ currentImage }) => ({
      currentImage:
        currentImage === images.length ? currentImage : currentImage + 1
    }));
  };

  handleClickThumbnail = currentImage => {
    this.setState({ currentImage });
  };

  handleClick = index => () => {
    this.setState({ currentImage: index, open: true });
  };

  render() {
    const { classes, images } = this.props;
    const { open, currentImage } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.gallery}>
          {images.map((item, index) => (
            <ButtonBase
              key={item.thumbnail}
              className={classes.button}
              onClick={this.handleClick(index)}
              style={{
                backgroundImage: `url(${item.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: '50% 50%'
              }}
            />
          ))}
        </div>
        <Lightbox
          preloadNextImage
          showThumbnails
          images={images}
          currentImage={currentImage}
          isOpen={open}
          onClickPrev={this.handlePrevious}
          onClickNext={this.handleNext}
          onClose={this.handleClose}
          onClickThumbnail={this.handleClickThumbnail}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ImageGallery);
