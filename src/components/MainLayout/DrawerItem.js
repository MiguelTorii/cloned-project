import React, { useState, useCallback, memo } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import { useStyles } from '../_styles/MainLayout/DrawerItem';
import clsx from 'clsx';

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
  const [hover, setHover] = useState(false);
  const classes = useStyles();

  const onHover = useCallback(
    (hover) => () => {
      setHover(hover);
    },
    []
  );

  return (
    <ListItem
      button
      onClick={onClick}
      component={component}
      link={link}
      onMouseOver={onHover(true)}
      onMouseLeave={onHover(false)}
      className={clsx(classes.root, listItemClass)}
    >
      <ListItemIcon className={classes.menuIcon}>
        {hover || pathname === link ? OnIcon : OffIcon}
      </ListItemIcon>
      <ListItemText primary={primaryText} />
    </ListItem>
  );
};

export default memo(DrawerItem);
