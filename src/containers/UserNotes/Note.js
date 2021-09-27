import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { NotesContext } from '../../hooks/useNotes';

const useStyles = makeStyles((theme) => ({
  listPrimary: {
    fontSize: 14,
    maxWidth: '55vw',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: '19px'
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: theme.spacing(1.25, 0, 1.5, 0)
  },
  itemContainer: {
    borderBottom: `1px solid #5F61654D`,
    alignItems: 'center',
    display: 'flex'
  },
  delete: {
    position: 'absolute',
    right: 0
  }
}));

const Note = ({ noteData }) => {
  const classes = useStyles();
  const [hovered, setHovered] = useState(false);
  const { editNote, openRemoveNoteModal } = useContext(NotesContext);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const handleDeleteNote = useCallback(() => {
    openRemoveNoteModal(noteData);
  }, [noteData]);

  const handleEditNote = useCallback(() => {
    editNote(noteData);
  }, [noteData]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes.itemContainer}
    >
      <ListItem button className={classes.listItem} onClick={handleEditNote}>
        <ListItemText
          primary={noteData.title}
          classes={{
            primary: classes.listPrimary
          }}
        />
      </ListItem>
      {hovered && (
        <IconButton aria-label="delete" className={classes.delete} onClick={handleDeleteNote}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

Note.propTypes = {
  noteData: PropTypes.object.isRequired
};

export default Note;
