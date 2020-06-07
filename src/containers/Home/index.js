// @flow
import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import * as campaignActions from 'actions/campaign'
import { NEW_CLASSES_CAMPAIGN, WORKFLOW_CAMPAIGN } from 'constants/campaigns'
import Feed from 'pages/Feed'
import Classes from 'pages/Classes'
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
  const [newClassesGrid, setNewClassesGrid] = useState(null)

  useEffect(() => {
    requestCampaign({ campaignId: NEW_CLASSES_CAMPAIGN })
    requestCampaign({ campaignId: WORKFLOW_CAMPAIGN })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setNewClassesGrid(campaign.newClassExperience)
  }, [campaign])

  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
    // eslint-disable-next-line
  }, [userId])

  if(newClassesGrid === null) return (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
  )

  return newClassesGrid ? <Classes /> : <Feed />
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
