import React, { useState } from 'react';

import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import LeaveClassPopover from './LeaveClassPopover';

type Props = {
  sectionDisplayName: string;
  instructorDisplayName: string;
  startDate: string;
  handleLeaveClass: (...args: Array<any>) => any;
  courseDisplayName: string;
  canLeave: boolean;
  bgColor: string;
  navigate: (...args: Array<any>) => any;
  isCurrent: boolean;
  isUpcoming: boolean;
};

const ClassCard = ({
  sectionDisplayName,
  instructorDisplayName,
  courseDisplayName,
  startDate,
  handleLeaveClass,
  navigate,
  canLeave,
  bgColor,
  isCurrent,
  isUpcoming
}: Props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      cursor: 'pointer',
      minHeight: 168,
      borderRadius: theme.spacing(),
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: theme.circleIn.palette.appBar,
      borderTop: `${theme.spacing(2.5)}px solid ${
        isCurrent ? bgColor : theme.circleIn.palette.gray3
      }`
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    },
    circle: {
      width: 95,
      height: 95,
      borderRadius: '50%',
      position: 'absolute',
      bottom: -25,
      right: -15,
      zIndex: 0,
      fontSize: 20,
      color: '#fff',
      lineHeight: 100,
      textAlign: 'center',
      opacity: 0.2,
      background: '#FFF'
    },
    avatar: {
      backgroundColor: red[500]
    },
    title: {
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: 16
    },
    content: {
      color: theme.circleIn.palette.primaryText2,
      cursor: 'pointer'
    }
  }));
  const classes: any = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const convertDate = (startDate) => {
    if (startDate) {
      return moment(startDate, 'YYYY-MM-DD hh:mm:ss').format('M/DD/YY');
    }
  };

  return (
    <Card className={classes.root} onClick={navigate}>
      <LeaveClassPopover
        anchorEl={anchorEl}
        handleClose={handleClose}
        leaveClass={handleLeaveClass}
      />
      <CardHeader title={<Typography className={classes.title}>{courseDisplayName}</Typography>} />
      <CardContent className={classes.content}>
        <Typography>{sectionDisplayName}</Typography>
        <Typography>{instructorDisplayName}</Typography>
        {isUpcoming && <Typography>Available on: {convertDate(startDate)}</Typography>}
      </CardContent>
    </Card>
  );
};

export default ClassCard;
