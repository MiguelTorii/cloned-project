import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import get from "lodash/get";

const styles = theme => {
  const greenRingColor = theme.circleIn.palette.success;
  const grayRingColor = '#5F6165';

  return {
    root: {
      position: 'relative',
      display: 'inline-flex',
    },
    badge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 11,
      height: 11,
      boxShadow: props => `0 0 0 3px ${get(theme, props.bgColorPath)}`,
      borderRadius: '50%',
      backgroundColor: props => props.isOnline ? greenRingColor : get(theme, props.bgColorPath),
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: props => `3px solid ${props.isOnline ? greenRingColor : grayRingColor}`,
        content: '""',
      },
    }
  };
};

type Props = {
  classes: Object,
  isVisible: boolean,
  isOnline: boolean,
  backColor: string,
  children: Node,
};

const OnlineBadge = ({ isVisible, classes, children }: Props) => (
  isVisible ? (
    <span className={classes.root}>
      {children}
      <span className={classes.badge}></span>
    </span>
  ) : (
    children
  )
)

OnlineBadge.defaultProps = {
  isVisible: true,
  isOnline: false,
  bgColorPath: "circleIn.palette.modalBackground",
}

export default withStyles(styles)(OnlineBadge);
