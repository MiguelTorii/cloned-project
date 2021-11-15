import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { HudTool } from './HudTool';
import { useStyles } from './HudToolbarStyles';

type Props = {
  navbarItems: HudTool[];
  onSelectItem: (navbarItemId: string) => void;
  isVertical?: boolean;
};

const HudToolbar = ({ navbarItems, onSelectItem, isVertical }: Props) => {
  const classes: any = useStyles();

  const [selectedTool, setSelectedTool] = useState<HudTool>(navbarItems[0]);

  const selectTool = (tool: HudTool) => {
    setSelectedTool(tool);
    onSelectItem(tool.id);
  };

  const renderIconButton = (navbarItem: HudTool) => {
    if (navbarItem.icon) {
      return (
        <IconButton
          color={navbarItem === selectedTool ? 'primary' : 'default'}
          className={classes.toolButton}
          size="medium"
          onClick={() => selectTool(navbarItem)}
        >
          {navbarItem.icon}
        </IconButton>
      );
    }
    if (navbarItem.iconText) {
      return (
        <IconButton
          color={'secondary'}
          className={classes.toolButton}
          size="medium"
          onClick={() => selectTool(navbarItem)}
        >
          {navbarItem.iconText}
        </IconButton>
      );
    }
    return (
      <Button
        key={navbarItem.id}
        color={navbarItem === selectedTool ? 'primary' : 'default'}
        className={classes.textIconButton}
        onClick={() => selectTool(navbarItem)}
      >
        {navbarItem.displayName}
      </Button>
    );
  };

  return (
    <div className={isVertical ? classes.verticalToolbar : classes.horizontalToolbar}>
      {navbarItems.map((navbarItem: HudTool, index: number) => (
        <Tooltip key={navbarItem.id} title={navbarItem.displayName} arrow placement="top">
          {renderIconButton(navbarItem)}
        </Tooltip>
      ))}
    </div>
  );
};

export default HudToolbar;
