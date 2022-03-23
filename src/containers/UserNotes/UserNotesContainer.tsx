import React, { useState, useMemo } from 'react';

import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import FiltersBar from 'components/FiltersBar/FiltersBar';

import ClassesFolders from './ClassesFolders';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(5)
  },
  paper: {
    padding: theme.spacing(2, 0, 4, 0),
    background: 'inherit'
  },
  centralize: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  backButton: {
    cursor: 'pointer'
  },
  classesTypo: {
    fontSize: 16
  },
  folder: {
    margin: theme.spacing(0, 1)
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  feedback: {
    cursor: 'pointer'
  },
  pastNote: {
    maxWidth: 408,
    marginTop: theme.spacing(2)
  }
}));
const Filters = [
  {
    value: 'current',
    text: 'Current Classes'
  },
  {
    value: 'past',
    text: 'Past Classes'
  }
];

const UserNotesContainer = () => {
  const userClasses = useSelector((state) => (state as any).user.userClasses);
  const classes: any = useStyles();
  const [currentFilter, setCurrentFilter] = useState('current');

  const classList = useMemo(
    () => (currentFilter === 'current' ? userClasses.classList : userClasses.pastClasses),
    [userClasses, currentFilter]
  );

  return (
    <div>
      <Grid item>
        <FiltersBar data={Filters} activeValue={currentFilter} onSelectItem={setCurrentFilter} />
      </Grid>

      <div className={classes.paper}>
        <ClassesFolders classList={classList} currentFilter={currentFilter} />
      </div>
    </div>
  );
};

export default UserNotesContainer;
