import React from 'react';

import { Box, Grid, Hidden } from '@material-ui/core';

import ClassmateQuestions from 'containers/ClassmateQuestions/ClassmateQuestions';
import HomeGreetings from 'containers/HomeGreetings/HomeGreetings';
import Layout from 'containers/Layout/Layout';
import MiniWorkflows from 'containers/MiniWorkflows/MiniWorkflows';
import WeeklyGoals from 'containers/WeeklyGoals/WeeklyGoals';
import withRoot from 'withRoot';

import useStyles from './styles';

const HomePage = () => {
  const classes: any = useStyles();
  return (
    <main>
      <Layout>
        <Box p={3}>
          <Grid container className={classes.root} spacing={3}>
            <Grid item xl={6} lg={8} sm={12}>
              <Grid container direction="column" spacing={5}>
                <Grid item xs={12}>
                  <HomeGreetings />
                </Grid>
                <Grid item xs={12}>
                  <WeeklyGoals />
                </Grid>
                <Grid item xs={12}>
                  <ClassmateQuestions />
                </Grid>
              </Grid>
            </Grid>
            <Hidden mdDown>
              <Grid item lg={4} xl={3}>
                <MiniWorkflows />
              </Grid>
            </Hidden>
          </Grid>
        </Box>
      </Layout>
    </main>
  );
};

export default withRoot(HomePage);
