import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withWidth from '@material-ui/core/withWidth'
import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
// import ListSubheader from '@material-ui/core/ListSubheader';
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  fullname: {
    color: theme.circleIn.palette.primaryText1
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  messageMargin: {
    marginRight: theme.spacing()
  }
}));

type ClassmateType = {
  userId: string,
  firstName: string,
  lastName: string,
  image: string
}

type Props = {
  classmate: ClassmateType,
  width: string
}

const Classmate = ({ width, classmate }: Props) => {
  const classes = useStyles();

  return (
    <ListItem className={clsx(width === 'xs' && classes.buttons)}>
      <ListItemAvatar>
        <Avatar
          alt={`Avatar n°${classmate.userId}`}
          src={classmate.image}
        />
      </ListItemAvatar>
      <ListItemText
        classes={{
          primary: classes.fullname
        }}
        primary={`${classmate.firstName} ${classmate.lastName}`}
      />
      {/* <ListSubheader disableGutters> */}
      {/* <Button */}
      {/* className={classes.messageMargin} */}
      {/* variant="outlined" */}
      {/* color="primary" */}
      {/* > */}
      {/* Send Message */}
      {/* </Button> */}
      {/* <Button variant="outlined" color="primary">Start Video</Button> */}
      {/* </ListSubheader> */}
    </ListItem>
  );
}

export default withWidth()(Classmate)