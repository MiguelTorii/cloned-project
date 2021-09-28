import React, { useCallback, useState, useRef } from 'react';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Draggable } from '@fullcalendar/interaction';
import { useStyles } from '../_styles/Workflow/CalendarEmptyDateTasks';

const CalendarEmptyDateTasks = ({ tasksEmptyDate, onOpenEdit }) => {
  const classes: any = useStyles();
  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const onOpen = useCallback(() => setAnchorEl(anchorEl ? null : buttonRef.current), [anchorEl]);
  const onDrag = useCallback((ref) => {
    if (ref) {
      // eslint-disable-next-line
      new Draggable(ref, {
        itemSelector: '#draggable'
      });
    }
  }, []);
  const onClickCard = useCallback(
    (index) => () => {
      onOpenEdit({
        event: {
          extendedProps: {
            index
          }
        }
      });
    },
    [onOpenEdit]
  );
  return (
    <div>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="right-end" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
            <Paper className={classes.popper}>
              <div className={classes.innerPopper}>
                {tasksEmptyDate.map((t) => (
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => {}}
                    style={{
                      backgroundColor: t.backgroundColor
                    }}
                    key={`emptyDate${t.index}`}
                    ref={onDrag}
                    id="draggable"
                    onClick={onClickCard(t.index)}
                    className={classes.card}
                    data-event={JSON.stringify(t)}
                  >
                    <DragIndicatorIcon className={classes.dragIcon} />
                    <div className={classes.title}>{t.title}</div>
                  </div>
                ))}
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Tooltip
        title="Empty Due Date Tasks"
        aria-label="Empty Due Date Tasks"
        placement="top"
        classes={{
          tooltip: classes.tooltip
        }}
        arrow
      >
        <IconButton
          aria-label="insert task"
          ref={buttonRef}
          className={classes.iconInsert}
          onClick={onOpen}
        >
          <InsertInvitationIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CalendarEmptyDateTasks;
