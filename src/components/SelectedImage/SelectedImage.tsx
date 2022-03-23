import React, { useCallback, useState } from 'react';

import clsx from 'clsx';
import Lightbox from 'react-images';

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { useStyles } from '../_styles/SelectedImage';
import LoadImg from '../LoadImg/LoadImg';

type Props = {
  handleRemoveImg?: any;
  image?: any;
  alt?: string;
  className?: any;
  disableContainerStyles?: any;
  imageStyle?: any;
};

const SelectedImage = ({
  handleRemoveImg,
  image,
  alt = '',
  className,
  disableContainerStyles,
  imageStyle
}: Props) => {
  const classes: any = useStyles();
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
          images={[
            {
              src: image
            }
          ]}
          isOpen
          onClose={onCloseImage}
        />
      )}
    </div>
  );
};

export default SelectedImage;
