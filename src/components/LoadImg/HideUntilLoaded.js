import React from 'react';
import PropTypes from 'prop-types';
import usePreloadImage from './usePreloadImage';
import { animations, easings } from './easings';
import './keyframes.css';

/**
 * Animates in a component once an image has loaded.
 *
 * Properties:
 * children
 * animationIn: {String} A named animation as defined in the theme animations
 * Spinner:     {Component} An optional spinner component
 * imageToLoad: {String} A URL of the image being loaded
 * style:       {Object} Custom style rules as required
 */

const HideUntilLoaded = ({
  animationIn,
  children,
  Spinner,
  imageToLoad,
  style
}) => {
  const [errored, loaded] = usePreloadImage(imageToLoad);

  const styles = {
    display: 'inline-block',
    position: 'relative',
    ...style
  };

  const contentStyles = {
    transition: 'none'
  };

  if (!loaded && !errored && imageToLoad) {
    contentStyles.opacity = 0;
    contentStyles.visibility = 'hidden';
  } else if (animationIn) {
    contentStyles.animation = animations[animationIn] || animationIn;
  } else {
    contentStyles.opacity = 1;
    contentStyles.transition = 'opacity 500ms ease-out';
  }

  const spinnerStyles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transition: `opacity 500ms ease-out, transform 0.5s ${easings.easeInOutBack}`
  };

  if (!loaded && !errored) {
    spinnerStyles.opacity = 1;
    spinnerStyles.transform = 'translate(-50%, -50%)';
  } else {
    spinnerStyles.opacity = 0;
    spinnerStyles.transform = 'translate(-50%, -50%) scale(0.8)';
  }

  return (
    <span style={styles}>
      <div className="hide-until-loaded-content" style={contentStyles}>
        {children}
      </div>
      {Spinner && (
        <div className="hide-until-loaded-spinner" style={spinnerStyles}>
          <Spinner />
        </div>
      )}
    </span>
  );
};

HideUntilLoaded.propTypes = {
  animationIn: PropTypes.string,
  children: PropTypes.any.isRequired,
  imageToLoad: PropTypes.string.isRequired,
  Spinner: PropTypes.any,
  style: PropTypes.object
};

export default HideUntilLoaded;
