import React, { useState, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FiltersBar from '../../components/FiltersBar/FiltersBar';
import ClassesFolders from './ClassesFolders';
import { CampaignState } from '../../reducers/campaign';

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

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  const classList = useMemo(
    () => (currentFilter === 'current' ? userClasses.classList : userClasses.pastClasses),
    [userClasses, currentFilter]
  );

  return (
    <div className={!isHud && classes.container}>
      {!isHud && (
        <>
          <Grid item>
            <Typography variant="h5">My Notes</Typography>
          </Grid>
          <Grid item className={classes.pastNote}>
            {currentFilter === 'current' ? (
              <Typography variant="body1">
                Take notes, review notes, and keep track of all your quick notes here!&nbsp;
                <span role="img" aria-label="Clap">
                  😉
                </span>
                Yay notes!
              </Typography>
            ) : (
              <Typography variant="body1">
                These notes are saved from your past classes, just in case you need them!&nbsp;
                <span role="img" aria-label="Clap">
                  😉
                </span>
                Yay notes!
              </Typography>
            )}
          </Grid>
        </>
      )}

      {isHud ? (
        <Grid item>
          <FiltersBar data={Filters} activeValue={currentFilter} onSelectItem={setCurrentFilter} />
        </Grid>
      ) : (
        <Grid item>
          <Box mt={4} mb={2}>
            <FiltersBar
              data={Filters}
              activeValue={currentFilter}
              onSelectItem={setCurrentFilter}
            />
          </Box>
        </Grid>
      )}

      <div className={classes.paper}>
        <ClassesFolders classList={classList} currentFilter={currentFilter} />
      </div>
    </div>
  );
};

export default UserNotesContainer;
