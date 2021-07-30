import React, { useEffect, useCallback, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import * as notesActions from 'actions/notes';

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
  listRoot: {
    padding: 0,
    paddingLeft: theme.spacing(4)
  },
  itemContainer: {
    borderBottom: `1px solid #5F61654D`,
    alignItems: 'center',
    display: 'flex'
  },
  delete: {
    position: 'absolute',
    right: 0
  },
  hidden: {
    display: 'none'
  },
  emptyFolder: {
    color: '#84868A',
    fontSize: 16,
    lineHeight: '22px',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  createNote: {
    color: theme.circleIn.palette.white,
    fontSize: 18,
    lineHeight: '25px',
    margin: theme.spacing(1.5, 0, 3, -3)
  },
  addNote: {
    color: theme.circleIn.palette.brand
  }
}));

export const blankNote = {
  content: '',
  title: 'Untitled'
};

const NotesList = ({
  classId,
  sectionId,
  notes,
  openConfirmDelete,
  editNote,
  loading,
  saveNoteAction
}) => {
  const classes = useStyles();
  const [hovered, setHovered] = useState(null);
  const [refresh, setRefresh] = useState(null);

  const onHover = useCallback((i) => setHovered(i), []);
  const onLeave = useCallback(() => setHovered(null), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(moment().format());
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const createNote = useCallback(async () => {
    saveNoteAction({ note: blankNote, sectionId, classId });
  }, [classId, saveNoteAction, sectionId]);

  return loading ? (
    <div className={classes.loading}>
      <CircularProgress />
    </div>
  ) : (
    <List className={classes.listRoot}>
      {notes.length > 0 ? (
        notes.map((n, i) => (
          <div
            key={n.id}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={onLeave}
            className={classes.itemContainer}
          >
            <ListItem
              button
              className={classes.listItem}
              onClick={() => editNote(n)}
            >
              <ListItemText
                primary={n.title}
                // secondaryTypographyProps={{ component: 'div' }}
                // secondary={<CustomQuill value={n.content} readOnly />}
                classes={{
                  primary: classes.listPrimary
                  // secondary: classes.listSecondary
                }}
              />

              {/* <div className={classes.date}>{timeFromNow(n)}</div> */}
            </ListItem>
            {i === hovered && (
              <IconButton
                aria-label="delete"
                className={classes.delete}
                onClick={() => openConfirmDelete(n)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            <div className={classes.hidden}>{refresh}</div>
          </div>
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
        onClick={createNote}
      >
        <AddIcon className={classes.addNote} />
        &nbsp; Add notes
      </Button>
    </List>
  );
};

NotesList.defaultProps = {
  notes: []
};

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      saveNoteAction: notesActions.saveNoteAction
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(NotesList);
