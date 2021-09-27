import React, { useMemo } from 'react';
import { Box, Chip, Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import IconCalendar from '@material-ui/icons/CalendarToday';

import useStyles from './styles';

const Task = ({ title, dueDate, sectionId }) => {
  const classes = useStyles();
  const classList = useSelector((state) => state.user.userClasses.classList);

  const dueDateText = useMemo(() => {
    if (!dueDate) {
      return null;
    }
    return moment(dueDate).format('MMM DD H:MM A');
  }, [dueDate]);

  const dueDateColor = useMemo(() => {
    const now = moment();
    const due = moment(dueDate);
    const diffHours = moment.duration(now.diff(due)).as('hours');

    if (now >= due) {
      return '#EB6E69';
    }
    if (diffHours < 48) {
      return '#FFE195';
    }

    return '#BFBFC1';
  }, []);

  const classData = useMemo(() => {
    if (!sectionId) {
      return null;
    }
    const matchedClass = classList.find((item) =>
      item.section.map((section) => section.section.sectionId).includes(sectionId)
    );

    if (!matchedClass) {
      return null;
    }

    return {
      className: matchedClass.courseDisplayName,
      color: matchedClass.bgColor
    };
  }, [sectionId]);

  return (
    <Paper className={classes.taskContainer} elevation={0} square={false}>
      <Typography>{title}</Typography>
      {dueDateText && (
        <Box display="flex" alignItems="center" mt={1.5}>
          <Box mr={0.5}>
            <IconCalendar
              style={{
                color: dueDateColor
              }}
            />
          </Box>
          <Typography
            variant="body2"
            className={classes.taskDate}
            style={{
              color: dueDateColor
            }}
          >
            {dueDateText}
          </Typography>
        </Box>
      )}
      {classData && (
        <Chip
          className={classes.classPill}
          label={classData.className}
          style={{
            backgroundColor: classData.color
          }}
        />
      )}
    </Paper>
  );
};

Task.propTypes = {
  title: PropTypes.string.isRequired,
  dueDate: PropTypes.string,
  sectionId: PropTypes.number
};

export default Task;
