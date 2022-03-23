import React from 'react';

import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import Workflow from 'containers/Workflow/Workflow';

import { useStyles } from './CalendarSubAreaStyles';

const CalendarSubArea = () => {
  const classes: any = useStyles();
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend as any}>
      <Workflow />
    </DndProvider>
  );
};

export default CalendarSubArea;
