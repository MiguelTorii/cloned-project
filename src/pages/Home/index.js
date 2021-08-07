import React from 'react';
import { Box, Grid } from '@material-ui/core';
import Layout from '../../containers/Layout';
import withRoot from '../../withRoot';
import HomeGreetings from '../../containers/HomeGreetings';
import WeeklyGoals from '../../containers/WeeklyGoals';
import ClassmateQuestions from '../../containers/ClassmateQuestions';
import useStyles from './styles';

const Home = () => {
  const classes = useStyles();

  return (
    <main>
      <Layout>
        <Box p={3}>
          <Grid container className={classes.root}>
            <Grid item sm={0} lg={1} />
            <Grid item xl={6} lg={8} sm={12}>
              <Grid container direction='column' spacing={5}>
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
          </Grid>
        </Box>
      </Layout>
    </main>
  );
};

export default withRoot(Home);
