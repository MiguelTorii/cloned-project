import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import withRoot from '../../withRoot';
import Workflow from '../../containers/Workflow/Workflow';

type Props = {
  classes: Record<string, any>;
};

const CalendarHudItem = ({ classes }: Props) => {
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <div className={classes.container}>
      <DndProvider backend={backend as any}>
        <Workflow />
      </DndProvider>
    </div>
  );
};

export default withRoot(CalendarHudItem);
