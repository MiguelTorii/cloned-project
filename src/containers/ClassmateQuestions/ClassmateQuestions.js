import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import useStyles from './styles';
import ClassQuestions from '../../components/ClassQuestions/ClassQuestions';


const ClassmateQuestions = () => {
  const classes = useStyles();
  const myClasses = useSelector((state) => state.user.userClasses.classList);
  const [selectedClass, setSelectedClass] = useState('all');

  const activeClasses = useMemo(() => {
    return myClasses.filter((item) => item.isCurrent);
  }, [myClasses]);

  const handleChangeClass = useCallback((event, newClass) => {
    setSelectedClass(newClass);
  }, []);

  if (_.isEmpty(activeClasses)) return null;

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
        <Tab
          key="all"
          label="All Courses"
          value="all"
        />
        {activeClasses.map((item) => (
          <Tab
            key={item.classId}
            label={item.className}
            value={item.classId}
          />
        ))}
      </Tabs>
      <Box mb={3}/>
      {selectedClass && (
        <ClassQuestions classId={selectedClass === 'all' ? null : selectedClass} />
      )}
      {/*{myClasses.map((classData) => (*/}
      {/*  <Box hidden={classData.classId !== selectedClass} key={classData.classId}>*/}
      {/*    <ClassQuestions classId={classData.classId} />*/}
      {/*  </Box>*/}
      {/*))}*/}
    </>
  );
};

export default ClassmateQuestions;
