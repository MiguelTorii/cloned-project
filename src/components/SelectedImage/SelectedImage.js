import React, { useCallback, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import LoadImg from 'components/LoadImg/LoadImg';
import Lightbox from 'react-images';
import clsx from 'clsx';
import { useStyles } from '../_styles/SelectedImage';

const SelectedImage = ({
  handleRemoveImg,
  image,
  alt = '',
  className,
  disableContainerStyles,
  imageStyle
}) => {
  const classes = useStyles();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const onHoverEnter = useCallback(() => setHover(true), []);
  const onHoverLeave = useCallback(() => setHover(false), []);

  const onOpenImage = useCallback(() => setOpen(true), []);
  const onCloseImage = useCallback(() => setOpen(false), []);

  return (
    <div
      className={clsx(!disableContainerStyles && classes.imgContainer)}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      <LoadImg url={image} style={imageStyle} alt={alt} className={className} />
      <div className={clsx(classes.buttonGroup, !hover && classes.hidden)}>
        <Button className={classes.button} onClick={onOpenImage}>
          <SearchIcon fontSize="small" />
        </Button>
        {handleRemoveImg && (
          <Button className={classes.button} onClick={handleRemoveImg}>
            <ClearIcon fontSize="small" />
          </Button>
        )}
      </div>
      {open && (
        <Lightbox
          backdropClosesModal
          images={[{ src: image }]}
          isOpen
          onClose={onCloseImage}
        />
      )}
    </div>
  );
};

export default SelectedImage;
