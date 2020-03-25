import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import queryString from 'query-string'

type Props = {
  MyLink: Function
}

const SubItems = ({
  MyLink, 
}: Props) => {
  const classes = makeStyles(theme => ({
    item: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      paddingTop: 0,
      paddingBottom: 0,
      margin: theme.spacing(2),
      fontSize: 14,
      marginLeft: theme.spacing(8),
      '&:hover': {
        background: theme.circleIn.palette.primaryText2
      },
    },
    currentPath: {
      background: theme.circleIn.palette.modalBackground,
    },
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
        /> 
      </ListItem> 
      <ListItem 
        button 
        component={MyLink} 
        link={{
          pathname: `/leaderboard`,
          search: `?${queryString.stringify({ sectionId: qs.sectionId, classId: qs.classId })}`
        }} 
        className={classNames( 
          classes.item,
          ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath 
        )} 
      > 
        <ListItemText 
          primary="Class Leaderboard" 
        /> 
      </ListItem> 
      {/* <ListItem */}
      {/* button */}
      {/* // component={MyLink} */}
      {/* // link={`/bookmarks?${queryString.stringify({ ...qs, from: 'bookmarks' })}`} */}
      {/* className={classNames( */}
      {/* classes.item, */}
      {/* // ['/bookmarks'].includes(pathname) && qs.from === 'bookmarks' ? classes.currentPath : classes.otherPath */}
      {/* )} */}
      {/* > */}
      {/* <ListItemText */}
      {/* primary="Classmates" */}
      {/* /> */}
      {/* </ListItem> */}
    </div>
  )
}

export default SubItems
