import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import queryString from 'query-string'
import Tooltip from '../../containers/Tooltip';

type Props = {
  MyLink: Function,
  openClassmatesDialog: Function
};

const SubItems = ({
  MyLink,
  openClassmatesDialog,
  createPostOpen
}: Props) => {
  const classes = makeStyles(theme => ({
    item: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      paddingTop: 0,
      paddingBottom: 0,
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(3),
      '&:hover': {
        background: theme.circleIn.palette.primaryText2
      },
    },
    currentPath: {
      background: theme.circleIn.palette.modalBackground,
    },
    label: {
      fontSize: 14,
      fontWeight: 600,
    }
  }))()

  const { pathname, search } = window.location
  const qs = queryString.parse(search)

  return (
    <div>
      <ListItem
        button
        component={MyLink}
        link={`/my_posts?${queryString.stringify({ ...qs, from: 'me' })}`}
        className={classNames(
          classes.item,
          ['/my_posts'].includes(pathname) && qs.from === 'me' ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemText
          primary="My Posts"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
      <ListItem
        button
        component={MyLink}
        link={`/bookmarks?${queryString.stringify({ ...qs, from: 'bookmarks' })}`}
        className={classNames(
          classes.item,
          ['/bookmarks'].includes(pathname) && qs.from === 'bookmarks' ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemText
          primary="Bookmarks"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
      <ListItem
        button
        component={MyLink}
        link={{
          pathname: `/leaderboard`,
          search: `?class=${qs.class}`
        }}
        className={classNames(
          classes.item,
          ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath
        )}
      >
        <Tooltip
          hidden={createPostOpen}
          id={6938}
          placement="left"
          text="See the scores of all your classmates towards scholarships and gifts."
        >
          <ListItemText
            primary="Class Leaderboard"
            classes={{
              primary: classes.label
            }}
          />
        </Tooltip>
      </ListItem>
      <ListItem
        button
        onClick={openClassmatesDialog}
        className={classNames(
          classes.item,
        )}
      >
        <ListItemText
          primary="Classmates"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
    </div>
  )
}

export default SubItems
