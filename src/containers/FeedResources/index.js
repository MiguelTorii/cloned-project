// @flow

import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import Linkify from 'react-linkify'
import OnboardingList from 'components/OnboardingList';
import { ReferralCTA } from '../Referrals'
import { sync } from '../../actions/user';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';

const styles = theme => ({
  container: {
    marginTop: theme.spacing(),
    position: 'fixed',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(),
    marginBottom: theme.spacing(2)
  },
  img: {
    width: '60%'
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFF',
    minHeight: theme.spacing(5),
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: theme.spacing(2, 0, 2, 0),
  },
  text: {
    padding: theme.spacing(0, 2, 5, 2),
    wordBreak: 'break-word',
    '& a': {
      textDecoration: 'none',
      color: theme.circleIn.palette.brand
    },
    fontSize: 14,
  }
});

type Props = {
  classes: Object,
  width: string,
  gridRef: Object,
  user: UserState,
  userSync: Function,
  onboardingListVisible: boolean
};

const FeedResources = ({ gridRef, width, classes, user, userSync, onboardingListVisible }: Props) => {
  const {
    data: {
      userId
    },
    syncData: {
      display,
      smallLogo,
      resourcesBody,
      resourcesTitle
    }
  } = user;
  const [scrollYPos, setScrollYPos] = useState(0);

  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
    // eslint-disable-next-line
  }, [userId]);

  const handleScroll = () => {
    const { scrollY } = window;
    setScrollYPos(scrollY);
  }

  useEffect(() => {
    if (onboardingListVisible) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return window.removeEventListener('scroll', handleScroll);
  }, [onboardingListVisible]);


  const [widthParent, setWidthParent] = useState(gridRef?.current?.offsetWidth)
  useEffect(() => {
    const  handleResize = () => {
      setWidthParent(gridRef?.current?.offsetWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [gridRef])

  if (['xs', 'sm'].includes(width)) return null;

  let top;

  const OFFSET = 400;

  if (scrollYPos < 70 || !onboardingListVisible) {
    top = 'auto';
  } else if (scrollYPos < OFFSET) {
    top = -scrollYPos;
  } else if (scrollYPos >= OFFSET) {
    top = -OFFSET;
  }

  return (
    <div className={classes.container} style={{ top, width: widthParent }}>
      <div className={classes.content}></div>
      <OnboardingList isNarrowBox />
      {
        display &&
        <Paper className={classes.paper}>
          <Grid item>
            <div className={classes.imgContainer}>
              {smallLogo && <img alt='logo' className={classes.img} src={smallLogo} />}
            </div>
          </Grid>
          <Typography className={classes.title}>
            {resourcesTitle}
          </Typography>
          <Typography className={classes.text} style={{ width: widthParent }}>
            <Linkify properties={{ target: '_blank' }}>
              {resourcesBody}
            </Linkify>
          </Typography>
        </Paper>
      }
      <Paper className={classes.paper}>
        <ReferralCTA />
      </Paper>
    </div>
  );
}

const mapStateToProps = ({ user, onboarding }: StoreState): {} => ({
  user,
  onboardingListVisible: onboarding.onboardingList.visible
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      userSync: sync,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withWidth()(FeedResources)));
