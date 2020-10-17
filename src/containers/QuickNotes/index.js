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
import moment from 'moment'
import * as notificationsActions from 'actions/notifications';
import Tooltip from 'containers/Tooltip';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.spacing(),
    padding: theme.spacing(3),
    '& div': {
      maxHeight: 'inherit'
    },
    '& #quill-editor': {
      maxWidth: 380,
      width: 380,
      maxHeight: 200,
      padding: 0
    },
    '& .MuiPaper-elevation8': {
      overflow: 'inherit',
    },
    '& .quill': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .ql-container.ql-snow': {
      borderRadius: theme.spacing(),
      border: `1px solid ${theme.circleIn.palette.rowSelection}`,
      maxHeight: 'inherit'
    },
    '& .ql-editor': {
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
    fontWeight: 'bold'
  },
  stackbar: {
    color: theme.circleIn.palette.primaryText1
  }
}))

const timeFromNow = note => {
  try {
    const { lastModified } = note
    if (typeof lastModified === 'string') {
      const utc = `${lastModified.replace(' ', 'T')}Z`
      return moment(utc).calendar()
    }
    return moment(lastModified).calendar()
  } catch (e) {
    return ''
  }
}

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
  const [lastSaved, setLastSaved] = useState('')
  const [savedState, setSavedState] = useState('hidden')
  const [debouncedContent, setDebouncedContent] = useDebounce('', 2000)

  useEffect(() => setDebouncedContent(quicknoteContent), [quicknoteContent, setDebouncedContent])

  const saveContent = useCallback(async content => {
    const now = new Date()
    if (!content || content === '<p><br></p>') return
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
    setLastSaved(timeFromNow({ lastModified: now }))
  }, [debouncedContent, quicknoteId, saveNoteAction, selectedClass, updateNote])

  useEffect(() => {
    if (
      debouncedContent && debouncedContent !== prevContent && selectedClass
    ) {
      saveContent(debouncedContent)
    }
  }, [debouncedContent, prevContent, saveContent, selectedClass])

  const handleUpdate = useCallback(text => {
    setTimeout(() => setSavedState('saving'), 100)
    updateQuickNoteContent({ content: text })
  }, [updateQuickNoteContent])

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
        <div className={classes.lastSaved}>Last Saved {lastSaved}</div>
      </Tooltip>
    )

  }, [classes.lastSaved, lastSaved, savedState, viewedOnboarding])

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
      if (classList.length > 0) {
        setSelectedClass(classList[0])
      }
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
    resetQuickNote()
    setSelectedClass(cl)
  }, [debouncedContent, quicknoteContent, resetQuickNote, saveContent])

  const saveAndClose = useCallback(async () => {
    handleClose()
    if (debouncedContent !== quicknoteContent) {
      await saveContent(quicknoteContent)
    }
    resetQuickNote()
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
          <Select
            className={classes.select}
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
          <EditorToolbar hidden />
          <ReactQuill
            theme="snow"
            value={quicknoteContent}
            onChange={handleUpdate}
            modules={modules}
            formats={formats}
          />
          <div className={classes.savedContainer}>
            <Button
              variant='contained'
              color="primary"
              className={classes.button}
              onClick={saveAndClose}
            >
              Save and close
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
