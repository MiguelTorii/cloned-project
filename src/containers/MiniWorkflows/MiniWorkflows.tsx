import { useCallback, useEffect, useState } from 'react';

import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

import { Typography, Grid, Box } from '@material-ui/core';

import { getTodos } from 'api/workflow';
import ImgEmptyTask from 'assets/svg/empty-tasks.svg';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';
import RightPanelCard from 'components/RightPanelCard/RightPanelCard';

import useStyles from './styles';
import Task from './Task';

const WORKFLOW_HEADING = 'Upcoming Tasks';

const MiniWorkflows = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <TransparentButton compact onClick={handleGotoWorkflow}>
            Go to Workflow
          </TransparentButton>
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
            <TransparentButton compact onClick={handleGotoWorkflow}>
              Go to Workflow
            </TransparentButton>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return <RightPanelCard title={WORKFLOW_HEADING}>{renderBody()}</RightPanelCard>;
};

export default MiniWorkflows;
