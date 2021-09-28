import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cx from 'classnames';
import { useStyles } from '../_styles/Workflow/WorkflowListBox';

type Props = {
  drop?: any;
  name?: any;
  tasks?: any;
  list?: any;
  isExpanded?: any;
  onExpand?: any;
};

const WorkflowListBox = ({ drop, name, tasks, list, isExpanded, onExpand }: Props) => {
  const classes: any = useStyles();
  return (
    <Accordion
      ref={drop}
      elevation={0}
      className={cx(classes.panel)}
      expanded={isExpanded}
      onChange={onExpand}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
        <Typography className={classes.header}>
          {name} ({tasks.length})
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>{list}</AccordionDetails>
    </Accordion>
  );
};

export default WorkflowListBox;
