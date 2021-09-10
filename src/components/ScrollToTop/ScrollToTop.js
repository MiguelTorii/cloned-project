import React, { useCallback, useEffect, useState } from 'react';
import useStyles from './styles';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import IconArrow from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const SCROLL_THRESHOLD = 100;

const ScrollToTop = ({ scrollElement }) => {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  const monitorScroll = useCallback(() => {
    const scrolled = (scrollElement || document.documentElement).scrollTop;
    if (scrolled > SCROLL_THRESHOLD) setVisible(true);
    else setVisible(false);
  }, [scrollElement]);

  const handleClick = useCallback(() => {
    (scrollElement || window).scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [scrollElement]);

  useEffect(() => {
    (scrollElement || window).addEventListener('scroll', monitorScroll);
    return () =>
      (scrollElement || window).removeEventListener('scroll', monitorScroll);
  }, [monitorScroll, scrollElement]);

  return (
    <GradientButton
      compact
      className={clsx(classes.root, !visible && 'invisible')}
      style={{
        right: scrollElement ? 8 : 0
      }}
      onClick={handleClick}
    >
      <IconArrow />
    </GradientButton>
  );
};

ScrollToTop.propTypes = {
  scrollElement: PropTypes.object
};

ScrollToTop.defaultProps = {
  scrollElement: null
};

export default ScrollToTop;
