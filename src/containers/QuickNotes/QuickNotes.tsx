import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';

import { useDebounce } from '@react-hook/debounce';
import { Picker } from 'emoji-mart';
import ReactQuill from 'react-quill';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { isMac } from 'utils/helpers';

import * as notesActions from 'actions/notes';
import * as notificationsActions from 'actions/notifications';
import { ReactComponent as DropdownCheckIcon } from 'assets/svg/dropdown-check.svg';
import { ReactComponent as IconNote } from 'assets/svg/note.svg';

import Tooltip from '../Tooltip/Tooltip';

import useStyles from './_styles/style';
import EditorToolbar, { modules, formats } from './QuickNoteToolbar';

import type { State as StoreState } from 'types/state';

type Props = {
  enqueueSnackbar?: any;
  userClasses?: any;
  updateQuickNoteContent?: any;
  resetQuickNote?: any;
  quicknoteContent?: any;
  saveNoteAction?: any;
  viewedOnboarding?: any;
  quicknoteId?: any;
  updateNote?: any;
};

const QuickNotes = ({
  enqueueSnackbar,
  userClasses,
  updateQuickNoteContent,
  resetQuickNote,
  quicknoteContent,
  saveNoteAction,
  viewedOnboarding,
  quicknoteId,
  updateNote
}: Props) => {
  const noteRef = useRef(null);
  const quillRef = useRef(null);
  const inputFieldRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes: any = useStyles();
  const [selectedClass, setSelectedClass] = useState(null);
  const [prevContent, setPrevContent] = useState('');
  const [open, setOpen] = useState(false);
  const [savedState, setSavedState] = useState('hidden');
  const [debouncedContent, setDebouncedContent] = useDebounce('', 2000);
  const [emojiPopupOpen, setEmojiPopupOpen] = useState(false);

  useEffect(() => setDebouncedContent(quicknoteContent), [quicknoteContent, setDebouncedContent]);
  const bindings = useMemo(
    () => ({
      emoji: {
        key: 'J',
        shortKey: true,
        altKey: !isMac(),
        handler: () => {
          setEmojiPopupOpen(true);
          return true;
        }
      }
    }),
    []
  );

  const saveContent = useCallback(
    async (content, currentClass = null) => {
      const now = new Date();

      if (
        !content ||
        content === '<p><br></p>' ||
        !selectedClass ||
        !selectedClass.sectionId ||
        !selectedClass.classId
      ) {
        return;
      }

      setPrevContent(debouncedContent);

      if (!quicknoteId || currentClass) {
        await saveNoteAction({
          note: {
            title: 'Untitled',
            sectionId: currentClass ? currentClass.sectionId : selectedClass.sectionId,
            classId: currentClass ? currentClass.classId : selectedClass.classId,
            lastModified: now,
            content
          },
          quicknote: true,
          sectionId: currentClass ? currentClass.sectionId : selectedClass.sectionId,
          classId: currentClass ? currentClass.classId : selectedClass.classId
        });
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
        });
      }

      setSavedState('show');
      setTimeout(() => setSavedState('hidden'), 60000);
    },
    [debouncedContent, quicknoteId, saveNoteAction, selectedClass, updateNote]
  );
  useEffect(() => {
    if (debouncedContent && debouncedContent !== prevContent && selectedClass) {
      saveContent(debouncedContent);
    }
  }, [debouncedContent, prevContent, saveContent, selectedClass]);
  const handleUpdate = useCallback(
    (text) => {
      setTimeout(() => {
        if (selectedClass) {
          setSavedState('saving');
        }
      }, 100);
      updateQuickNoteContent({
        content: text
      });
    },
    [selectedClass, updateQuickNoteContent]
  );
  const insertEmoji = useCallback(
    (emoji) => {
      if (quillRef.current?.editor) {
        quillRef.current.focus();
        const cursorPosition = quillRef.current.editor.getSelection(true).index;
        quillRef.current.editor.insertText(cursorPosition, `${emoji}`);
        quillRef.current.editor.setSelection(cursorPosition + 2);
        handleUpdate(quillRef.current.editor.root.innerHTML);
      }
    },
    [quillRef, handleUpdate]
  );
  const handleSelectEmoji = useCallback(
    (emoji) => {
      const { native } = emoji;
      insertEmoji(native);
      setEmojiPopupOpen(false);
    },
    [insertEmoji]
  );
  const handleCloseEmojiPopup = useCallback(() => {
    setEmojiPopupOpen(false);
  }, []);
  const renderSaved = useMemo(() => {
    if (savedState === 'hidden') {
      return null;
    }

    if (savedState === 'saving') {
      return <div className={classes.lastSaved}>Saving...</div>;
    }

    return (
      <Tooltip
        id={3499}
        delay={600}
        hidden={!viewedOnboarding}
        placement="bottom"
        text="We save your QuickNotes with the date and time you created it."
      >
        <div className={classes.lastSaved}>Saved to your class folder for later.</div>
      </Tooltip>
    );
  }, [classes.lastSaved, savedState, viewedOnboarding]);
  const classList = useMemo(() => {
    if (userClasses?.classList) {
      const classList = userClasses.classList
        .filter((c) => c.section.length !== 0)
        .map((c) => ({
          name: c.className,
          color: c.bgColor,
          sectionId: c.section?.[0]?.sectionId,
          classId: c.classId
        }));
      return classList;
    }

    return [];
  }, [userClasses]);
  const handleClick = useCallback(() => {
    setAnchorEl(noteRef.current);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const updateClass = useCallback(
    async (cl) => {
      setSelectedClass(cl);

      if (quicknoteContent !== '<p><br></p>' || !quicknoteContent) {
        await saveContent(quicknoteContent, cl);
      }
    },
    [quicknoteContent, saveContent]
  );
  const handleToolbar = useCallback(() => {
    setOpen(!open);
  }, [open]);
  const saveAndClose = useCallback(async () => {
    handleClose();

    if (debouncedContent !== quicknoteContent) {
      await saveContent(quicknoteContent);
    }

    resetQuickNote();

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

    setSelectedClass(null);
  }, [
    classes.stackbar,
    debouncedContent,
    enqueueSnackbar,
    handleClose,
    quicknoteContent,
    resetQuickNote,
    saveContent,
    selectedClass
  ]);
  const disableSaveNote = useMemo(() => {
    if (quicknoteContent === '<p><br></p>' || !quicknoteContent) {
      return true;
    }

    return false;
  }, [quicknoteContent]);
  return (
    <Grid container>
      <IconButton ref={noteRef} onClick={handleClick}>
        <IconNote />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        className={classes.container}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        getContentAnchorEl={null}
      >
        <Paper
          className={classes.container}
          classes={{
            root: classes.quickNoteRoot
          }}
          ref={inputFieldRef}
        >
          <Typography className={classes.title}>QuickNotes</Typography>
          <IconButton className={classes.closeIcon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={classes.noteOptions}>
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.classLabel} id="select-label">
                Which class is this for?
              </InputLabel>
              <Select
                className={classes.select}
                labelWidth={200}
                labelId="select-label"
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
                classes={{
                  selectMenu: classes.menuTypeInput
                }}
                value={selectedClass?.sectionId || ''}
                renderValue={() => (
                  <Typography
                    className={classes.renderMenu}
                    style={{
                      backgroundColor: selectedClass?.color
                    }}
                  >
                    {selectedClass.name}
                  </Typography>
                )}
              >
                {classList.map((cl) => (
                  <MenuItem
                    key={cl.sectionId}
                    onClick={() => updateClass(cl)}
                    value={cl.sectionId}
                    className={classes.menuItem}
                    // eslint-disable-next-line
                    // @ts-ignore
                    ListItemClasses={{
                      root: classes.menuItemList as React.ElementType,
                      selected: classes.selectedMenuItem as React.ElementType
                    }}
                  >
                    <Typography className={classes.menuTypo}>{cl.name}</Typography>
                    {cl.sectionId === selectedClass?.sectionId && <DropdownCheckIcon />}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={handleToolbar}>
              <MoreVertIcon />
            </IconButton>
          </div>
          <EditorToolbar open={open} insertEmoji={insertEmoji} />
          <ReactQuill
            ref={quillRef}
            placeholder="Write all your brilliant ideas, a-ha moments, reminders and anything you need here ????"
            theme="snow"
            value={quicknoteContent}
            onChange={handleUpdate}
            modules={{
              ...modules,
              keyboard: {
                bindings
              }
            }}
            formats={formats}
          />
          <div className={classes.savedContainer}>
            {renderSaved}
            <Button
              variant="contained"
              disabled={!selectedClass || disableSaveNote}
              className={classes.button}
              classes={{
                disabled: classes.disableBtn
              }}
              onClick={saveAndClose}
            >
              Save
            </Button>
          </div>
          <Popover
            open={emojiPopupOpen}
            onClose={handleCloseEmojiPopup}
            anchorEl={inputFieldRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            getContentAnchorEl={null}
          >
            <Picker onSelect={handleSelectEmoji} />
          </Popover>
        </Paper>
      </Popover>
    </Grid>
  );
};

const mapStateToProps = ({ user, notes }: StoreState): {} => ({
  userClasses: user.userClasses,
  quicknoteId: notes.data.quicknoteId,
  quicknoteContent: notes.data.quicknoteContent,
  viewedOnboarding: user.syncData.viewedOnboarding
});

const mapDispatchToProps = (dispatch: any): {} =>
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

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(QuickNotes);
