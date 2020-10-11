import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import ReactQuill from 'react-quill'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import MathQuill from 'components/CustomQuill/Math'
import { useDebounce } from '@react-hook/debounce'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Tooltip from 'containers/Tooltip';
import EditorToolbar, { modules, formats } from "./Toolbar"

window.katex = {}
window.katex.render = (value, node, { color, dpi }) => {
  // eslint-disable-next-line
  node.innerHTML = `<img src='https://private.codecogs.com/png.download?\\dpi{${dpi || 100}}\\color{${color || 'Black'}}${value}' />`
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  toolbar: {
    justifyContent: 'flex-end'
  },
  saveButton: {
    marginRight: theme.spacing(2),
  },
  editor: {
    padding: theme.spacing(0, 1, 2, 1),
    '& .ql-toolbar.ql-snow': {
      border: 'none'
    },
    '& .ql-editor': {
      height: 'calc(100vh - 210px)',
      maxHeight: 'calc(100vh - 210px)',
      [theme.breakpoints.down('xs')]: {
        height: 'calc(100vh - 240px)',
        maxHeight: 'calc(100vh - 240px)',
      },
      background: theme.palette.common.white,
      color: theme.palette.common.black
    }
  },
  innerContainerEditor: {
    display: 'flex',
    flexDirection: 'column',
    '& .quill': {
      flex: 1
    }
  },
  lastSaved: {
    color: theme.circleIn.palette.primaryText2
  },
  visible: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.primaryText1
  },
  savedContainer: {
    display: 'flex',
    fontSize: 12,
    marginRight: theme.spacing(2),
    textAlign: 'end',
    flexDirection: 'column',
  },
  exit: {
    fontWeight: 'bold'
  },
  header: {
    display: 'flex'
  },
  delete: {
    color: theme.circleIn.palette.danger
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const UserNotesEditor = ({
  notes,
  currentNote,
  createNote,
  updateNote,
  loading,
  openConfirmDelete,
  isFolder,
  handleClose
}) => {
  const classes = useStyles();
  const [note, setNote] = useState(currentNote)
  const [lastSave, setLastSave] = useState(null)
  const [debouncedNote, setDebouncedNote] = useDebounce(null, 2000)
  const [prevSaved, setPrevSaved] = useState(null)

  useEffect(() => setDebouncedNote(note), [note, setDebouncedNote])

  useEffect(() => {
    if (debouncedNote && !isEqual(debouncedNote, prevSaved)) {
      updateNote({ note: debouncedNote })
      setPrevSaved(prevSaved)
      setLastSave(timeFromNow({ lastModified: new Date() }))
    }
  }, [debouncedNote, prevSaved, updateNote])

  const onExit = useCallback(() => {
    if (!isEqual(note, prevSaved)) {
      updateNote({ note })
      setPrevSaved(prevSaved)
    }
    handleClose()
  }, [handleClose, note, prevSaved, updateNote])

  useEffect(() => {
    if (currentNote !== null) {
      setNote(currentNote)
      setLastSave(timeFromNow(currentNote))
      setPrevSaved(currentNote)
    } else {
      setNote(null)
    }
  }, [currentNote])

  const onRef = useCallback(ref => {
    if (ref?.editor) {
      ref.focus()
      const enableMathQuillFormulaAuthoring = MathQuill();
      enableMathQuillFormulaAuthoring(ref.editor, {
        displayHistory: true,
        operators: [
          ["\\sqrt[n]{x}", "\\nthroot"],
          ["\\frac{x}{y}", "\\frac"],
          ["{a}^{b}", "^"],
          // eslint-disable-next-line
          ["\\int", "\int"],
          ["n \\choose k", "\\choose"]
        ]
      });
    }
  }, [])

  const updateTitle = useCallback(v => {
    const title = v.target.value
    setNote(n => ({
      ...n,
      title
    }))
  }, [])

  const updateBody = useCallback(v => {
    setNote(n => ({
      ...n,
      content: v
    }))
  }, [])

  const hasNote = useMemo(() => currentNote !== null, [currentNote])
  const hasNotes = useMemo(() => notes.length !== 0, [notes])
  const [menuAnchor, setMenuAchor] = useState(null)
  const handleClickMenu = useCallback((event) => {
    setMenuAchor(event.currentTarget);
  }, [])

  const handleCloseMenu = useCallback(() => {
    setMenuAchor(null);
  }, [])

  const handleDelete = useCallback(() => {
    openConfirmDelete(currentNote)
    setMenuAchor(null);
  }, [currentNote, openConfirmDelete])

  return (
    <div>
      {isFolder && !loading && (
        <Tooltip
          id={5909}
          delay={600}
          placement="right"
          text="Your notes will appear on this screen. Tap here to create your first notes."
        >
          <Button
            variant={hasNotes ? "text" : 'contained'}
            color="primary"
            onClick={createNote}
          >
            {hasNotes ? '+ Create New Notes' : 'Get Started'}
          </Button>
        </Tooltip>
      )}
      <Dialog
        fullScreen
        open={hasNote}
        onClose={onExit}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.savedContainer}>
              <div className={classes.visible}>Visible to you only</div>
              <div className={classes.lastSaved}>Last Saved {lastSave}</div>
            </div>
            <Button variant='contained' color='primary' onClick={onExit} className={classes.exit}>
              Exit NoteTaker
            </Button>
          </Toolbar>
        </AppBar>
        {hasNote && (
          <Grid container justify='center' className={classes.editor}>
            <Grid item xs={12} md={6} className={classes.innerContainerEditor}>
              <EditorToolbar />
              <div className={classes.header}>
                <TextField
                  fullWidth
                  placeholder='Untitled'
                  value={note?.title}
                  onChange={updateTitle}
                />
                <IconButton
                  aria-label="more"
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={handleClickMenu}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  keepMounted
                  open={Boolean(menuAnchor)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={handleDelete} className={classes.delete}>
                    Delete
                  </MenuItem>
                </Menu>
              </div>
              <Tooltip
                id={1204}
                delay={600}
                placement="right"
                text="Start typing and we'll save the document for you as you go! Exit when finished."
              >
                <ReactQuill
                  ref={onRef}
                  theme="snow"
                  value={note?.content}
                  onChange={updateBody}
                  modules={modules}
                  formats={formats}
                />
              </Tooltip>
            </Grid>
          </Grid>
        )}
      </Dialog>
    </div >
  );
}

export default UserNotesEditor
