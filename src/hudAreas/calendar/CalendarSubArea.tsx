import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Workflow from '../../containers/Workflow/Workflow';
import { useStyles } from '../studyTools/StudyToolsAreaStyles';

const CalendarSubArea = () => {
  const classes: any = useStyles();
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <div className={classes.container}>
      <DndProvider backend={backend as any}>
        <Workflow />
      </DndProvider>
    </div>
  );
};

export default CalendarSubArea;
