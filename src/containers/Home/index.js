// @flow
import React from 'react'
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Workflow from 'pages/Workflow'
import Classes from 'pages/Classes'
import Feed from 'pages/Feed'
import AuthRedirect from 'pages/AuthRedirect';
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
  user
}) => {
  const { data: { userId }, isLoading } = user

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


export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Home));
