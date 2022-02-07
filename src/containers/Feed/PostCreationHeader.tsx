import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { push } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import Avatar from 'components/Avatar';
import IconPencil from '../../assets/svg/pencil.svg';
import IconQuestion from '../../assets/svg/smile-green.svg';
import QuestionIcon from '../../assets/svg/ic_ask_a_question.svg';
import FlashcardMark from '../../assets/svg/flashcard-mark.svg';
import ShareNotesIcon from '../../assets/svg/ic_notes.svg';
import ActiveCreatePost from '../../assets/svg/ic_create_a_post.svg';
import IconNote from '../../assets/svg/notes-1.svg';
import IconResource from '../../assets/svg/ic_share_a_resource.svg';
import Tooltip from '../Tooltip/Tooltip';
import { CampaignState } from '../../reducers/campaign';
import { UserState } from '../../reducers/user';
import useHudRoutes from '../../hud/frame/useHudRoutes';
import {
  ASK_A_QUESTION_AREA,
  CREATE_A_POST_AREA,
  FLASHCARDS_AREA,
  SHARE_NOTES_AREA,
  SHARE_RESOURCES_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../../hud/navigationState/hudNavigation';

import useStyles from './styles';

const ICON_SIZE = { width: '36px', height: '36px' };

const POST_BUTTONS = [
  {
    value: 0,
    text: 'Write a Post',
    icon: IconPencil
  },
  {
    value: 1,
    text: 'Ask a Question',
    icon: IconQuestion
  },
  {
    value: 2,
    text: 'Share Notes',
    icon: IconNote
  },
  {
    value: 3,
    text: 'Share a Resource',
    icon: IconResource
  }
];

const HUD_POST_BUTTONS = [
  {
    value: FLASHCARDS_AREA,
    text: 'Flashcards',
    icon: FlashcardMark
  },
  {
    value: CREATE_A_POST_AREA,
    text: 'Write a Post',
    icon: ActiveCreatePost
  },
  {
    value: SHARE_NOTES_AREA,
    text: 'Share Notes',
    icon: ShareNotesIcon
  },
  {
    value: ASK_A_QUESTION_AREA,
    text: 'Ask a Question',
    icon: QuestionIcon
  },
  {
    value: SHARE_RESOURCES_AREA,
    text: 'Share a Resource',
    icon: IconResource
  }
];

const PostCreationHeader = () => {
  const me = useSelector((state: { user: UserState }) => state.user.data);

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  const setHudArea = useHudRoutes();

  const classes: any = useStyles();
  const dispatch = useDispatch();
  const handleGotoPostCreate = useCallback(
    (value = 0) => {
      if (isHud) {
        setHudArea(STUDY_TOOLS_MAIN_AREA, value);
      } else {
        dispatch(push(`/create_post?tab=${value}`));
      }
    },
    [dispatch]
  );

  if (isHud) {
    return (
      <Box className={classes.postHeaderRoot}>
        <Paper className={classes.postHeaderPaper}>
          <div className={classes.hudFeedButtonsContainer}>
            {HUD_POST_BUTTONS.map((item) => (
              <div className={classes.hudFeedButtonGroup} key={item.value}>
                <Button
                  className={classes.postButton}
                  startIcon={<img src={item.icon} alt={item.text} style={ICON_SIZE} />}
                  onClick={() => handleGotoPostCreate(item.value)}
                >
                  {item.text}
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </Box>
    );
  }
  const fullName = `${me.firstName} ${me.lastName}`;

  return (
    <Box className={classes.postHeaderRoot}>
      <Paper className={classes.postHeaderPaper}>
        <Box display="flex" alignItems="center" pb={2}>
          <Box mr={3}>
            <Avatar
              profileImage={me.profileImage}
              fullName={fullName}
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
                onClick={() => handleGotoPostCreate()}
              >
                <Hidden smDown>Create a new post, offer support or share useful links!</Hidden>
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
                startIcon={<img src={item.icon} alt={String(item.value)} />}
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
