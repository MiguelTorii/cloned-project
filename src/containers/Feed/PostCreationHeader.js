import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Avatar from 'components/Avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { getInitials } from 'utils/chat';
import Button from '@material-ui/core/Button';
import IconPencil from 'assets/svg/pencil.svg';
import IconQuestion from 'assets/svg/smile-green.svg';
import IconNote from 'assets/svg/notes-1.svg';
import IconResource from 'assets/svg/links.svg';
import { push } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Tooltip from 'containers/Tooltip/Tooltip';
import useStyles from './styles';

const POST_BUTTONS = [
  {
    value: 0,
    text: 'Write Post',
    icon: IconPencil
  },
  {
    value: 1,
    text: 'Ask a question',
    icon: IconQuestion
  },
  {
    value: 2,
    text: 'Share Notes',
    icon: IconNote
  },
  {
    value: 3,
    text: 'Share a resource',
    icon: IconResource
  }
];

const PostCreationHeader = () => {
  const me = useSelector((state) => state.user.data);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleGotoPostCreate = useCallback(
    (value = 0) => {
      dispatch(push(`/create_post?tab=${value}`));
    },
    [dispatch]
  );

  return (
    <Box className={classes.postHeaderRoot}>
      <Paper className={classes.postHeaderPaper}>
        <Box display="flex" alignItems="center" pb={2}>
          <Box mr={3}>
            <Avatar
              src={me.profileImage}
              initialText={getInitials(`${me.firstName} ${me.lastName}`)}
              mobileSize={50}
              desktopSize={50}
            />
          </Box>
          <Box flexGrow={1}>
            <Tooltip
              id={9090}
              placement="bottom"
              text="Earn points and earn money. A great way to do that is by creating a post."
              okButton="Yay! 🎉"
            >
              <Button
                fullWidth
                className={classes.postAnyButton}
                onClick={handleGotoPostCreate}
              >
                <Hidden smDown>
                  Create a new post, offer support or share useful links!
                </Hidden>
                <Hidden mdUp>Create a new post</Hidden>
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <hr className={classes.divider} />
        <Grid container spacing={3}>
          {POST_BUTTONS.map((item) => (
            <Grid item xs={6} lg={3} key={item.value}>
              <Button
                className={classes.postButton}
                startIcon={<img src={item.icon} alt={item.value} />}
                onClick={() => handleGotoPostCreate(item.value)}
              >
                {item.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

PostCreationHeader.postTypes = {};

export default PostCreationHeader;
