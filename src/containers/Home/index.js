// @flow
import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import * as campaignActions from 'actions/campaign'
import { LANDING_PAGE_CAMPAIGN } from 'constants/campaigns'
import Workflow from 'pages/Workflow'
import Classes from 'pages/Classes'
import Feed from 'pages/Feed'
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
  requestCampaign,
  userId,
  userSync
}) => {
  useEffect(() => {
    requestCampaign({ campaignId: LANDING_PAGE_CAMPAIGN })
  }, [requestCampaign])

  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
    // eslint-disable-next-line
  }, [userId])

  if(campaign.newClassExperience === null) return (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
  )

  if (!campaign.newClassExperience) return <Feed />
  return campaign.landingPageCampaign ? <Workflow /> : <Classes />
}

const mapStateToProps = ({ campaign, user }: StoreState): {} => ({
  campaign,
  userId: user.data.userId
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      requestCampaign: campaignActions.requestCampaign,
      userSync: sync
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
