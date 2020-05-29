// @flow

import React, { useEffect } from 'react';
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
    margin: theme.spacing(1, 5, 0, 1),
    position: 'fixed'
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
    fontSize: 16,
    fontWeight: 'bold',
    padding: theme.spacing(2, 0, 2, 0),
  },
  text: {
    padding: theme.spacing(0, 2, 5, 2),
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
  user: UserState,
  userSync: Function
};


const FeedResources = ({ width, classes, user, userSync }: Props) => {
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
  } = user

  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
    // eslint-disable-next-line
  }, [userId])

  if (['xs', 'sm'].includes(width)) return null;

  return (
    <div className={classes.container}>
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
          <Typography className={classes.text}>
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

const mapStateToProps = ({ user }: StoreState): {} => ({
  user,
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
