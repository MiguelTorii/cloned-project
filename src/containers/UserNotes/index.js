// @flow
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { bindActionCreators } from 'redux';
import * as notesActions from 'actions/notes';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import UserNotesEditor from 'components/UserNotesEditor';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import Tooltip from 'containers/Tooltip';
import FiltersBar from 'components/FiltersBar';
import { confirmTooltip as confirmTooltipAction } from 'actions/user';
import type { State as StoreState } from '../../types/state';
import DeleteNote from './DeleteNote';
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

const Filters = {
  current: {
    text: 'Current Classes'
  },
  past: {
    text: 'Past Classes'
  }
};

export const blankNote = {
  content: '',
  title: 'Untitled'
};

const UserNotesContainer = ({
  saveNoteAction,
  initialLoading,
  viewedTooltips,
  confirmTooltip,
  userId,
  updateNote,
  loading,
  getNotes,
  notes,
  deleteNote,
  userClasses,
  sectionId,
  classId,
  setSectionId,
  setCurrentNote,
  currentNote,
  exitNoteTaker
}) => {
  const classes = useStyles();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [classList, setClassList] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('current');

  const arrFilters = useMemo(() => {
    return Object.keys(Filters).map((key) => ({
      value: key,
      text: Filters[key].text
    }));
  }, []);

  useEffect(() => {
    if (userClasses?.classList) {
      const classes = userClasses.classList
        .filter((c) => c.section.length !== 0)
        .map((c) => ({
          name: c.className,
          color: c.bgColor,
          sectionId: c.section?.[0]?.sectionId,
          classId: c.classId,
          isCurrent: c.isCurrent
        }));
      setClassList(classes);
    }
  }, [userClasses]);

  const closeConfirmDelete = useCallback(() => setConfirmDelete(null), []);
  const openConfirmDelete = useCallback((note) => setConfirmDelete(note), []);

  const editNote = useCallback(
    (note) => setCurrentNote({ note }),
    [setCurrentNote]
  );
  const isFolder = useMemo(() => sectionId !== null, [sectionId]);

  useEffect(() => {
    const init = async () => {
      getNotes();
    };

    if (isFolder) init();
  }, [getNotes, isFolder]);

  const handleClose = useCallback(
    () => setCurrentNote({ note: null }),
    [setCurrentNote]
  );

  const handleDeleteNote = useCallback(async () => {
    handleClose();
    await deleteNote({ note: confirmDelete });
    closeConfirmDelete();
  }, [closeConfirmDelete, confirmDelete, deleteNote, handleClose]);

  const getFilteredList = () => {
    if (!classList) return [];

    if (currentFilter === 'current') {
      return classList.filter((cl) => cl.isCurrent);
    } else if (currentFilter === 'past') {
      return classList.filter((cl) => !cl.isCurrent);
    } else {
      return [];
    }
  };

  const handleSelectFilter = useCallback((item) => {
    setCurrentFilter(item);
  }, []);

  return (
    <div className={classes.container}>
      <DeleteNote
        handleDeleteNote={handleDeleteNote}
        confirmDelete={confirmDelete}
        closeConfirmDelete={closeConfirmDelete}
      />
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
            These notes are saved from your past classes, just in case you need
            them!&nbsp;
            <span role="img" aria-label="Clap">
              😉
            </span>
            Yay notes!
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Box mt={4} mb={2}>
          <FiltersBar
            data={arrFilters}
            activeValue={currentFilter}
            onSelectItem={handleSelectFilter}
          />
        </Box>
      </Grid>

      <div className={classes.paper}>
        {currentNote && (
          <UserNotesEditor
            handleClose={handleClose}
            updateNote={updateNote}
            currentNote={currentNote}
            openConfirmDelete={openConfirmDelete}
            exitNoteTaker={exitNoteTaker}
          />
        )}
        <ClassesFolders
          openConfirmDelete={openConfirmDelete}
          sectionId={sectionId}
          notes={notes}
          setSectionId={setSectionId}
          editNote={editNote}
          classList={getFilteredList()}
          currentFilter={currentFilter}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user, notes }: StoreState): {} => ({
  userId: user.data.userId,
  userClasses: user.userClasses,
  viewedTooltips: user.syncData.viewedTooltips,
  notes: notes.data.notes,
  currentNote: notes.data.currentNote,
  loading: notes.data.loading,
  initialLoading: notes.data.initialLoading,
  sectionId: notes.data.sectionId,
  classId: notes.data.classId
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      saveNoteAction: notesActions.saveNoteAction,
      updateNote: notesActions.updateNote,
      getNotes: notesActions.getNotes,
      deleteNote: notesActions.deleteNoteAction,
      confirmTooltip: confirmTooltipAction,
      setCurrentNote: notesActions.setCurrentNote,
      setSectionId: notesActions.setSectionId,
      exitNoteTaker: notesActions.exitNoteTaker
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserNotesContainer);
