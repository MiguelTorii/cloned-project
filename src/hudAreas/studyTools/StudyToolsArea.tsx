import React from 'react';
import { useSelector } from 'react-redux';
import UserNotesContainer from '../../containers/UserNotes/UserNotesContainer';
import { NotesContextProvider } from '../../hooks/useNotes';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import { useStyles } from './StudyToolsAreaStyles';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import {
  CALENDAR_AREA,
  FLASHCARDS_AREA,
  NOTES_AREA
} from '../../hud/navigationState/hudNavigation';
import CalendarSubArea from '../calendar/CalendarSubArea';

const StudyToolsArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  return (
    <div className={classes.container}>
      {selectedMainSubArea === NOTES_AREA && (
        <NotesContextProvider>
          <UserNotesContainer />
        </NotesContextProvider>
      )}

      {selectedMainSubArea === FLASHCARDS_AREA && <FlashcardsList />}

      {selectedMainSubArea === CALENDAR_AREA && <CalendarSubArea />}
    </div>
  );
};

export default StudyToolsArea;
