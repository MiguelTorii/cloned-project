import React, { useCallback, useState } from 'react';
import * as api from 'api/notes';
import moment from 'moment';
import { logEventLocally } from '../api/analytics';
import UserNotesEditor from '../components/UserNotesEditor/UserNotesEditor';
import DeleteNote from '../containers/UserNotes/DeleteNote';

const useNotes = () => {
  const [notesBySectionId, setNotesBySectionId] = useState({});
  const [noteToRemove, setNoteToRemove] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);

  // Fetch notes using section_id
  const fetchNotesBySectionId = useCallback(async (sectionId) => {
    const { notes } = await api.getNotes({ sectionId });

    setNotesBySectionId((data) => ({
      ...data,
      [sectionId]: notes.sort(
        (noteA, noteB) =>
          moment(noteB.lastModified).valueOf() - moment(noteA.lastModified).valueOf()
      )
    }));
  }, []);

  const createNewNote = useCallback(async (classId, sectionId) => {
    const note = {
      content: '',
      title: 'Untitled'
    };

    const { note_id: noteId } = await api.postNote({
      note,
      sectionId,
      classId
    });

    if (!noteId) {
      return;
    }

    // Make a log
    logEventLocally({
      category: 'Note',
      objectId: noteId,
      sectionId,
      type: 'Created'
    });

    const newNoteData = {
      ...note,
      id: noteId,
      classId,
      sectionId,
      lastModified: new Date()
    };

    // Add a note
    setNotesBySectionId((data) => {
      const sectionNotes = data[sectionId] || [];

      return {
        ...data,
        [sectionId]: [newNoteData, ...sectionNotes]
      };
    });

    // Edit new note
    setNoteToEdit(newNoteData);
  }, []);

  const stopEditNote = useCallback(() => setNoteToEdit(null), []);

  const updateNote = useCallback(async ({ note }) => {
    const res = await api.updateNote({ note });

    if (!res.success) {
      return;
    }

    // Log event
    logEventLocally({
      category: 'Note',
      objectId: note.id,
      sectionId: note.sectionId,
      type: 'Updated'
    });

    setNotesBySectionId((data) => ({
      ...data,
      [note.sectionId]: (data[note.sectionId] || []).map((item) => {
        if (item.id !== note.id) {
          return item;
        }
        return {
          ...note,
          lastModified: new Date()
        };
      })
    }));
  }, []);

  const editNote = useCallback((note) => {
    setNoteToEdit(note);
  }, []);

  const openRemoveNoteModal = useCallback((note) => {
    setNoteToRemove(note);
  }, []);

  const cancelRemoveNote = useCallback(() => {
    setNoteToRemove(null);
  }, []);

  const removeNote = useCallback(async () => {
    const { success } = await api.deleteNote({ note: noteToRemove });

    if (!success) {
      return;
    }

    setNotesBySectionId((data) => ({
      ...data,
      [noteToRemove.sectionId]: (data[noteToRemove.sectionId] || []).filter(
        (item) => item.id !== noteToRemove.id
      )
    }));

    setNoteToRemove(null);
  }, [noteToRemove]);

  return {
    // Attributes
    notesBySectionId,
    noteToEdit,
    noteToRemove,

    // Methods
    fetchNotesBySectionId,
    createNewNote,
    stopEditNote,
    updateNote,
    editNote,
    openRemoveNoteModal,
    cancelRemoveNote,
    removeNote
  };
};

export const NotesContext = React.createContext({});
export const NotesContextProvider = ({ children }) => {
  const data = useNotes();
  const { noteToEdit, noteToRemove, stopEditNote, updateNote, removeNote, cancelRemoveNote } = data;

  const handleLog = useCallback((logData) => {
    logEventLocally(logData);
  }, []);

  return (
    <NotesContext.Provider value={data}>
      {children}
      {noteToEdit && (
        <UserNotesEditor
          handleClose={stopEditNote}
          updateNote={updateNote}
          currentNote={noteToEdit}
          exitNoteTaker={handleLog}
        />
      )}
      <DeleteNote
        confirmDelete={noteToRemove}
        handleDeleteNote={removeNote}
        closeConfirmDelete={cancelRemoveNote}
      />
    </NotesContext.Provider>
  );
};

export default useNotes;
