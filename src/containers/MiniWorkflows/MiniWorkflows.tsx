import React, { useCallback, useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box } from '@material-ui/core';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import ImgEmptyTask from '../../assets/svg/empty-tasks.svg';
import useStyles from './styles';
import { getTodos } from '../../api/workflow';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import Task from './Task';
import { CampaignState } from '../../reducers/campaign';

const WORKFLOW_HEADING = '🗓 Your Upcoming Tasks';
const HUD_WORKFLOW_HEADING = '🗓 Current Missions';

const MiniWorkflows = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  useEffect(() => {
    setLoading(true);
    getTodos({
      category_id: 2,
      limit: 3
    }).then((data) => {
      setTasks((data || []).slice(0, 3));
      setLoading(false);
    });
  }, []);
  const handleGotoWorkflow = useCallback(() => {
    dispatch(push('/workflow'));
  }, [dispatch]);

  const renderBody = () => {
    if (loading) {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <LoadingSpin />
          <Box mt={2}>
            <Typography align="center" paragraph>
              Loading...
            </Typography>
          </Box>
        </Box>
      );
    }

    if (tasks.length === 0) {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <img className={classes.emptyImage} src={ImgEmptyTask} alt="no upcoming tasks" />
          <Typography align="center" paragraph>
            No tasks yet
          </Typography>
          <Typography paragraph>
            When you add tasks to Workflow, they’ll show up here to help you stay on track!
          </Typography>
          <GradientButton compact onClick={handleGotoWorkflow}>
            Go to Workflow
          </GradientButton>
        </Box>
      );
    }

    return (
      <Grid container direction="column" spacing={2}>
        {tasks.map((task) => (
          <Grid item key={task.id}>
            <Task
              title={task.title}
              dueDate={task.date}
              sectionId={task.sectionId ? Number(task.sectionId) : 0}
            />
          </Grid>
        ))}
        <Grid item>
          <Box display="flex" justifyContent="center">
            <GradientButton compact onClick={handleGotoWorkflow}>
              Go to Workflow
            </GradientButton>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper className={classes.root} elevation={0} square={false}>
      <Typography className={classes.title} variant="h6" paragraph>
        {isHud ? HUD_WORKFLOW_HEADING : WORKFLOW_HEADING}
      </Typography>
      {renderBody()}
    </Paper>
  );
};

export default MiniWorkflows;
