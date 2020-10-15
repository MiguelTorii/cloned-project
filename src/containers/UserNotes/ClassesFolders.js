import React from 'react'
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Tooltip from 'containers/Tooltip';

const useStyles = makeStyles(() => ({
  listItem: {
    borderBottom: `1px solid #324F61`,
  },
  listRoot: {
    padding: 0,
  },
  title: {
    fontWeight: 'bold'
  },
}))

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
)

const ClassesFolders = ({
  setSectionId,
  onboardingOpen,
  classList
}) => {
  const classes = useStyles()

  return (
    <List className={classes.listRoot}>
      {classList.map((cl, idx) => (
        <ListItem
          key={`notes-folder-${cl.sectionId}`}
          button
          onClick={() => setSectionId({ sectionId: cl.sectionId, classId: cl.classId })}
          className={classes.listItem}
        >
          <ListItemIcon>
            <FolderOpenIcon style={{ color: cl?.color }} />
          </ListItemIcon>
          <ListItemText
            primary={renderTitleAndTooltip(cl.name, idx, onboardingOpen)}
            className={classes.title}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default ClassesFolders
