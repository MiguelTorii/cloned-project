// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import styles from '../_styles/OnlineBadge';

type Props = {
  classes: Object,
  backColor: string,
  children: Node,
  isVisible?: boolean,
  isOnline?: boolean,
  fromChat?: boolean,
  bgColorPath?: string
};

const OnlineBadge = ({ isVisible, classes, children }: Props) =>
  isVisible ? (
    <span className={classes.root}>
      {children}
      <span className={classes.badge}></span>
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

export default withStyles(styles)(OnlineBadge);
