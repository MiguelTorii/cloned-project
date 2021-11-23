import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { HudTool } from './HudTool';
import { useStyles } from './HudToolbarStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';

type Props = {
  navbarItems: HudTool[];
  onSelectItem: (navbarItemId: string) => void;
  isVertical?: boolean;
};

const HudToolbar = ({ navbarItems, onSelectItem, isVertical }: Props) => {
  const classes: any = useStyles();

  const [selectedTool, setSelectedTool] = useState<HudTool>(navbarItems[0]);

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubAreas: Record<string, string> = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainSubAreas
  );

  const selectTool = (tool: HudTool) => {
    setSelectedTool(tool);
    onSelectItem(tool.id);
  };

  const renderIconButton = (navbarItem: HudTool) => {
    const isActive = navbarItem.id === selectedMainSubAreas[selectedMainArea];

    if (navbarItem.icon) {
      return (
        <Button
          color={navbarItem === selectedTool ? 'primary' : 'default'}
          className={clsx(classes.toolButton, isActive && classes.selectedButton)}
          size="medium"
          onClick={() => selectTool(navbarItem)}
        >
          {navbarItem.icon}
        </Button>
      );
    }
    if (navbarItem.iconText) {
      return (
        <Button
          color={'secondary'}
          className={clsx(classes.toolButton, isActive && classes.selectedButton)}
          size="medium"
          onClick={() => selectTool(navbarItem)}
        >
          {navbarItem.iconText}
        </Button>
      );
    }
    return (
      <Button
        key={navbarItem.id}
        color={navbarItem === selectedTool ? 'primary' : 'default'}
        className={clsx(classes.textIconButton, isActive && classes.selectedButton)}
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
