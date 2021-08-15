import React, { useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';

import useStyles from './styles';
import Tooltip from '../Tooltip';
import { NotesContext } from '../../hooks/useNotes';
import LoadingSpin from '../../components/LoadingSpin';
import Note from './Note';

const ClassNotes = ({ classData, arrayIndex }) => {
  const classes = useStyles();
  const {
    fetchNotesBySectionId,
    notesBySectionId,
    createNewNote
  } = useContext(NotesContext);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const sectionId = useMemo(() => {
    return classData.section?.[0].sectionId;
  }, [classData]);

  const noteList = useMemo(() => {
    return notesBySectionId[sectionId] || [];
  }, [sectionId, notesBySectionId]);

  const handleSwitchExpand = useCallback(() => {
    // Try to fetch notes if it's the first time
    if (!expanded && !notesLoaded) {
      setNotesLoaded(true);

      // Start fetching
      setLoading(true);
      fetchNotesBySectionId(sectionId).then(() => setLoading(false));
    }

    setExpanded(!expanded);
  }, [expanded, sectionId, fetchNotesBySectionId, notesLoaded]);

  const renderTitleAndTooltip = useCallback(
    (name, idx, onboardingOpen) => (
      <div style={{ display: 'flex' }}>
        {name}
        {idx === 0 && (
          <Tooltip
            id={9002}
            hidden={onboardingOpen}
            delay={600}
            placement="right"
            text="Select a class to view the notes inside, or to create new notes."
          >
            <div />
          </Tooltip>
        )}
      </div>
    ),
    []
  );

  const handleCreateNote = useCallback(() => {
    createNewNote(classData.classId, sectionId);
  }, [sectionId, classData, createNewNote]);

  const renderNotes = useCallback(() => {
    if (!expanded) return null;
    if (loading) {
      return <LoadingSpin />;
    }

    return (
      <List className={classes.noteListRoot}>
        {noteList.length > 0 ? (
          noteList.map((note) => (
            <Note noteData={note} key={note.id} />
          ))
        ) : (
          <div className={classes.emptyFolder}>
            No notes yet! Click below to add some amazing notes to study.
          </div>
        )}
        <Button
          variant="text"
          className={classes.createNote}
          color="primary"
          onClick={handleCreateNote}
        >
          <AddIcon className={classes.addNote} />
          &nbsp; Add notes
        </Button>
      </List>
    )
  }, [expanded, loading, noteList, handleCreateNote]);

  return (
    <>
      <div className={classes.listItemContainer} onClick={handleSwitchExpand}>
        {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        <ListItem
          className={classes.listItem}
        >
          <ListItemIcon>
            <FolderOpenIcon
              style={{
                color: classData.isCurrent ? classData?.bgColor : '#5F6165'
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={renderTitleAndTooltip(
              classData.className,
              arrayIndex,
              false
            )}
            className={classes.title}
          />
        </ListItem>
      </div>
      {renderNotes()}
    </>
  );
};

PropTypes.propTypes = {
  classData: PropTypes.object.isRequired,
  arrayIndex: PropTypes.number.isRequired
};

export default ClassNotes;
