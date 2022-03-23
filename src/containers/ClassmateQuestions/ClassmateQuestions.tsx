import React, { useCallback, useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import { useSelector } from 'react-redux';

import { Box, Tab, Tabs, Typography } from '@material-ui/core';

import ClassQuestions from 'components/ClassQuestions/ClassQuestions';

import useStyles from './styles';

const ClassmateQuestions = () => {
  const classes: any = useStyles();
  const myClasses = useSelector((state) => (state as any).user.userClasses.classList);
  const [selectedClass, setSelectedClass] = useState('all');
  const handleChangeClass = useCallback((event, newClass) => {
    setSelectedClass(newClass);
  }, []);

  if (_.isEmpty(myClasses)) {
    return null;
  }

  return (
    <>
      <Typography variant="h6" paragraph className={classes.title}>
        Questions from Your Classmates
      </Typography>
      <Tabs
        value={selectedClass}
        onChange={handleChangeClass}
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        classes={{
          root: classes.tabs
        }}
      >
        <Tab key="all" label="All Courses" value="all" />
        {myClasses.map((item) => (
          <Tab key={item.classId} label={item.className} value={item.classId} />
        ))}
      </Tabs>
      <Box mb={3} />
      {selectedClass && (
        <ClassQuestions classId={(selectedClass === 'all' ? null : selectedClass) as any} />
      )}
    </>
  );
};

export default ClassmateQuestions;
