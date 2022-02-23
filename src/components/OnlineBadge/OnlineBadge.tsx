import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from '../_styles/OnlineBadge';

type Props = {
  classes?: Record<string, any>;
  isVisible?: boolean;
  isOnline?: boolean;
  backColor?: string;
  fromChat?: boolean;
  children?: any;
  bgColorPath?: string;
  largeImage?: boolean;
};

const OnlineBadge = ({ classes, isVisible, children }: Props) =>
  isVisible ? (
    <span className={classes.root}>
      {children}
      <span className={classes.badge} />
    </span>
  ) : (
    children
  );

OnlineBadge.defaultProps = {
  isVisible: true,
  isOnline: false,
  fromChat: true,
  bgColorPath: 'circleIn.palette.modalBackground'
};
export default withStyles(styles as any)(OnlineBadge);
