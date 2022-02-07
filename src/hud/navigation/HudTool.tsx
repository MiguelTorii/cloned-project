import React, { MouseEvent } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useStyles as useHighlightedButtonStyles } from 'styles/HighlightedButton';
import { HudToolData } from './HudToolData';
import { HudNavigationState } from '../navigationState/hudNavigationState';

import { useStyles } from './HudToolbarStyles';

type Props = {
  navbarItem: HudToolData;
  onSelectItem: (navbarItemId: string, event?: MouseEvent) => void;
  isSelected: boolean;
  isCompact?: boolean;
};

const HudTool = ({ navbarItem, onSelectItem, isSelected, isCompact }: Props) => {
  const classes: any = useStyles();
  const highlightedButton = useHighlightedButtonStyles();

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  const isHighlighted = highlightedNavigation && navbarItem.id === highlightedNavigation.leafAreaId;

  const renderIconButton = () => {
    if (navbarItem.icon) {
      return (
        <Button
          className={clsx(
            classes.toolButton,
            isSelected && classes.selectedButton,
            isCompact && classes.toolButtonCompact,
            isHighlighted && highlightedButton.animated
          )}
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
          className={clsx(
            classes.toolButton,
            isSelected && classes.selectedButton,
            isCompact && classes.toolButtonCompact,
            isHighlighted && highlightedButton.animated
          )}
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
        className={clsx(
          classes.textIconButton,
          isSelected && classes.selectedButton,
          isCompact && classes.toolButtonCompact,
          isHighlighted && highlightedButton.animated
        )}
        onClick={(e) => onSelectItem(navbarItem.id, e)}
      >
        {navbarItem.displayName}
      </Button>
    );
  };

  return (
    <Tooltip
      classes={{
        tooltip: classes.tooltip
      }}
      key={navbarItem.id}
      title={navbarItem.displayName}
      arrow
      placement="top"
    >
      {renderIconButton()}
    </Tooltip>
  );
};

export default HudTool;
