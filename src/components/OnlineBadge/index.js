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
      bottom: ({ fromChat }) => fromChat ? 0 : 2,
      right: ({ fromChat }) => fromChat ? 0: 2,
      width: ({ fromChat }) => fromChat ? 11 : 32,
      height: ({ fromChat }) => fromChat ? 11 : 32,
      boxShadow: props => `${get(theme, props.bgColorPath)} 0 0 0 ${props.fromChat ? 3 : 7}px`,
      borderRadius: '50%',
      backgroundColor: props => props.isOnline ? greenRingColor : get(theme, props.bgColorPath),
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: props => `${props.fromChat ? 3 : 8.5}px solid ${props.isOnline ? greenRingColor : grayRingColor}`,
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
  fromChat: boolean,
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
  fromChat: true,
  bgColorPath: "circleIn.palette.modalBackground",
}

export default withStyles(styles)(OnlineBadge);
