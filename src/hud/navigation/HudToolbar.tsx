import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { HudToolData } from './HudToolData';
import { useStyles } from './HudToolbarStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import HudTool from './HudTool';

type Props = {
  navbarItems: HudToolData[];
  onSelectItem: (navbarItemId: string) => void;
  isVertical?: boolean;
};

const HudToolbar = ({ navbarItems, onSelectItem, isVertical }: Props) => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubAreas: Record<string, string> = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainSubAreas
  );

  const selectTool = (tool: HudToolData) => {
    onSelectItem(tool.id);
  };

  return (
    <div className={isVertical ? classes.verticalToolbar : classes.horizontalToolbar}>
      {navbarItems.map((navbarItem: HudToolData) => (
        <HudTool
          key={navbarItem.id}
          navbarItem={navbarItem}
          onSelectItem={() => selectTool(navbarItem)}
          isSelected={navbarItem.id === selectedMainSubAreas[selectedMainArea]}
        />
      ))}
    </div>
  );
};

export default HudToolbar;
