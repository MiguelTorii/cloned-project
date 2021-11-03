import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { HudNavbarItem } from './HudNavbarItem';

type Props = {
  classes: Record<string, any>;
  navbarItems: HudNavbarItem[];
};

const MainActionNavbar = ({ classes, navbarItems }: Props) => {
  const [currentNavbarItem, setCurrentNavbarItem] = useState<HudNavbarItem>(navbarItems[0]);

  const onNavbarItemSelected = (navbarItem: HudNavbarItem) => {
    setCurrentNavbarItem(navbarItem);
    navbarItem.onSelection();
  };

  return (
    <Grid container alignItems="center">
      {navbarItems.map((navbarItem: HudNavbarItem, index: number) => (
        <Button
          key={navbarItem.id}
          color={navbarItem === currentNavbarItem ? 'primary' : 'default'}
          className={classes.button}
          onClick={() => onNavbarItemSelected(navbarItem)}
        >
          {navbarItem.displayName}
        </Button>
      ))}
    </Grid>
  );
};

export default MainActionNavbar;
