import React, { useState } from 'react';
import { Grid, Button, IconButton, Tooltip } from '@material-ui/core';
import { HudTool } from './HudTool';
import { useStyles } from './HudToolbarStyles';

type Props = {
  navbarItems: HudTool[];
  onSelectItem: (navbarItemId: string) => void;
};

const HudToolbar = ({ navbarItems, onSelectItem }: Props) => {
  const classes: any = useStyles();

  const [currentNavbarItem, setCurrentNavbarItem] = useState<HudTool>(navbarItems[0]);

  const onNavbarItemSelected = (navbarItem: HudTool) => {
    setCurrentNavbarItem(navbarItem);
    onSelectItem(navbarItem.id);
  };

  return (
    <Grid container alignItems="center">
      {navbarItems.map((navbarItem: HudTool, index: number) => (
        <Tooltip key={navbarItem.id} title={navbarItem.displayName} arrow placement="top">
          {navbarItem.icon ? (
            <IconButton
              color={navbarItem === currentNavbarItem ? 'primary' : 'default'}
              className={classes.toolButton}
              size="medium"
              onClick={() => onNavbarItemSelected(navbarItem)}
            >
              {navbarItem.icon}
            </IconButton>
          ) : (
            <Button
              key={navbarItem.id}
              color={navbarItem === currentNavbarItem ? 'primary' : 'default'}
              className={classes.toolButton}
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

export default HudToolbar;
