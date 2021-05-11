// @flow
import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import EditorToolbar, { modules, formats } from "components/UserNotesEditor/Toolbar"
import ReactQuill from 'react-quill'
import Typography from '@material-ui/core/Typography'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { bindActionCreators } from 'redux';
import * as notesActions from 'actions/notes'
import { useDebounce } from '@react-hook/debounce'
import { connect } from 'react-redux';
import * as notificationsActions from 'actions/notifications';
import Tooltip from 'containers/Tooltip';
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    '& .MuiInputLabel-shrink': {
      display: 'none'
    },
    '& .ql-editor.ql-blank::before': {
      fontWeight: 400,
      left: 0,
      right: 0,
      color: theme.circleIn.palette.textSubtitleBody,
      opacity: 1,
      fontSize: 16
    },
    '& > div': {
      minWidth: 200,
      maxHeight: 'inherit'
    },
    '& #quill-editor': {
      maxWidth: 380,
      width: 380,
      maxHeight: 200,
      padding: 0
    },
    '& .MuiPaper-elevation8': {
      borderRadius: theme.spacing(2),
      overflow: 'inherit',
    },
    '& .quill': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .ql-container.ql-snow': {
      border: 'none',
      maxHeight: 'inherit'
    },
    '& .ql-editor': {
      padding: 0,
      maxHeight: 200,
      width: 380,
      height: 200
    }
  },
  lastSaved: {
    marginLeft: theme.spacing(2),
    color: theme.circleIn.palette.primaryText2
  },
  savedContainer: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
    display: 'flex'
  },
  select: {
    marginBottom: theme.spacing(2)
  },
  menuItem: {
    display: 'flex'
  },
  menuTypeInput: {
    display: 'flex'
  },
  menuTypo: {
    marginLeft: theme.spacing(),
    fontWeight: 'bold'
  },
  button: {
    background: 'linear-gradient(102.03deg, #94DAF9 0%, #1E88E5 100%)',
    borderRadius: theme.spacing(),
    color: theme.circleIn.palette.textOffwhite,
    fontWeight: 'bold'
  },
  stackbar: {
    color: theme.circleIn.palette.primaryText1
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700
  },
  classLabel: {
    fontWeight: 800,
    fontSize: 18,
    color: theme.circleIn.palette.textOffwhite,
  }
}))

