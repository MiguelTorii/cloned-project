import React, { useState } from 'react';
import UserNotesContainer from '../../containers/UserNotes/UserNotesContainer';
import { NotesContextProvider } from '../../hooks/useNotes';
import QuickNotes from '../../containers/QuickNotes/QuickNotes';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import HudToolbar from '../../hud/navigation/HudToolbar';
import { useStyles } from './NotebookAreaStyles';

const CLASSES_NAV_ITEM_ID = 'classes';
const QUICK_NOTES_NAV_ITEM_ID = 'quickNotes';
const FLASHCARDS_NAV_ITEM_ID = 'flashcards';

const StudyToolsArea = () => {
  const classes: any = useStyles();

  const navbarItems = [
    {
      id: CLASSES_NAV_ITEM_ID,
      displayName: 'Classes'
    },
    {
      id: QUICK_NOTES_NAV_ITEM_ID,
      displayName: 'Quick Notes'
    },
    {
      id: FLASHCARDS_NAV_ITEM_ID,
      displayName: 'Flashcards'
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

  return (
    <div className={classes.container}>
      <HudToolbar onSelectItem={setCurrentNavbarItemId} navbarItems={navbarItems} />

      {currentNavbarItemId === CLASSES_NAV_ITEM_ID && (
        <NotesContextProvider>
          <UserNotesContainer />
        </NotesContextProvider>
      )}

      {currentNavbarItemId === QUICK_NOTES_NAV_ITEM_ID && <QuickNotes />}

      {currentNavbarItemId === FLASHCARDS_NAV_ITEM_ID && <FlashcardsList />}
    </div>
  );
};

export default StudyToolsArea;
