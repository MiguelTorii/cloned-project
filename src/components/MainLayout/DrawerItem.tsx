import React, { useState, useCallback, memo } from 'react';

import clsx from 'clsx';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useStyles } from '../_styles/MainLayout/DrawerItem';

type Props = {
  onClick?: any;
  link?: any;
  component?: any;
  listItemClass?: any;
  primaryText?: any;
  pathname?: any;
  OnIcon?: any;
  OffIcon?: any;
  active?: any;
};

const DrawerItem = ({
  onClick = () => {},
  link = '',
  component = 'li',
  listItemClass = '',
  primaryText,
  pathname,
  OnIcon,
  OffIcon,
  active = false
}: Props) => {
  const [hover, setHover] = useState(false);
  const classes: any = useStyles();
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
      component={component as any}
      link={link}
      onMouseOver={onHover(true)}
      onMouseLeave={onHover(false)}
      className={clsx(classes.root, listItemClass, active && classes.activePath)}
    >
      <ListItemIcon className={classes.menuIcon}>
        {active || hover || pathname === link ? OnIcon : OffIcon}
      </ListItemIcon>
      <ListItemText primary={primaryText} />
    </ListItem>
  );
};

export default memo(DrawerItem);
