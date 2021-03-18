import React, { useState, useCallback, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    marginRight: theme.spacing(),
    maxHeight: 28,
    maxWidth: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
}))

const DrawerItem = ({
  onClick = () => {},
  link = '',
  component = 'li',
  listItemClass = '',
  primaryText,
  pathname,
  OnIcon,
  OffIcon
}) => {
  const [hover, setHover] = useState(false)
  const classes = useStyles()

  const onHover = useCallback(hover => () => {
    setHover(hover)
  }, [])

  return (
    <ListItem
      button
      onClick={onClick}
      component={component}
      link={link}
      onMouseOver={onHover(true)}
      onMouseLeave={onHover(false)}
      className={listItemClass}
    >
      <ListItemIcon className={classes.menuIcon}>
        {hover || pathname === link
          ? OnIcon
          : OffIcon
        }
      </ListItemIcon>
      <ListItemText primary={primaryText} />
    </ListItem>
  )
}

export default memo(DrawerItem)
