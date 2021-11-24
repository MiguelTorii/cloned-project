import React from 'react';
import { Typography } from '@material-ui/core';
import HudToolbar from './HudToolbar';
import { HudTool } from './HudTool';
import { useStyles } from './HudNavigationStyles';
import { SUPPORT_AREA } from '../navigationState/hudNavigation';
import useHudRoutes from '../frame/useHudRoutes';

type Props = {
  parentNavigationItem: HudTool;
};

const HudToolGroup = ({ parentNavigationItem }: Props) => {
  const classes: any = useStyles();

  const setHudArea = useHudRoutes();

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === SUPPORT_AREA) {
      // Open support window
      window.open('https://tutors.circleinapp.com/home', '_blank');
    } else {
      setHudArea(parentNavigationItem.id, mainSubArea);
    }
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
