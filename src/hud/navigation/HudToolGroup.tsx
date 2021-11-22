import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { Typography } from '@material-ui/core';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { setSelectedMainSubArea } from '../navigationState/hudNavigationActions';
import { HudTool } from './HudTool';
import { useStyles } from './HudNavigationStyles';

type Props = {
  parentNavigationItem: HudTool;
};

const HudToolGroup = ({ parentNavigationItem }: Props) => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectLeaf = (mainSubArea: string) => {
    dispatch(setSelectedMainSubArea(parentNavigationItem.id, mainSubArea));
  };
  return (
    <div className={classes.controlPanelMainSectionGroup}>
      <HudToolbar onSelectItem={selectLeaf} navbarItems={parentNavigationItem.childTools} />
      <div className={classes.controlPanelLabel}>
        <Typography variant="overline">{parentNavigationItem.displayName}</Typography>
      </div>
    </div>
  );
};

export default HudToolGroup;
