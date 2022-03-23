import React, { memo, useMemo, useState, useEffect } from 'react';

import cx from 'classnames';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import { useStyles } from '../_styles/Workflow/WorkflowBoardCard';

const getHeight = (text) => {
  const el = document.createElement('div');
  el.style.cssText =
    'line-height: 1.5em;width: 213px;font-size: 1rem;font-weight: bold;word-break: break-word;';
  el.textContent = text;
  el.style.visibility = '';
  document.body.appendChild(el);
  const height = el.clientHeight;
  el.remove();
  return height;
};

type Props = {
  onOpen?: any;
  newInput?: any;
  handleNew;
  closeNew?: any;
  title?: any;
  date?: any;
  selectedClass?: any;
  openConfirmArchive?: any;
  hasNotification?: any;
  showDetails?: any;
};

const WorkflowBoardCard = ({
  onOpen,
  newInput,
  handleNew,
  closeNew,
  title,
  date,
  selectedClass,
  openConfirmArchive,
  hasNotification,
  showDetails
}: Props) => {
  const classes: any = useStyles();
  const [clampTitle, setClampTitle] = useState(title);
  const [lineStyle, setLineStyle] = useState(classes.oneLine);
  useEffect(() => {
    if (title) {
      setClampTitle(title);
      const titleHeight = getHeight(title);

      if (titleHeight <= 25) {
        setLineStyle(classes.oneLine);
      }

      if (titleHeight <= 50 && titleHeight > 25) {
        setLineStyle(classes.twoLines);
      }

      if (titleHeight > 50) {
        setLineStyle(classes.threeLines);
      }
    }
  }, [title, classes]);
  const dateSize = useMemo(() => (selectedClass ? 3 : 8), [selectedClass]);
  return (
    <Paper
      className={cx(classes.root, showDetails && classes.hover)}
      elevation={0}
      onClick={onOpen}
    >
      <Grid container className={classes.container} direction="row">
        <Grid item xs={12}>
          {newInput || (
            <Typography variant="body1" className={cx(classes.title, lineStyle)}>
              {clampTitle}
            </Typography>
          )}
          {hasNotification && <NotificationsActiveIcon className={classes.bell} />}
        </Grid>
        <Grid container alignContent="flex-end" alignItems="center" className={classes.bottom}>
          {selectedClass && (
            <Grid item xs={5}>
              <Chip
                label={selectedClass.className}
                size="small"
                style={{
                  backgroundColor: selectedClass.bgColor
                }}
                className={cx(classes.chip, classes.ellipsis)}
              />
            </Grid>
          )}
          <Grid item xs={dateSize}>
            <Typography variant="caption" className={classes.date}>
              {date}
            </Typography>
          </Grid>
          {showDetails && (
            <Grid item xs={4}>
              <Button className={classes.detailsButton} onClick={onOpen}>
                Details
              </Button>
              <IconButton onClick={openConfirmArchive} className={classes.iconButton}>
                <DeleteIcon className={cx(classes.icon, 'workflow-task-delete-button')} />
              </IconButton>
            </Grid>
          )}
          {newInput && (
            <Grid item xs={12} className={classes.buttons}>
              <Button
                className={cx(classes.newButton, 'add-workflow-button')}
                onClick={handleNew}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
              <Button className={classes.newButton} onClick={closeNew}>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default memo(WorkflowBoardCard) as any;
