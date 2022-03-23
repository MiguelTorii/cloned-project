import React, { useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import ImageDialog from '../ImageDialog/ImageDialog';

import useStyles from './styles';

const ClickableImage = ({ src, className, alt }) => {
  const classes: any = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        className={clsx(className, classes.image)}
        alt={alt}
        onClick={() => setModalOpen(true)}
      />
      <ImageDialog open={modalOpen} imageUrl={src} onClose={() => setModalOpen(false)} />
    </>
  );
};

ClickableImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  alt: PropTypes.string
};
ClickableImage.defaultProps = {
  className: undefined,
  alt: 'Clickable'
};
export default ClickableImage;
