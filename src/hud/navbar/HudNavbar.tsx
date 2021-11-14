import React, { useState } from 'react';
import { Grid, Button, IconButton, Tooltip } from '@material-ui/core';
import { HudNavbarItem } from './HudNavbarItem';

type Props = {
  classes: Record<string, any>;
  navbarItems: HudNavbarItem[];
  onSelectItem: (navbarItemId: string) => void;
};

const HudNavbar = ({ classes, navbarItems, onSelectItem }: Props) => {
  const [currentNavbarItem, setCurrentNavbarItem] = useState<HudNavbarItem>(navbarItems[0]);

  const onNavbarItemSelected = (navbarItem: HudNavbarItem) => {
    setCurrentNavbarItem(navbarItem);
    onSelectItem(navbarItem.id);
  };

  return (
    <Grid container alignItems="center">
      {navbarItems.map((navbarItem: HudNavbarItem, index: number) => (
        <Tooltip key={navbarItem.id} title={navbarItem.displayName} arrow placement="top">
          {navbarItem.icon ? (
            <IconButton
              color={navbarItem === currentNavbarItem ? 'primary' : 'default'}
              className={classes.button}
              onClick={() => onNavbarItemSelected(navbarItem)}
            >
              {navbarItem.icon}
            </IconButton>
          ) : (
            <Button
              key={navbarItem.id}
              color={navbarItem === currentNavbarItem ? 'primary' : 'default'}
              className={classes.button}
              onClick={() => onNavbarItemSelected(navbarItem)}
            >
              {navbarItem.displayName}
            </Button>
          )}
        </Tooltip>
      ))}
    </Grid>
  );
};

export default HudNavbar;
