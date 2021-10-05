import React, { useCallback, useEffect, useState } from 'react';
import IconArrow from '@material-ui/icons/ArrowUpward';
import clsx from 'clsx';
import GradientButton from '../Basic/Buttons/GradientButton';
import useStyles from './styles';

const SCROLL_THRESHOLD = 100;

const ScrollToTop = ({ scrollElement }) => {
  const classes: any = useStyles();
  const [visible, setVisible] = useState(false);
  const monitorScroll = useCallback(() => {
    const scrolled = (scrollElement || document.documentElement).scrollTop;

    if (scrolled > SCROLL_THRESHOLD) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [scrollElement]);
  const handleClick = useCallback(() => {
    (scrollElement || window).scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [scrollElement]);
  useEffect(() => {
    (scrollElement || window).addEventListener('scroll', monitorScroll);
    return () => (scrollElement || window).removeEventListener('scroll', monitorScroll);
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

ScrollToTop.defaultProps = {
  scrollElement: null
};
export default ScrollToTop;
