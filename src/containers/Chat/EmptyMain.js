// @flow

import React from 'react';
import EmptyMainChat from 'assets/svg/empty_main_chat.svg';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExpertEmptyChat from 'assets/svg/expertEmptyChat.svg';
import { makeStyles } from '@material-ui/core/styles';
import LoadImg from 'components/LoadImg/LoadImg';
import EmptyUnregistered from 'assets/svg/emptyChatUnregistered.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  messageContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  titleMessage: {
    marginBottom: theme.spacing(2),
    fontSize: 26,
    color: theme.circleIn.palette.primaryText1,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  subtitleMessage: {
    fontSize: 18,
    color: theme.circleIn.palette.primaryText2,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  expertTitle: {
    fontSize: 24,
    fontWeight: 400
  },
  expertContainerText: {
    margin: theme.spacing(2, 0)
  },
  unregisterContainer: {
    height: '100%',
    margin: theme.spacing(0, 2)
  },
  expertContainer: {
    height: '100%'
  }
}));

type Props = {
  noChannel: boolean
};

const imageStyle = { maxWidth: '100%' };

const EmptyMain = ({ newChannel, otherUser, noChannel, expertMode }: Props) => {
  const classes = useStyles();

  if (otherUser && !otherUser.registered && !newChannel) {
    return (
      <Box
        justifyContent="center"
        className={classes.unregisterContainer}
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Typography
          classes={{
            root: classes.titleMessage
          }}
        >
          Hey!{' '}
          <span role="img" aria-label="wave">
            👋
          </span>{' '}
          {
            "We're so happy you're here! This classmate isn't on CircleIn yet but you can still send them a chat. They will receive an email to let them know you messaged them!"
          }
        </Typography>
        <LoadImg url={EmptyUnregistered} />
      </Box>
    );
  }

  if (expertMode) {
    return (
      <Box
        justifyContent="center"
        className={classes.expertContainer}
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Box className={classes.expertContainerText}>
          <Box justifyContent="center" alignItems="center" display="flex" flexDirection="column">
            <Typography className={classes.expertTitle}>
              Hey!{' '}
              <span role="img" aria-label="wave">
                👋
              </span>{' '}
              We’re so happy you’re here!
            </Typography>
            <Typography className={classes.expertTitle}>
              We bet your students are too, introduce yourself
            </Typography>
            <Typography className={classes.expertTitle}>
              by sending a message to all of your classes!
            </Typography>
          </Box>
        </Box>
        <LoadImg url={ExpertEmptyChat} />
      </Box>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.messageContainer}>
        <LoadImg url={EmptyMainChat} alt="emptychat" style={imageStyle} />
        <Typography
          classes={{
            root: classes.titleMessage
          }}
        >
          {!noChannel ? 'Time to send a message!' : 'Set up a group class chat'}
        </Typography>
        {noChannel && (
          <Typography
            classes={{
              root: classes.subtitleMessage
            }}
          >
            Or just chat with a classmate about an issue
          </Typography>
        )}
      </div>
    </div>
  );
};

export default EmptyMain;
