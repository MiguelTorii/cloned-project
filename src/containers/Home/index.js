// @flow
import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Workflow from 'pages/Workflow'
import Classes from 'pages/Classes'
import Feed from 'pages/Feed'
import AuthRedirect from 'pages/AuthRedirect';
import { sync } from '../../actions/user';
import type { State as StoreState } from '../../types/state';

const styles = () => ({
  loading: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


const Home = ({
  campaign,
  classes,
  userSync,
  user
}) => {
  const { data: { userId }, isLoading } = user
  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
  }, [userId, userSync])

  if(isLoading && !userId) return (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
  )

  if(!userId) return <AuthRedirect />
  if (!campaign.newClassExperience) return <Feed />
  return campaign.landingPageCampaign ? <Workflow /> : <Classes />
}

const mapStateToProps = ({ campaign, user }: StoreState): {} => ({
  campaign,
  user,
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      userSync: sync
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
