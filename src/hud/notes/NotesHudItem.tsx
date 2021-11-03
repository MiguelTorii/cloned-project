import React, { useState } from 'react';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import UserNotesContainer from '../../containers/UserNotes/UserNotesContainer';
import { NotesContextProvider } from '../../hooks/useNotes';
import MainActionNavbar from '../navbar/HudNavbar';
import QuickNotes from '../../containers/QuickNotes/QuickNotes';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';

type Props = {
  classes: Record<string, any>;
};

enum NOTE_SECTIONS {
  'Classes',
  'QuickNotes',
  'Flashcards'
}

const NotesHudItem = ({ classes }: Props) => {
  const [currentGoalPage, setCurrentGoalPage] = useState<NOTE_SECTIONS>(NOTE_SECTIONS.Classes);

  const navbarItems = [
    {
      id: 'classes',
      displayName: 'Classes',
      onSelection: () => setCurrentGoalPage(NOTE_SECTIONS.Classes)
    },
    {
      id: 'quickNotes',
      displayName: 'Quick Notes',
      onSelection: () => setCurrentGoalPage(NOTE_SECTIONS.QuickNotes)
    },
    {
      id: 'flashcards',
      displayName: 'Flashcards',
      onSelection: () => setCurrentGoalPage(NOTE_SECTIONS.Flashcards)
    }
  ];

  return (
    <div className={classes.container}>
      <MainActionNavbar navbarItems={navbarItems} classes={classes} />

      {currentGoalPage === NOTE_SECTIONS.Classes && (
        <NotesContextProvider>
          <UserNotesContainer />
        </NotesContextProvider>
      )}

      {currentGoalPage === NOTE_SECTIONS.QuickNotes && <QuickNotes />}

      {currentGoalPage === NOTE_SECTIONS.Flashcards && <FlashcardsList />}
    </div>
  );
};

export default withRoot(withWidth()(NotesHudItem));
