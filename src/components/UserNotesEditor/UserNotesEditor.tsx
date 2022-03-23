import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';

import { useDebounce } from '@react-hook/debounce';
import { differenceInMilliseconds } from 'date-fns';
import moment from 'moment';
import { useIdleTimer } from 'react-idle-timer';
import ReactQuill from 'react-quill';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

import { INTERVAL } from 'constants/app';
import { TIMEOUT } from 'constants/common';
import setFormulasColor from 'utils/quill';

import { logEvent } from 'api/analytics';
import CircleInLogo from 'assets/svg/circlein_logo_minimal.svg';
import Tooltip from 'containers/Tooltip/Tooltip';

import { useStyles } from '../_styles/UserNotesEditor/index';
import MathQuill from '../CustomQuill/Math';

import EditorToolbar, { modules, formats } from './Toolbar';

const timeout = TIMEOUT.FLASHCARD_REVEIW;
const Transition = React.forwardRef<any, any>(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const timeFromNow = (note) => {
  try {
    const { lastModified } = note;

    if (typeof lastModified === 'string') {
      const utc = `${lastModified.replace(' ', 'T')}Z`;
      return moment(utc).fromNow();
    }

    return moment(lastModified).fromNow();
  } catch (e) {
    return '';
  }
};

type Props = {
  onboardingOpen?: any;
  currentNote?: any;
  updateNote?: any;
  openConfirmDelete?: any;
  handleClose?: any;
  exitNoteTaker?: any;
};

const UserNotesEditor = ({
  onboardingOpen,
  currentNote,
  updateNote,
  openConfirmDelete,
  handleClose,
  exitNoteTaker
}: Props) => {
  const classes: any = useStyles();
  const [note, setNote] = useState(currentNote);
  const [savedState, setSavedState] = useState('hidden');
  const [lastSave, setLastSave] = useState(null);
  const [debouncedNote, setDebouncedNote] = useDebounce(null, 2000);
  const [prevSaved, setPrevSaved] = useState(null);
  const curNoteRef = useRef(null);
  useEffect(() => setDebouncedNote(note), [note, setDebouncedNote]);
  const renderSaved = useMemo(() => {
    if (savedState === 'hidden') {
      return null;
    }

    if (savedState === 'saving') {
      return <div className={classes.lastSaved}>Saving...</div>;
    }

    return <div className={classes.lastSaved}>Last Saved {lastSave}</div>;
  }, [classes.lastSaved, lastSave, savedState]);
  useEffect(() => {
    setLastSave(timeFromNow(currentNote));
    const interval = setInterval(() => {
      if (currentNote) {
        setLastSave(timeFromNow(curNoteRef.current));
      }
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [currentNote]);
  useEffect(() => {
    if (
      debouncedNote &&
      (debouncedNote.title !== prevSaved.title || debouncedNote.content !== prevSaved.content)
    ) {
      const now = new Date();
      updateNote({
        note: { ...debouncedNote, lastModified: now }
      });
      setPrevSaved({ ...debouncedNote, lastModified: now });
      curNoteRef.current = { ...debouncedNote, lastModified: now };
      setLastSave(
        timeFromNow({
          lastModified: now
        })
      );
      setSavedState('show');
      setTimeout(() => setSavedState('hidden'), 120000);
    }
  }, [debouncedNote, prevSaved, updateNote]);
  // Data Points
  const elapsed = useRef(0);
  const totalIdleTime = useRef(0);
  const remaining = useRef(timeout);
  const lastActive = useRef(+new Date());
  const timer = useRef(null);

  const handleOnActive = () => {
    const diff = differenceInMilliseconds(new Date(), lastActive.current);
    totalIdleTime.current = Math.max(totalIdleTime.current + diff - timeout, 0);
  };

  const { getRemainingTime, getLastActiveTime, getElapsedTime, reset } = useIdleTimer({
    timeout,
    onActive: handleOnActive
  });
  useEffect(() => {
    remaining.current = getRemainingTime();
    lastActive.current = getLastActiveTime();
    elapsed.current = getElapsedTime();
    timer.current = setInterval(() => {
      remaining.current = getRemainingTime();
      lastActive.current = getLastActiveTime();
      elapsed.current = getElapsedTime();
    }, INTERVAL.SECOND);
    return () => {
      clearInterval(timer.current);
    };
  }, [getElapsedTime, getLastActiveTime, getRemainingTime]);
  const initializeTimer = useCallback(() => {
    elapsed.current = 0;
    totalIdleTime.current = 0;
    remaining.current = timeout;
    (lastActive as any).current = new Date();
  }, [elapsed, totalIdleTime, remaining, lastActive]);
  const onExit = useCallback(() => {
    logEvent({
      event: 'In-App Notes- Viewed',
      props: {
        note_id: note.id,
        classId: note.classId,
        sectionId: note.sectionId,
        elapsed: elapsed.current,
        total_idle_time: totalIdleTime.current,
        effective_time: elapsed.current - totalIdleTime.current,
        platform: 'Web'
      }
    });
    reset();
    initializeTimer();
    setFormulasColor('White');

    if (
      note &&
      prevSaved &&
      (note.title !== prevSaved.title || note.content !== prevSaved.content)
    ) {
      updateNote({
        note
      });
      setPrevSaved(note);
    }

    handleClose();
    exitNoteTaker({
      category: 'Note',
      objectId: note.id,
      type: 'Closed',
      sectionId: note.sectionId
    });
  }, [exitNoteTaker, handleClose, note, prevSaved, updateNote, reset, initializeTimer]);
  useEffect(() => {
    if (currentNote !== null) {
      setNote(currentNote);
      setLastSave(timeFromNow(currentNote));
      curNoteRef.current = currentNote;
      setPrevSaved(currentNote);
    } else {
      setPrevSaved(null);
      setSavedState('hidden');
      setNote(null);
    }
  }, [currentNote]);
  const onRef = useCallback((ref) => {
    if (ref?.editor) {
      ref.focus();
      const enableMathQuillFormulaAuthoring = MathQuill();
      enableMathQuillFormulaAuthoring(ref.editor, {
        displayHistory: true,
        operators: [
          ['\\sqrt[n]{x}', '\\nthroot'],
          ['\\frac{x}{y}', '\\frac'],
          ['{a}^{b}', '^'], // eslint-disable-next-line
          ['\\int', 'int'],
          ['n \\choose k', '\\choose']
        ]
      });
    }
  }, []);
  const updateTitle = useCallback((v) => {
    setTimeout(() => setSavedState('saving'), 100);
    const title = v.target.value;
    setNote((n) => ({ ...n, title }));
  }, []);
  const updateBody = useCallback((v) => {
    setTimeout(() => setSavedState('saving'), 100);
    setNote((n) => ({ ...n, content: v }));
  }, []);
  const hasNote = useMemo(() => {
    const hasNote = currentNote !== null;

    if (hasNote) {
      setFormulasColor('Black');
    }

    return hasNote;
  }, [currentNote]);

  return (
    <div>
      {hasNote && (
        <Dialog fullScreen open onClose={onExit} TransitionComponent={Transition as any}>
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <img className={classes.circleInLogo} src={CircleInLogo} alt="CircleIn logo" />
              <TextField
                fullWidth
                InputProps={{
                  disableUnderline: true
                }}
                size="small"
                placeholder="Untitled"
                value={note?.title}
                onChange={updateTitle}
              />
              <div className={classes.savedSection}>
                <div className={classes.btnGroupContainer}>
                  <div
                    className={`${classes.savedContainer} ${
                      renderSaved ? classes.savedContainerTop : null
                    } `}
                  >
                    <div className={classes.visible}>Visible to you only</div>
                    {renderSaved}
                  </div>
                  <div className={classes.exitBtnContainer}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onExit}
                      className={classes.exit}
                    >
                      Exit NoteTaker
                    </Button>
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          {hasNote && (
            <Grid container justifyContent="center" className={classes.editor}>
              <div className={classes.editorToolbar}>
                <EditorToolbar />
              </div>
              <Grid item xs={12} md={7} className={classes.innerContainerEditor}>
                <Tooltip
                  id={1204}
                  delay={600}
                  hidden={onboardingOpen}
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
      )}
    </div>
  );
};

export default UserNotesEditor;
