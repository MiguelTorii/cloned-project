// @flow
import React from 'react';
// import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import Avatar from '@material-ui/core/Avatar';
// import ButtonBase from '@material-ui/core/ButtonBase';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import bronze from '../../assets/svg/rank_bronze.svg';
// import silver from '../../assets/svg/rank_silver.svg';
// import gold from '../../assets/svg/rank_gold.svg';
// import platinum from '../../assets/svg/rank_platinum.svg';
// import diamond from '../../assets/svg/rank_diamond.svg';
// import master from '../../assets/svg/rank_master.svg';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing()
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  tabs: {
    // maxWidth: 600,
    marginBottom: theme.spacing(2)
  },
  helpButton: {
    margin: theme.spacing(2),
    width: 20,
    height: 20,
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    right: 0
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
    height: '100%'
  },
  rankContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
    height: '100%',
    minHeight: 146,
    [theme.breakpoints.down('xs')]: {
      minHeight: 300
    }
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeGridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  badge: {
    height: 40,
    width: 40
  },
  badgeSelected: {
    height: 100,
    width: 100
  },
  progress: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginBottom: theme.spacing(2)
  },
  tab: {
    fontSize: 20
  }
});

type Props = {
  classes: Object,
  seasons: Array<Object>
};

type State = {
  value: number,
  open: boolean
};

class Seasons extends React.PureComponent<Props, State> {
  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  // handleOpen = () => {
  // this.setState({ open: true });
  // };

  // handleClose = () => {
  // this.setState({ open: false });
  // };

  render() {
    const { classes, seasons } = this.props;
    // const { 
    // value, 
    // open
    // } = this.state;

    const seasonAll = seasons.filter(s => s.name === 'All')
    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.tabs}>
            {/* <Tabs */}
            {/* value={value} */}
            {/* onChange={this.handleChange} */}
            {/* indicatorColor="primary" */}
            {/* textColor="primary" */}
            {/* variant="scrollable" */}
            {/* scrollButtons="auto" */}
            {/* > */}
            {/* {seasons.map(item => ( */}
            {/* <Tab */}
            {/* key={item.seasonId} */}
            {/* label={item.name} */}
            {/* classes={{ textColorPrimary: classes.tab }} */}
            {/* /> */}
            {/* ))} */}
            {/* </Tabs> */}
          </div>
          {/* <ButtonBase className={classes.helpButton} onClick={this.handleOpen}> */}
          {/* <Avatar className={classes.helpIcon}>?</Avatar> */}
          {/* </ButtonBase> */}
          <Grid
            container
            justify="space-evenly"
            spacing={2}
            className={classes.gridContainer}
            item
            xs={12}
            sm={6}
          >
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].points.toLocaleString()}
              </Typography>
              <Typography variant="h6">Points</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].thanks.toLocaleString()}
              </Typography>
              <Typography variant="h6">Thanks Received</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].bestAnswers.toLocaleString()}
              </Typography>
              <Typography variant="h6">Best Answers</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].reach.toLocaleString()}
              </Typography>
              <Typography variant="h6">Reach</Typography>
            </Grid>
            {/* <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].communityServiceHours.toLocaleString()}
              </Typography>
              <Typography variant="h6">Community Service Hours</Typography>
            </Grid> */}
          </Grid>
          {/* <Grid
            container
            justify="space-evenly"
            alignItems="stretch"
            spacing={2}
            className={classes.rankContainer}
            item
            xs={12}
            sm={8}
          >
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Bronze"
                  src={bronze}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 0 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Bronze</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Silver"
                  src={silver}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 1 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Silver</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Gold"
                  src={gold}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 2 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Gold</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Platinum"
                  src={platinum}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 3 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Platinum</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Diamond"
                  src={diamond}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 4 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Diamond</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Master"
                  src={master}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 5 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Master</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={8}>
            <LinearProgress
              variant="determinate"
              value={30}
              className={classes.progress}
            />
          </Grid> */}
        </Paper>
        {/* <Dialog */}
        {/* open={open} */}
        {/* onClose={this.handleClose} */}
        {/* fullWidth */}
        {/* maxWidth="md" */}
        {/* aria-labelledby="seasons-info-title" */}
        {/* aria-describedby="seasons-info-description" */}
        {/* > */}
        {/* <DialogContent> */}
        {/* <DialogContentText */}
        {/* id="seasons-info-description" */}
        {/* variant="h3" */}
        {/* paragraph */}
        {/* color="textPrimary" */}
        {/* > */}
        {/* Seasons */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* At the end of every Season, we reward the top students with a */}
        {/* Grand Prize. After the Season ends, we reset your points and */}
        {/* statistics, however you can still view them under the All section. */}
        {/* You can, also, view your season breakdown by month for a closer */}
        {/* view at your performance! */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" variant="h5" paragraph> */}
        {/* Thanks */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* When your classmates find your content useful (or you find another */}
        {/* student’s content useful), they have the opportunity to let you */}
        {/* know by pressing the Thanks! button on your post. */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" variant="h5" paragraph> */}
        {/* Points */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* There are several ways that you can help other students to earn */}
        {/* points: sharing class notes and helpful links (think Khan */}
        {/* Academy), asking and answering questions, starting or joining */}
        {/* video study sessions, creating study flashcards. Points earned */}
        {/* contribute to your weekly performance and season stats. Your */}
        {/* points are automatically redeemed the first Tuesday of every month */}
        {/* to your top ranked rewards. */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" variant="h5" paragraph> */}
        {/* Best Answer */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* When you answer a question, the student who asked the question has */}
        {/* the chance to choose the answer that helped them the most as Best */}
        {/* Answer. Your answer will then be tagged with the ‘Best Answer’ */}
        {/* symbol so that other students can see that your reponse helped the */}
        {/* question-asker the most. */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" variant="h5" paragraph> */}
        {/* Reach */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* All of the views across all of your posts added up is your total */}
        {/* reach. */}
        {/* </DialogContentText> */}
        {/* {/* <DialogContentText color="textPrimary" variant="h5" paragraph> */}
        {/* Community Service Hours */}
        {/* </DialogContentText> */}
        {/* <DialogContentText color="textPrimary" paragraph> */}
        {/* This stat is our way of recognizing students who contribute to the */}
        {/* community. Community Service Hours can be redeemed for college and */}
        {/* job applications. To redeem your community service hours, email us */}
        {/* at Hello@CircleInApp.com */}
        {/* </DialogContentText> */}
        {/* </DialogContent> */}
        {/* <DialogActions> */}
        {/* <Button onClick={this.handleClose} color="primary">Ok</Button> */}
        {/* </DialogActions> */}
        {/* </Dialog> */}
      </div>
    );
  }
}

export default withStyles(styles)(Seasons);
