// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from 'store';
import { withStyles } from '@material-ui/core/styles';
import MuiTooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user'

const styles = theme => ({
  tooltip: {
    background: '#7572f7',
    borderRadius: 8,
    height: 180,
    padding: '8px 12px',
    pointerEvents: 'initial',
    width: 255,
  },
  text: {
    lineHeight: 1.4,
  },
  arrow: {
    color: '#7572f7',
  },
  popper: {
    marginTop: 60
  },
  button: {
    borderColor: theme.circleIn.palette.primaryText1,
    bottom: 12,
    color: theme.circleIn.palette.primaryText1,
    marginTop: 10,
    position: 'absolute',
  },
});

type Props = {
  children: Object | Array<Object>,
  classes: Object,
  confirmTooltip: Function,
  id: number,
  hidden: ?boolean,
  location: { pathname: string },
  margin: boolean,
  placement: string,
  text: string,
  viewedTooltips: Array<number>
};

const onboardingViewed = store.get('ONBOARDING') === 'VIEWED';

const Tooltip = ({
  children,
  classes,
  confirmTooltip,
  id,
  hidden = false,
  location: { pathname },
  placement,
  margin,
  text,
  viewedTooltips
}: Props) => {

  const CHAT = 3292;
  const LEADERBOARD = 6938;
  const BOOKMARKS = 9043;
  const THANKS = 2197;
  const FLASHCARDS = 1194;

  const onClick = (e) => {
    e.stopPropagation();
    confirmTooltip(id);
  }

  const isOpen = () => {
    if (hidden) return false;

    if (
      !onboardingViewed // Onboarding not completed
      || viewedTooltips === null // Data still loading
      || viewedTooltips.includes(id) // Tooltip already dismissed by user
    ) {
      return false;
    }

    if (id === CHAT) {
      return true;
    }

    if (id === FLASHCARDS) {
      return (viewedTooltips.includes(CHAT));
    }

    if (id === LEADERBOARD) {
      return (
        viewedTooltips.includes(CHAT) &&
        pathname.indexOf('/feed') === 0
      )
    }

    if (id === BOOKMARKS) {
      return (
        viewedTooltips.includes(CHAT) &&
        viewedTooltips.includes(FLASHCARDS)
      );
    }

    if (id === THANKS) {
      return (
        viewedTooltips.includes(CHAT) &&
        viewedTooltips.includes(FLASHCARDS) &&
        viewedTooltips.includes(BOOKMARKS)
      );
    }

    return true;
  }

  return (
    <MuiTooltip
      arrow
      classes={{
        arrow: classes.arrow,
        tooltip: classes.tooltip,
        popper: margin ? classes.popper : null,
      }}
      open={isOpen(id)}
      placement={placement}
      title={
        <div className={classes.tooltipContent}>
          <div style={{ textAlign: 'right' }}>
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

const mapStateToProps = ({ user: { syncData: { viewedTooltips }}, router }: StoreState): {} => ({
  viewedTooltips,
  router
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
