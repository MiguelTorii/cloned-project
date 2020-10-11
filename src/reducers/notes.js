/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import {
  notesActions,
  rootActions
} from '../constants/action-types';
import type { Action } from '../types/action';

export type NotesType = {
  title: string,
  content: string,
  created: date,
  lastModified: date,
  id: number,
  sectionId?: number
};

export type NotesState = {
  date: {
    notes: array<NotesType>,
    currentNote?: NotesType,
    sectionId: number,
    loading: boolean
  }
};


const defaultState = {
  data: {
    currentNote: null,
    sectionId: null,
    classId: null,
    notes: [],
    loading: false
  }
};

export default (
  state: NotesState = defaultState,
  action: Action
): NotesState => {
  switch (action.type) {
  case notesActions.SET_SECTION_ID:
    return update(state, {
      data: {
        notes: { $set: [] },
        sectionId: { $set: action.sectionId },
        classId: { $set: action.classId },
      }
    });
  case notesActions.SET_CURRENT_NOTE:
    return update(state, {
      data: {
        currentNote: { $set: action.note },
      }
    });
  case notesActions.LOADING_NOTES:
    return update(state, {
      data: {
        loading: { $set: action.loading },
      }
    });
  case notesActions.REMOVE_NOTE:
    return update(state, {
      data: {
        loading: { $set: false },
        notes: { $splice: [[action.id, 1]] },
      }
    });
  case notesActions.UPDATE_NOTES:
    return update(state, {
      data: {
        loading: { $set: false },
        notes: { $set: action.notes },
      }
    });
  case notesActions.ADD_NOTE:
    return update(state, {
      data: {
        loading: { $set: false },
        notes: { $push: [action.note] },
        currentNote: { $set: action.note }
      }
    });
  case rootActions.CLEAR_STATE:
    return defaultState;
  default:
    return state;
  }
};
