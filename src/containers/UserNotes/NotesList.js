import React, { useCallback, useState } from 'react'
import CustomQuill from 'components/CustomQuill'
import List from '@material-ui/core/List';
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  listPrimary: {
    fontSize: 20,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'bold'
  },
  listSecondary: {
    overflow: 'hidden',
    cursor: 'pointer',
    maxHeight: 24,
    '& .ql-editor': {
      padding: 0,
    },
    '& .ql-editor :first-child': {
      color: theme.circleIn.palette.primaryText2,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '55vw',
      fontSize: 16
    },
    fontSize: 12
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  listRoot: {
    padding: 0,
    borderBottom: `1px solid ${theme.palette.text.primary}`,
  },
  date: {
    fontSize: 12,
    marginTop: theme.spacing(1 / 2),
    color: theme.circleIn.palette.primaryText2,
  },
  itemContainer: {
    borderTop: `1px solid ${theme.palette.text.primary}`,
    alignItems: 'center',
    display: 'flex'
  },
  delete: {
    position: 'absolute',
    right: 0
  }
}))

const timeFromNow = note => {
  try {
    const { lastModified } = note
    if (typeof lastModified === 'string') {
      const utc = `${lastModified.replace(' ', 'T')}Z`
      return `Last edit was ${moment(utc).fromNow()}`
    }
    return `Last edit was ${moment(lastModified).fromNow()}`
  } catch (e) {
    return ''
  }
}

const NotesList = ({
  notes,
  hasNotes,
  openConfirmDelete,
  editNote
}) => {
  const classes = useStyles()
  const [hovered, setHovered] = useState(null)

  const onHover = useCallback(i => setHovered(i), [])
  const onLeave = useCallback(() => setHovered(null), [])

  return (
    <List className={cx(hasNotes && classes.listRoot)}>
      {notes
        .map((n, i) => (
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
                secondary={<CustomQuill value={n.content} readOnly />}
                classes={{
                  primary: classes.listPrimary,
                  secondary: classes.listSecondary
                }}
              />

              <div className={classes.date}>{timeFromNow(n)}</div>
            </ListItem>
            {i === hovered && <IconButton
              aria-label="delete"
              className={classes.delete}
              onClick={() => openConfirmDelete(i)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>}
          </div>
        ))}
    </List>
  )
}

export default NotesList
