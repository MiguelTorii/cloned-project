import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@material-ui/core';
import IconHelp from '@material-ui/icons/HelpOutline';
import moment from 'moment';

import StudyGoals from 'constants/study-goals';
import useStyles from './styles';
import StudyGoalProgress from '../../components/StudyGoalProgress';
import HelpModal from './HelpModal';
import MidWeekReportModal from './MidWeekReportModal';
import EndWeekReportModal from './EndWeekReportModal';
import { fetchWeeklyStudyGoals } from '../../api/home';
import LoadingSpin from '../../components/LoadingSpin';

const WeeklyGoals = () => {
  const classes = useStyles();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMidWeekReportModalOpen, setIsMidWeekReportModalOpen] =
    useState(false);
  const [isEndWeekReportModalOpen, setIsEndWeekReportModalOpen] =
    useState(false);
  const [goals, setGoals] = useState([]);
  const [modalStatus, setModalStatus] = useState({
    current: 0,
    goal: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWeeklyStudyGoals().then((rsp) => {
      setGoals(rsp.goals);
      setModalStatus(rsp.modal_status);
      setLoading(false);
    });
  }, []);

  const showMidWeekReport = useMemo(() => moment().day() === 3, []);

  const showEndWeekReport = useMemo(
    () => moment().day() >= 5 || moment().day() === 0,
    []
  );

  const handleOpenHelpModal = useCallback(() => setIsHelpModalOpen(true), []);
  const handleCloseHelpModal = useCallback(() => setIsHelpModalOpen(false), []);

  const handleOpenViewMidWeekReportModal = useCallback(
    () => setIsMidWeekReportModalOpen(true),
    []
  );
  const handleCloseViewMidWeekReportModal = useCallback(
    () => setIsMidWeekReportModalOpen(false),
    []
  );

  const handleOpenViewEndWeekReportModal = useCallback(
    () => setIsEndWeekReportModalOpen(true),
    []
  );
  const handleCloseViewEndWeekReportModal = useCallback(
    () => setIsEndWeekReportModalOpen(false),
    []
  );

  return (
    <Paper elevation={0} square={false} className={classes.root}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" className={classes.title}>
          Your Weekly Study Goals
        </Typography>
        <IconButton onClick={handleOpenHelpModal}>
          <IconHelp />
        </IconButton>
      </Box>
      {loading ? (
        <LoadingSpin />
      ) : (
        <>
          <Grid container spacing={3}>
            {goals.map((item) => (
              <Grid item key={item.id} className={classes.goalItem}>
                <StudyGoalProgress
                  title={item.display_name}
                  content={
                    <img
                      className={classes.studyGoalImage}
                      src={item.icon_url}
                      alt={item.display_name}
                      title={item.display_name}
                    />
                  }
                  value={item.current}
                  total={item.goal}
                />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" mt={3} mb={1}>
            {showMidWeekReport && (
              <Link
                component="button"
                underline="none"
                onClick={handleOpenViewMidWeekReportModal}
                className={classes.reportButton}
              >
                View Mid-Week Report
              </Link>
            )}
            {showEndWeekReport && (
              <Link
                component="button"
                underline="none"
                onClick={handleOpenViewEndWeekReportModal}
                className={classes.reportButton}
              >
                View End of Week Report
              </Link>
            )}
          </Box>
          <HelpModal open={isHelpModalOpen} onClose={handleCloseHelpModal} />
          <MidWeekReportModal
            open={isMidWeekReportModalOpen}
            onClose={handleCloseViewMidWeekReportModal}
            value={modalStatus.current}
            total={modalStatus.goal}
          />
          <EndWeekReportModal
            open={isEndWeekReportModalOpen}
            onClose={handleCloseViewEndWeekReportModal}
            value={modalStatus.current}
            total={modalStatus.goal}
          />
        </>
      )}
    </Paper>
  );
};

export default WeeklyGoals;
