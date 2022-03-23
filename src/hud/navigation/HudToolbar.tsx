import React, { useState } from 'react';

import clsx from 'clsx';
import { useSelector } from 'react-redux';

import { Button, IconButton, Tooltip } from '@material-ui/core';

import HudTool from './HudTool';
import { useStyles } from './HudToolbarStyles';

import type { HudNavigationState } from '../navigationState/hudNavigationState';
import type { HudToolData } from './HudToolData';

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
          isCompact
        />
      ))}
    </div>
  );
};

export default HudToolbar;
