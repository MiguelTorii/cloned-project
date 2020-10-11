// @flow
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { bindActionCreators } from 'redux';
import Paper from '@material-ui/core/Paper'
import * as notesActions from 'actions/notes'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles'
import UserNotesEditor from 'components/UserNotesEditor';
import EmptyNotes from 'components/UserNotesEditor/EmptyNotes'
import cx from 'classnames'
import Grid from '@material-ui/core/Grid';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import type { State as StoreState } from '../../types/state';
import DeleteNote from './DeleteNote';
import NotesList from './NotesList';
import ClassesFolders from './ClassesFolders';
import { sync } from '../../actions/user';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2, 4, 4, 4)
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
  loading: {
    justifyContent: 'center',
    padding: theme.spacing(),
    flex: 1,
    display: 'flex'
  },
  folder: {
    margin: theme.spacing(0, 1)
  }
}))

export const blankNote = {
  content: '',
  title: 'Untitled',
}

const UserNotesContainer = ({
  saveNoteAction,
  userId,
  updateNote,
  userSync,
  loading,
  getNotes,
  notes,
  deleteNote,
  userClasses,
  sectionId,
  setSectionId,
  setCurrentNote,
  currentNote
}) => {
  const classes = useStyles()
  const hasNotes = useMemo(() => notes.length !== 0, [notes])
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [classList, setClassList] = useState([])

  const selectedClass = useMemo(() => classList.find(cl => cl.sectionId === sectionId), [classList, sectionId])

  useEffect(() => {
    const init = async () => {
      userSync({ userId })
    }

    if (userId) init()
  }, [userId, userSync]);

  useEffect(() => {
    if (userClasses?.classList) {
      const classes = userClasses
        .classList
        .filter(c => c.section.length !== 0)
        .map(c => ({
          name: c.className,
          color: c.bgColor,
          sectionId: c.section[0].sectionId,
          classId: c.classId
        }))
      setClassList(classes)
    }
  }, [userClasses])

  const closeConfirmDelete = useCallback(() => setConfirmDelete(null), [])
  const openConfirmDelete = useCallback(note => setConfirmDelete(note), [])

  const editNote = useCallback(note => setCurrentNote({ note }), [setCurrentNote])
  const isFolder = useMemo(() => sectionId !== null, [sectionId])

  useEffect(() => {
    const init = async () => {
      getNotes()
    }

    if (isFolder) init()
  }, [getNotes, isFolder])

  const createNote = useCallback(async () => {
    saveNoteAction({ note: blankNote })
  }, [saveNoteAction])

  const handleClose = useCallback(() => setCurrentNote({ note: null }), [setCurrentNote])

  const handleDeleteNote = useCallback(async () => {
    handleClose()
    await deleteNote({ id: confirmDelete })
    closeConfirmDelete()
  }, [confirmDelete, deleteNote, closeConfirmDelete, handleClose])

  const goBack = useCallback(() => setSectionId({ sectionId: null, classId: null }), [setSectionId])


  const emptyFolder = useMemo(() => !hasNotes && isFolder, [hasNotes, isFolder])

  return (
    <div className={classes.container}>
      <DeleteNote
        handleDeleteNote={handleDeleteNote}
        confirmDelete={confirmDelete}
        closeConfirmDelete={closeConfirmDelete}
      />
      <Typography variant='h6'>My Notes</Typography>
      <Paper className={cx(
        classes.paper,
        emptyFolder && classes.centralize
      )}>
        {isFolder && <Grid
          className={classes.backButton}
          container
          justify='flex-start'
          alignItems='center'
          onClick={goBack}
        >
          <ArrowBackIosRoundedIcon />
          <FolderOpenIcon className={classes.folder} style={{ color: selectedClass.color }} />
          <Typography className={classes.classesTypo}>{selectedClass.name}</Typography>
        </Grid>}
        {emptyFolder && !loading && <EmptyNotes />}
        <UserNotesEditor
          handleClose={handleClose}
          updateNote={updateNote}
          currentNote={currentNote}
          notes={notes}
          openConfirmDelete={openConfirmDelete}
          isFolder={isFolder}
          loading={loading}
          createNote={createNote}
        />
        {isFolder && <NotesList
          notes={notes}
          hasNotes={hasNotes}
          openConfirmDelete={openConfirmDelete}
          editNote={editNote}
        />}
        {sectionId === null && <ClassesFolders
          setSectionId={setSectionId}
          classList={classList}
        />}
        {loading && <div className={classes.loading}>
          <CircularProgress />
        </div>}
      </Paper >
    </div>
  )
}

const mapStateToProps = ({ user, notes }: StoreState): {} => ({
  userId: user.data.userId,
  userClasses: user.userClasses,
  notes: notes.data.notes,
  currentNote: notes.data.currentNote,
  loading: notes.data.loading,
  sectionId: notes.data.sectionId
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      saveNoteAction: notesActions.saveNoteAction,
      updateNote: notesActions.updateNote,
      getNotes: notesActions.getNotes,
      userSync: sync,
      deleteNote: notesActions.deleteNoteAction,
      setCurrentNote: notesActions.setCurrentNote,
      setSectionId: notesActions.setSectionId
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserNotesContainer);
