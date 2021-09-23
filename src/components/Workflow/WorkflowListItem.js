import React, { memo, useMemo } from 'react';
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Chip from '@material-ui/core/Chip';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../_styles/Workflow/WorkflowListItem';

const getTitle = (downMd, downSm, downXs, title) => {
  if (downXs) return title;
  if (downSm) return title.substr(0, 45);
  if (downMd) return title.substr(0, 75);
  return title;
};

const getStyles = (hide) => ({
    opacity: hide ? 0 : 1,
    height: hide ? 0 : ''
  });

const noOp = () => {};

const WorkflowListItem = ({
  task,
  classList = [],
  openConfirmArchive = noOp,
  onOpen = noOp,
  showDetails = false,
  isDragging = false
  // handleComplete,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const downXs = useMediaQuery(theme.breakpoints.down('xs'));
  const date = useMemo(() => {
    if (task.date) {
      if (typeof task.date.getMonth === 'function') {
        return moment(task.date).format('MMM D');
      }
      return moment(`${task.date.replace(' ', 'T')}Z`).format('MMM D');
    }
    return '';
  }, [task.date]);

  const title = getTitle(downMd, downSm, downXs, task.title);
  const renderTask = useMemo(() => {
    const selected = classList[task.sectionId];

    return (
      <Grid container alignItems="center">
        <Grid container direction="row" item xs={7}>
          <Grid item className={classes.titleContainer} xs={8}>
            <Typography className={classes.taskTitle}>{title}</Typography>
          </Grid>
          <Grid item style={getStyles(isDragging || !showDetails)} xs={4}>
            <Button className={classes.detailsButton} onClick={onOpen}>
              Details
            </Button>
            <IconButton
              onClick={openConfirmArchive}
              className={classes.iconButton}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={2} md={2} className={classes.itemDetails}>
          {task.date && (
            <Typography
              variant="caption"
              className={classes.dateText}
              display="block"
              gutterBottom
            >
              {date}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3} md={3} className={classes.itemDetails}>
          {selected && (
            <Chip
              label={selected.className}
              size="small"
              style={{ backgroundColor: selected.bgColor }}
              className={cx(classes.chip, classes.ellipsis)}
            />
          )}
        </Grid>
      </Grid>
    );
  }, [
    classList,
    task.sectionId,
    task.date,
    classes.titleContainer,
    classes.taskTitle,
    classes.detailsButton,
    classes.iconButton,
    classes.itemDetails,
    classes.dateText,
    classes.chip,
    classes.ellipsis,
    title,
    isDragging,
    showDetails,
    onOpen,
    openConfirmArchive,
    date
  ]);

  return useMemo(
    () => (
      <ListItem className={classes.item} selected={showDetails} dense>
        <div className={classes.dragContainer}>
          <DragIndicatorIcon
            className={classes.dragIcon}
            style={getStyles(isDragging || !showDetails)}
          />
        </div>
        {/* <ListItemIcon> */}
        {/* <IconButton onClick={handleComplete} className={classes.iconButton}> */}
        {/* {task.status === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />} */}
        {/* </IconButton> */}
        {/* </ListItemIcon> */}
        <ListItemText primary={renderTask} onClick={onOpen} />
      </ListItem>
    ),
    [
      classes.dragContainer,
      classes.dragIcon,
      classes.item,
      isDragging,
      onOpen,
      renderTask,
      showDetails
    ]
  );
};

export default memo(WorkflowListItem);
