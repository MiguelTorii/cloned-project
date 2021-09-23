import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography
} from '@material-ui/core';
import IconHelp from '@material-ui/icons/HelpOutline';

import useStyles from './styles';
import StudyGoalProgress from '../../components/StudyGoalProgress/StudyGoalProgress';
import HelpModal from './HelpModal';
import ReportModal from './ReportModal';
import { fetchWeeklyStudyGoals } from '../../api/home';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import ModalData from './modal-data';

const WeeklyGoals = () => {
  const classes = useStyles();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [modalStatus, setModalStatus] = useState({
    id: 0,
    current: 0,
    goal: 0
  });
  const [loading, setLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWeeklyStudyGoals().then((rsp) => {
      setGoals(rsp.goals);
      setModalStatus(rsp.modal_status);
      setLoading(false);
    });
  }, []);

  const handleOpenHelpModal = useCallback(() => setIsHelpModalOpen(true), []);
  const handleCloseHelpModal = useCallback(() => setIsHelpModalOpen(false), []);

  const handleReportOpenModal = useCallback(
    () => setIsReportModalOpen(true),
    []
  );

  const handleCloseReportModal = useCallback(
    () => setIsReportModalOpen(false),
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
            {modalStatus.id > 0 && (
              <Link
                component="button"
                underline="none"
                onClick={handleReportOpenModal}
                className={classes.reportButton}
              >
                {modalStatus.id > 3 ? 'View End of Week Report' : 'View Mid-Week Report'}
              </Link>
            )}
          </Box>
          <HelpModal open={isHelpModalOpen} onClose={handleCloseHelpModal} />
          {modalStatus.id > 0 && (
            <ReportModal
              data={ModalData[modalStatus.id]}
              open={isReportModalOpen}
              onClose={handleCloseReportModal}
              value={modalStatus.current}
              total={modalStatus.goal}
            />
          )}
        </>
      )}
    </Paper>
  );
};

export default WeeklyGoals;
