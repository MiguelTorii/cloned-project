import { NotesType } from 'reducers/notes';
import * as api from 'api/notes';
import moment from 'moment';
import { logEventLocally } from 'api/analytics';
import { notesActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

const updateNotes = ({ notes }: { notes: array<NotesType> }): Action => ({
  type: notesActions.UPDATE_NOTES,
  notes
});

const addNote = ({ notes, quicknoteId }: { notes: NotesType, quicknote: number }): Action => ({
  type: notesActions.ADD_NOTE,
  quicknoteId,
  notes
});

const removeNote = ({ id }: { id: number }): Action => ({
  type: notesActions.REMOVE_NOTE,
  id
});

const loadingAction = ({ loading }: { loading: boolean }): Action => ({
  type: notesActions.LOADING_NOTES,
  loading
});

const setCurrentNoteAction = ({ note }: { note: NotesType }): Action => ({
  type: notesActions.SET_CURRENT_NOTE,
  note
});

const setSectionIdAction = ({
  sectionId,
  classId
}: {
  sectionId: number,
  classId: number
}): Action => ({
  type: notesActions.SET_SECTION_ID,
  sectionId,
  classId
});

const updateQuickNoteContentAction = ({ content }: { content: string }): Action => ({
  type: notesActions.UPDATE_QUICKNOTE_CONTENT,
  content
});

const resetQuickNoteAction = () => ({
  type: notesActions.RESET_QUICKNOTE
});

export const updateQuickNoteContent =
  ({ content }: { content: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      updateQuickNoteContentAction({
        content
      })
    );
  };
export const resetQuickNote = () => async (dispatch: Dispatch) => {
  dispatch(resetQuickNoteAction());
};

const sortNotes = (notes) =>
  notes.sort((a, b) => {
    const dateA = moment(a.lastModified).valueOf();
    const dateB = moment(b.lastModified).valueOf();
    return dateB - dateA;
  });

export const getNotes =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    try {
      const {
        notes: {
          data: { sectionId }
        }
      } = getState();
      dispatch(
        loadingAction({
          loading: true
        })
      );
      const { notes } = await api.getNotes({
        sectionId
      });

      if (notes) {
        dispatch(
          updateNotes({
            notes: sortNotes(notes)
          })
        );
      } else {
        dispatch(
          loadingAction({
            loading: false
          })
        );
      }

      return notes;
    } catch (err) {
      dispatch(
        loadingAction({
          loading: false
        })
      );
    }
  };
export const updateNote =
  ({ note }: { note: NotesType }) =>
  async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    try {
      const {
        notes: {
          data: { notes, sectionId }
        }
      } = getState();
      dispatch(
        loadingAction({
          loading: true
        })
      );
      const res = await api.updateNote({
        note
      });

      if (res.success) {
        logEventLocally({
          category: 'Note',
          objectId: note.id,
          sectionId: note.sectionId,
          type: 'Updated'
        });
        const filtered = notes.filter((n) => n.id !== note.id);
        const newNote = { ...note, lastModified: new Date() };

        if (sectionId === note.sectionId) {
          dispatch(
            updateNotes({
              notes: [newNote, ...filtered]
            })
          );
        }

        dispatch(
          loadingAction({
            loading: false
          })
        );
      } else {
        dispatch(
          loadingAction({
            loading: false
          })
        );
      }
    } catch (err) {
      dispatch(
        loadingAction({
          loading: false
        })
      );
    }
  };
export const saveNoteAction =
  ({
    note,
    sectionId,
    classId,
    quicknote
  }: {
    note: NotesType,
    classId: number,
    sectionId: number,
    quicknote: boolean
  }) =>
  async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    try {
      dispatch(
        loadingAction({
          loading: true
        })
      );
      const {
        notes: {
          data: { notes, sectionId: curSectionId }
        }
      } = getState();
      const { note_id: noteId } = await api.postNote({
        note,
        sectionId,
        classId
      });

      if (noteId) {
        logEventLocally({
          category: 'Note',
          objectId: noteId,
          sectionId,
          type: 'Created'
        });
        const newNote = { ...note, id: noteId, classId, sectionId, lastModified: new Date() };

        if (curSectionId === sectionId) {
          dispatch(
            addNote({
              quicknoteId: quicknote ? noteId : null,
              notes: [newNote, ...notes]
            })
          );
        } else {
          dispatch(
            addNote({
              quicknoteId: quicknote ? noteId : null,
              notes
            })
          );
        }
      }

      dispatch(
        loadingAction({
          loading: false
        })
      );
    } catch (err) {
      dispatch(
        loadingAction({
          loading: false
        })
      );
    }
  };
export const setCurrentNote =
  ({ note }: { note: NotesType }) =>
  async (dispatch: Dispatch) => {
    if (note) {
      const res = await api.getNote({
        noteId: note.id
      });
      dispatch(
        setCurrentNoteAction({
          note: res
        })
      );
      logEventLocally({
        category: 'Note',
        objectId: note.id,
        sectionId: note.sectionId,
        type: 'Opened'
      });
    } else {
      dispatch(
        setCurrentNoteAction({
          note: null
        })
      );
    }
  };
export const setSectionId =
  ({ sectionId, classId }: { sectionId: number, classId: number }) =>
  async (dispatch: Dispatch) => {
    dispatch(
      setSectionIdAction({
        sectionId,
        classId
      })
    );
  };
export const deleteNoteAction =
  ({ note }: { note: NotesType }) =>
  async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    try {
      const {
        notes: {
          data: { notes }
        }
      } = getState();
      dispatch(
        loadingAction({
          loading: true
        })
      );
      const { success } = await api.deleteNote({
        note
      });

      if (success) {
        const id = notes.findIndex((n) => n.id === note.id);
        dispatch(
          removeNote({
            id
          })
        );
      } else {
        dispatch(
          loadingAction({
            loading: false
          })
        );
      }
    } catch (err) {
      dispatch(
        loadingAction({
          loading: false
        })
      );
    }
  };
export const exitNoteTaker =
  ({ category, objectId, type, sectoinId }) =>
  async () => {
    logEventLocally({
      category,
      objectId,
      sectoinId,
      type
    });
  };
