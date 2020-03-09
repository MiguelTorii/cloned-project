import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LeaveClassPopover from 'containers/ClassesGrid/LeaveClassPopover'

type Props = {
  sectionDisplayName: string,
  instructorDisplayName: string,
  handleLeaveClass: Function,
  courseDisplayName: string,
  canLeave: boolean,
  bgColor: string,
  navigate: Function,
}

const ClassCard = ({
  sectionDisplayName,
  instructorDisplayName,
  courseDisplayName,
  handleLeaveClass,
  navigate,
  canLeave,
  bgColor
}: Props) => {
  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      cursor: 'pointer',
      minHeight: 180,
      borderRadius: theme.spacing(),
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: bgColor || theme.circleIn.palette.action, 
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    circle: {
      width: 95,
      height: 95,
      borderRadius: '50%',
      position: 'absolute',
      bottom: -25,
      right: -15,
      zIndex: 0,
      fontSize:20,
      color:'#fff',
      lineHeight:100,
      textAlign:'center',
      opacity: 0.2,
      background: '#FFF'
    },
    avatar: {
      backgroundColor: red[500],
    },
    title: {
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: 16
    },
    content: {
      cursor: 'pointer'
    }
  }));
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null)
  
  const handleClickIcon = event => {
    event.stopPropagation()
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleClose = event => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <Card 
      className={classes.root}
      onClick={navigate}
    >
      <div className={classes.circle} />
      <LeaveClassPopover 
        anchorEl={anchorEl}
        handleClose={handleClose}
        leaveClass={handleLeaveClass}
      />
      <CardHeader
        action={
          canLeave && <IconButton onClick={handleClickIcon} aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography
            className={classes.title}
          >
            {courseDisplayName}
          </Typography>
        }
      />
      <CardContent 
        className={classes.content}
      >
        <Typography>
          {sectionDisplayName}
        </Typography>
        <Typography>
          {instructorDisplayName}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ClassCard
