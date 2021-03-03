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
import OnboardingNotes from 'containers/OnboardingNotes'
import Tooltip from 'containers/Tooltip';
import Button from '@material-ui/core/Button';
import { confirmTooltip as confirmTooltipAction } from 'actions/user';
import GiveFeedback from 'containers/GiveFeedback'
import type { State as StoreState } from '../../types/state';
import DeleteNote from './DeleteNote';
import NotesList from './NotesList';
import ClassesFolders from './ClassesFolders';

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
  },
  createNote: {
    margin: theme.spacing(2, 0)
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  feedback: {
    cursor: 'pointer'
  }
}))

export const blankNote = {
  content: '',
  title: 'Untitled',
}

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
  const classes = useStyles()
  const hasNotes = useMemo(() => notes.length !== 0, [notes])
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [classList, setClassList] = useState([])
  const [openFeedback, setOpenFeedback] = useState(false)

  const handleOpenFeedback = useCallback(() => {
    setOpenFeedback(true)
  }, [])

  const handleCloseFeedback = useCallback(() => {
    setOpenFeedback(false)
  }, [])

  const selectedClass = useMemo(() => classList.find(cl => cl.sectionId === sectionId), [classList, sectionId])

  const updateOnboarding = useCallback(async () => {
    await confirmTooltip(8453)
  }, [confirmTooltip])

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
    saveNoteAction({ note: blankNote, sectionId, classId })
  }, [classId, saveNoteAction, sectionId])

  const handleClose = useCallback(() => setCurrentNote({ note: null }), [setCurrentNote])

  const handleDeleteNote = useCallback(async () => {
    handleClose()
    await deleteNote({ note: confirmDelete })
    closeConfirmDelete()
  }, [closeConfirmDelete, confirmDelete, deleteNote, handleClose])

  const goBack = useCallback(() => setSectionId({ sectionId: null, classId: null }), [setSectionId])

  const emptyFolder = useMemo(() => !hasNotes && isFolder, [hasNotes, isFolder])

  const onboardingOpen = useMemo(() => (
    Boolean(viewedTooltips && !viewedTooltips.includes(8453))
  ), [viewedTooltips])

  return (
    <div className={classes.container}>
      <OnboardingNotes
        userId={userId}
        updateOnboarding={updateOnboarding}
        open={onboardingOpen}
      />
      <DeleteNote
        handleDeleteNote={handleDeleteNote}
        confirmDelete={confirmDelete}
        closeConfirmDelete={closeConfirmDelete}
      />
      <GiveFeedback
        origin='Notes'
        open={openFeedback}
        onClose={handleCloseFeedback}
      />
      <div className={classes.header}>
        <Typography variant='h6'>My Notes</Typography>
        <Typography
          variant='caption'
          color='primary'
          className={classes.feedback}
          onClick={handleOpenFeedback}
        >
          Give Feedback
        </Typography>
      </div>
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
          <FolderOpenIcon className={classes.folder} style={{ color: selectedClass?.color }} />
          <Typography className={classes.classesTypo}>{selectedClass?.name}</Typography>
        </Grid>}
        {emptyFolder && !initialLoading && <EmptyNotes />}
        {isFolder && !initialLoading && (
          <Tooltip
            id={5909}
            delay={600}
            placement="right"
            hidden={onboardingOpen}
            text="Your notes will appear on this screen. Tap here to create your first notes."
          >
            <Button
              variant={hasNotes ? "text" : 'contained'}
              className={cx(hasNotes && classes.createNote)}
              color="primary"
              onClick={createNote}
            >
              {hasNotes ? '+ Create New Notes' : 'Get Started'}
            </Button>
          </Tooltip>
        )}
        {currentNote && <UserNotesEditor
          handleClose={handleClose}
          updateNote={updateNote}
          currentNote={currentNote}
          openConfirmDelete={openConfirmDelete}
          exitNoteTaker={exitNoteTaker}
        />}
        {isFolder && <NotesList
          notes={notes}
          hasNotes={hasNotes}
          openConfirmDelete={openConfirmDelete}
          editNote={editNote}
        />}
        {sectionId === null && <ClassesFolders
          openConfirmDelete={openConfirmDelete}
          setSectionId={setSectionId}
          classList={classList}
        />}
        {(loading || initialLoading) && <div className={classes.loading}>
          <CircularProgress />
        </div>}
      </Paper>
    </div>
  )
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserNotesContainer);
