// @flow

import React from 'react';
import Lightbox from 'react-images';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import Image from "react-graceful-image";

const ImgComponent = React.forwardRef(({ item }, ref) => 
  <Image
    noLazyLoad
    ref={ref}
    style={{
      width: 120,
      height: 120
    }}
    src={item.thumbnail}
  />
)


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
  src: string,
  thumbnail: string
};

type Props = {
  classes: Object,
  images: Array<Images>
};

type State = {
  open: boolean,
  rotation: number,
  currentImage: number
};

class ImageGallery extends React.PureComponent<Props, State> {
  state = {
    open: false,
    rotation: 0,
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

  rotateLeft = () => {
    this.setState(prev => ({ 
      rotation: prev.rotation - 90
    }))
  }

  rotateRight = () => {
    this.setState(prev => ({ 
      rotation: prev.rotation + 90
    }))
  }

  render() {
    const { classes, images } = this.props;
    const { open, rotation, currentImage } = this.state;

    const rotate = (
      <div style={{ paddingTop: 10 }}>
        <RotateLeftIcon style={{ cursor: 'pointer' }} onClick={this.rotateLeft}/>
        <RotateRightIcon style={{ cursor: 'pointer' }} onClick={this.rotateRight} />
      </div>
    )

    return (
      <div className={classes.root}>
        <div className={classes.gallery}>
          {images.map((item, index) => (
            <ButtonBase
              key={item.thumbnail}
              className={classes.button}
              onClick={this.handleClick(index)}
              // style={{
              // backgroundImage: `url(${item.thumbnail})`,
              // backgroundSize: 'cover',
              // backgroundPosition: '50% 50%'
              // }}
            >
              <ImgComponent item={item} />
            </ButtonBase>
          ))}
        </div>
        <Lightbox
          key={rotation}
          preloadNextImage
          showThumbnails
          customControls={[rotate]}
          theme={{ figure: {transform: `rotate(${rotation}deg)`}}}
          images={images}
          currentImage={currentImage}
          isOpen={open}
          onClickPrev={this.handlePrevious}
          onClickNext={this.handleNext}
          onClose={this.handleClose}
          onClickThumbnail={this.handleClickThumbnail}
          backdropClosesModal
        />
      </div>
    );
  }
}

export default withStyles(styles)(ImageGallery);
