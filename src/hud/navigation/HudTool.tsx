import React, { MouseEvent } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { HudToolData } from './HudToolData';
import { useStyles } from './HudToolbarStyles';

type Props = {
  navbarItem: HudToolData;
  onSelectItem: (navbarItemId: string, event?: MouseEvent) => void;
  isSelected: boolean;
};

const HudTool = ({ navbarItem, onSelectItem, isSelected }: Props) => {
  const classes: any = useStyles();

  const renderIconButton = () => {
    if (navbarItem.icon) {
      return (
        <Button
          className={clsx(classes.toolButton, isSelected && classes.selectedButton)}
          size="medium"
          onClick={(e) => onSelectItem(navbarItem.id, e)}
        >
          {navbarItem.icon}
        </Button>
      );
    }
    if (navbarItem.iconText) {
      return (
        <Button
          color={'secondary'}
          className={clsx(classes.toolButton, isSelected && classes.selectedButton)}
          size="medium"
          onClick={(e) => onSelectItem(navbarItem.id, e)}
        >
          {navbarItem.iconText}
        </Button>
      );
    }
    return (
      <Button
        key={navbarItem.id}
        className={clsx(classes.textIconButton, isSelected && classes.selectedButton)}
        onClick={(e) => onSelectItem(navbarItem.id, e)}
      >
        {navbarItem.displayName}
      </Button>
    );
  };

  return (
    <Tooltip key={navbarItem.id} title={navbarItem.displayName} arrow placement="top">
      {renderIconButton()}
    </Tooltip>
  );
};

export default HudTool;
