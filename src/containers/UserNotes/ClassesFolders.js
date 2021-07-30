import React, { useMemo, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import * as notesActions from 'actions/notes';
import Tooltip from 'containers/Tooltip';
import EmptyState from 'components/FeedList/EmptyState';
import EmptyPastClass from 'assets/img/empty-past-class.png';
import NotesList from './NotesList';

const useStyles = makeStyles((theme) => ({
  listItemContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: theme.circleIn.palette.gray1
    }
  },
  listItem: {
    borderBottom: `1px solid #5F61654D`,
    fontWeight: 800,
    fontSize: 24,
    color: theme.circleIn.palette.primaryText1,
    lineHeight: '33px',
    paddingLeft: 0,
    marginLeft: theme.spacing(1)
  },
  listRoot: {
    padding: 0
  },
  title: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1)
  },
  emptyStateContainer: {
    maxWidth: 514,
    lineHeight: '33px',
    textAlign: 'left'
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: theme.circleIn.palette.white,
    marginBottom: theme.spacing(3)
  },
  emptyBody: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.circleIn.palette.white
  }
}));

const renderTitleAndTooltip = (name, idx, onboardingOpen) => (
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
);

const ClassesFolders = ({
  sectionId,
  setSectionId,
  onboardingOpen,
  classList,
  notes,
  hasNotes,
  openConfirmDelete,
  editNote,
  getNotes
}) => {
  const [status, setStatus] = useState({});
  const [noteList, setNoteList] = useState({});
  const [loading, setLoading] = useState({});
  const classes = useStyles();
  const isFolder = useMemo(() => sectionId !== null, [sectionId]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading((loading) => ({
          ...loading,
          [sectionId]: true
        }));
        const notes = await getNotes();
        setNoteList((noteList) => ({
          ...noteList,
          [sectionId]: notes
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading((loading) => ({
          ...loading,
          [sectionId]: false
        }));
      }
    };

    if (isFolder) init();
  }, [getNotes, isFolder, sectionId]);

  useEffect(() => {
    setNoteList((noteList) => ({
      ...noteList,
      [sectionId]: notes
    }));
  }, [notes, sectionId]);

  const handleClick = (sectionId, classId) => {
    setStatus((status) => ({
      ...status,
      [sectionId]: !status[sectionId]
    }));
    setSectionId({ sectionId, classId });
  };

  return (
    <List className={classes.listRoot}>
      {classList.map((cl, idx) => (
        <>
          <div
            className={classes.listItemContainer}
            onClick={() => handleClick(cl.sectionId, cl.classId)}
          >
            {status[cl.sectionId] ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <ListItem
              key={`notes-folder-${cl.sectionId}`}
              className={classes.listItem}
            >
              <ListItemIcon>
                <FolderOpenIcon
                  style={{ color: cl.isCurrent ? cl?.color : '#5F6165' }}
                />
              </ListItemIcon>
              <ListItemText
                primary={renderTitleAndTooltip(cl.name, idx, onboardingOpen)}
                className={classes.title}
              />
            </ListItem>
          </div>
          {status[cl.sectionId] && (
            <NotesList
              classId={cl.classId}
              sectionId={cl.sectionId}
              notes={noteList[cl.sectionId]}
              loading={loading[cl.sectionId]}
              openConfirmDelete={openConfirmDelete}
              editNote={editNote}
            />
          )}
        </>
      ))}
      {classList.length === 0 && (
        <EmptyState imageUrl={EmptyPastClass}>
          <div className={classes.emptyStateContainer}>
            <div className={classes.emptyTitle}>
              This tab shows notes from “past classes”.
            </div>
            <div className={classes.emptyBody}>
              You don’t have any past classes yet, but your notes will be saved
              here and ready for you once you finish your current classes.&nbsp;
              <span role="img" aria-label="Wink emoji">
                😉
              </span>
            </div>
          </div>
        </EmptyState>
      )}
    </List>
  );
};

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      getNotes: notesActions.getNotes
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ClassesFolders);