const QuickNotes = ({
  enqueueSnackbar,
  userClasses,
  updateQuickNoteContent,
  resetQuickNote,
  quicknoteContent,
  saveNoteAction,
  viewedOnboarding,
  quicknoteId,
  updateNote,
}) => {
  const noteRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()
  const [selectedClass, setSelectedClass] = useState(null)
  const [prevContent, setPrevContent] = useState('')
  const [savedState, setSavedState] = useState('hidden')
  const [debouncedContent, setDebouncedContent] = useDebounce('', 2000)

  useEffect(() => setDebouncedContent(quicknoteContent), [quicknoteContent, setDebouncedContent])

  const saveContent = useCallback(async content => {
    const now = new Date()
    if (
      !content ||
      content === '<p><br></p>' ||
      !selectedClass ||
      !selectedClass.sectionId ||
      !selectedClass.classId
    ) return
    setPrevContent(debouncedContent)
    if (!quicknoteId) {
      await saveNoteAction({
        note: {
          title: 'Untitled',
          sectionId: selectedClass.sectionId,
          classId: selectedClass.classId,
          lastModified: now,
          content
        },
        quicknote: true,
        sectionId: selectedClass.sectionId,
        classId: selectedClass.classId
      })
    } else {
      await updateNote({
        note: {
          content,
          title: 'Untitled',
          id: quicknoteId,
          sectionId: selectedClass.sectionId,
          classId: selectedClass.classId,
          lastModified: now
        }
      })
    }
    setSavedState('show')
    setTimeout(() => setSavedState('hidden'), 60000)
  }, [debouncedContent, quicknoteId, saveNoteAction, selectedClass, updateNote])

  useEffect(() => {
    if (
      debouncedContent && debouncedContent !== prevContent && selectedClass
    ) {
      saveContent(debouncedContent)
    }
  }, [debouncedContent, prevContent, saveContent, selectedClass])

  const handleUpdate = useCallback(text => {
    setTimeout(() => {
      if (selectedClass) setSavedState('saving')
    }, 100)
    updateQuickNoteContent({ content: text })
  }, [selectedClass, updateQuickNoteContent])

  const renderSaved = useMemo(() => {
    if (savedState === 'hidden') return null
    if (savedState === 'saving') return <div className={classes.lastSaved}>Saving...</div>
    return (
      <Tooltip
        id={3499}
        delay={600}
        hidden={!viewedOnboarding}
        placement="bottom"
        text="We save your QuickNotes with the date and time you created it."
      >
        <div className={classes.lastSaved}>
          Saved to your class folder for later.
        </div>
      </Tooltip>
    )
  }, [classes.lastSaved, savedState, viewedOnboarding])

  const classList = useMemo(() => {
    if (userClasses?.classList) {
      const classList = userClasses
        .classList
        .filter(c => c.section.length !== 0)
        .map(c => ({
          name: c.className,
          color: c.bgColor,
          sectionId: c.section[0].sectionId,
          classId: c.classId
        }))
      return classList
    }
    return []
  }, [userClasses])

  const handleClick = useCallback(() => {
    setAnchorEl(noteRef.current);
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const updateClass = useCallback(async cl => {
    if (debouncedContent !== quicknoteContent) {
      await saveContent(quicknoteContent)
    }
    setSelectedClass(cl)
  }, [debouncedContent, quicknoteContent, saveContent])

  const saveAndClose = useCallback(async () => {
    handleClose()
    if (debouncedContent !== quicknoteContent) {
      await saveContent(quicknoteContent)
    }
    resetQuickNote()
    if (quicknoteContent && selectedClass?.name) {
      setTimeout(() => setSavedState('hidden'), 100);
      await enqueueSnackbar({
        notification: {
          message: `Your note was saved at ${selectedClass.name} folder`,
          options: {
            variant: 'info',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 5000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });
    }
  }, [classes.stackbar, debouncedContent, enqueueSnackbar, handleClose, quicknoteContent, resetQuickNote, saveContent, selectedClass])

  return (
    <Grid container>
      <Tooltip
        id={2341}
        delay={600}
        hidden={!viewedOnboarding}
        placement="right"
        text="Write a QuickNote by clicking here. These QuickNotes save to Notes"
      >
        <IconButton ref={noteRef} onClick={handleClick}>
          <BookOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        className={classes.container}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper className={classes.container}>
          <Typography className={classes.title}>
            QuickNotes
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel
              className={classes.classLabel}
              id="select-label"
            >
              Which class is this for?
            </InputLabel>
            <Select
              className={classes.select}
              labelWidth={200}
              labelId='select-label'
              classes={{
                selectMenu: classes.menuTypeInput
              }}
              value={selectedClass?.sectionId || ''}
            >
              {classList.map(cl => (
                <MenuItem
                  key={cl.sectionId}
                  onClick={() => updateClass(cl)}
                  value={cl.sectionId}
                  className={classes.menuItem}
                >
                  <FolderOpenIcon style={{ color: cl?.color }} />
                  <Typography className={classes.menuTypo}>{cl.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <EditorToolbar hidden />
          <ReactQuill
            placeholder='Write all your brilliant ideas, a-ha moments, reminders and anything you need here 📝'
            theme="snow"
            value={quicknoteContent}
            onChange={handleUpdate}
            modules={modules}
            formats={formats}
          />
          <div className={classes.savedContainer}>
            <Button
              variant='contained'
              className={classes.button}
              onClick={saveAndClose}
            >
              Close
            </Button>
            {renderSaved}
          </div>
        </Paper>
      </Popover>
    </Grid>
  )
}

const mapStateToProps = ({ user, notes }: StoreState): {} => ({
  userClasses: user.userClasses,
  quicknoteId: notes.data.quicknoteId,
  quicknoteContent: notes.data.quicknoteContent,
  viewedOnboarding: user.syncData.viewedOnboarding
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      saveNoteAction: notesActions.saveNoteAction,
      updateNote: notesActions.updateNote,
      getNotes: notesActions.getNotes,
      updateQuickNoteContent: notesActions.updateQuickNoteContent,
      resetQuickNote: notesActions.resetQuickNote,
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
      setCurrentNote: notesActions.setCurrentNote,
      setSectionId: notesActions.setSectionId
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickNotes);
