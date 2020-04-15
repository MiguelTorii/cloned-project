// @flow

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MuiTooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Fade';
import { withRouter } from 'react-router';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user'

const styles = theme => ({
  tooltip: {
    background: '#7572f7',
    borderRadius: 8,
    padding: '8px 12px',
    pointerEvents: 'initial',
    width: 255,
  },
  text: {
    lineHeight: 1.4,
  },
  arrow: {
    color: '#7572f7',
    fontSize: 12,
    marginTop: 0,
  },
  button: {
    borderColor: theme.circleIn.palette.primaryText1,
    color: theme.circleIn.palette.primaryText1,
    marginTop: 16,
    marginBottom: 2,
  },
  close: {
    marginRight: -4,
    marginTop: -2,
    textAlign: 'right'
  }
});

type Props = {
  children: Object | Array<Object>,
  classes: Object,
  confirmTooltip: Function,
  dialogVisible: boolean,
  delay: ?number,
  id: number,
  hidden: ?boolean,
  location: { pathname: string },
  placement: string,
  text: string,
  viewedOnboarding: boolean,
  viewedTooltips: Array<number>
};

const Tooltip = ({
  children,
  classes,
  confirmTooltip,
  delay = 2000,
  dialogVisible,
  id,
  hidden = false,
  location: { pathname },
  placement,
  text,
  viewedOnboarding,
  viewedTooltips
}: Props) => {

  const CHAT = 3292;
  const LEADERBOARD = 6938;
  const BOOKMARKS = 9043;
  const THANKS = 2197;
  const FLASHCARDS = 1194;
  const NEW_POST = 5792;

  const TRANSITION_TIME = 750;

  const [open, setOpen] = useState(false);

  const timer = useRef();

  const isOpen = () => {
    let result = true;
    clearTimeout(timer.current);

    if (
      hidden
      || id === LEADERBOARD
      || dialogVisible
      || !viewedOnboarding // Onboarding not completed
      || viewedTooltips === null // Data still loading
      || viewedTooltips.includes(id) // Tooltip already dismissed by user
    ) {
      result = false;
    } else {
      switch(id) {
      case CHAT:
        result = true;
        break;
      case FLASHCARDS:
        result = viewedTooltips.includes(CHAT);
        break;
      case NEW_POST:
        result = (
          viewedTooltips.includes(CHAT) &&
          pathname.indexOf('/feed') === 0
        );
        break;
      case BOOKMARKS:
        result = (
          viewedTooltips.includes(CHAT)
        );
        break;
      case THANKS:
        result = (
          viewedTooltips.includes(CHAT) &&
          viewedTooltips.includes(BOOKMARKS)
        );
        break;
      default:
        result = true;
      }
    }

    if (result) {
      timer.current = setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(false);
    }
  }

  const onClick = (e) => {
    e.stopPropagation();
    confirmTooltip(id);
  }

  useEffect(() => {
    isOpen();
  }, [dialogVisible, hidden, viewedOnboarding, viewedTooltips])

  return (
    <MuiTooltip
      arrow
      classes={{
        arrow: classes.arrow,
        tooltip: classes.tooltip,
      }}
      open={open}
      placement={placement}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: TRANSITION_TIME }}
      title={
        <div className={classes.tooltipContent}>
          <div className={classes.close}>
            <CloseIcon
              fontSize="small"
              onClick={(e) => onClick(e)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div>
            <Typography variant="subtitle1" className={classes.text}>
              {text}
            </Typography>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={(e) => onClick(e)}
            >
              Got it
            </Button>
          </div>
        </div>
      }
    >
      <div>{children}</div>
    </MuiTooltip>
  )
}

const mapStateToProps = (
  { user: { syncData: { viewedOnboarding, viewedTooltips }}, dialog: { visible } }): {} => ({
  dialogVisible: visible,
  viewedOnboarding,
  viewedTooltips
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Tooltip)));
