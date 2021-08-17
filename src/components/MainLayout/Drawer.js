// @flow
import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
  Fragment
} from 'react';
import classNames from 'classnames';
import queryString from 'query-string';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import HomeItem from 'components/MainLayout/HomeItem';
import ClassList from 'components/ClassList';
import CustomSwitch from 'components/MainLayout/Switch';
import Tooltip from 'containers/Tooltip';
import { getCampaign } from 'api/campaign';

import Avatar from '@material-ui/core/Avatar';
import { ReactComponent as ClassFeedIconOff } from 'assets/svg/class-feed-icon-off.svg';
import { ReactComponent as ClassFeedIconOn } from 'assets/svg/class-feed-icon-on.svg';
import { ReactComponent as ChatIconOn } from 'assets/svg/chat-icon-on.svg';
import { ReactComponent as ChatIconOff } from 'assets/svg/chat-icon-off.svg';
import { ReactComponent as FeedbackIconOff } from 'assets/svg/feedback-icon-off.svg';
import { ReactComponent as FeedbackIconOn } from 'assets/svg/feedback-icon-on.svg';
import { ReactComponent as FlashcardsIconOff } from 'assets/svg/flashcards-icon-off.svg';
import FlashcardsIconOn from 'assets/img/flashcards-icon-on.png';
import { ReactComponent as GetAppIconOff } from 'assets/svg/get-app-icon-off.svg';
import { ReactComponent as GetAppIconOn } from 'assets/svg/get-app-icon-on.svg';
import { ReactComponent as HelpIcon } from 'assets/svg/help-icon.svg';
import { ReactComponent as LeaderboardIconOff } from 'assets/svg/leaderboard-icon-off.svg';
import { ReactComponent as LeaderboardIconOn } from 'assets/svg/leaderboard-icon-on.svg';
import { ReactComponent as NotesIconOff } from 'assets/svg/notes-icon-off.svg';
import { ReactComponent as NotesIconOn } from 'assets/svg/notes-icon-on.svg';
import { ReactComponent as RewardsIconOff } from 'assets/svg/rewards-icon-off.svg';
import { ReactComponent as RewardsIconOn } from 'assets/svg/rewards-icon-on.svg';
import { ReactComponent as WorkflowIconOff } from 'assets/svg/workflow-icon-off.svg';
import { ReactComponent as WorkflowIconOn } from 'assets/svg/workflow-icon-on.svg';
import { ReactComponent as OneTouchSendIconOn } from 'assets/svg/one-touch-send-icon-on.svg';
import { ReactComponent as OneTouchSendIconOff } from 'assets/svg/one-touch-send-icon-off.svg';
import { ReactComponent as GradCapIcon } from 'assets/svg/ic_grad_cap.svg';
import { ReactComponent as MyClassOff } from 'assets/svg/myclass-inactive.svg';
import { ReactComponent as MyClassOn } from 'assets/svg/myclass-active.svg';
import { ReactComponent as HomeIconOn } from 'assets/svg/home-active.svg';
import { ReactComponent as HomeIconOff } from 'assets/svg/home-inactive.svg';
import { ReactComponent as OffStudyRoom } from 'assets/svg/inactive-study-room.svg';
import { ReactComponent as OnStudyRoom } from 'assets/svg/active-study-room.svg';
import DrawerItem from 'components/MainLayout/DrawerItem';

import { useStyles } from '../_styles/MainLayout/Drawer';

const Drawer = ({
  newClassExperience,
  newNotesScreen,
  handleOpenGetApp,
  handleOpenFeedback,
  MyLink,
  search,
  pathname,
  handleManageClasses,
  appBarHeight,
  setOneTouchSend,
  landingPageCampaign,
  expertMode,
  isExpert,
  toggleExpertMode,
  userId,
  fullName,
  userProfileUrl,
  initials
}) => {
  const classes = useStyles();
  const [campaign, setCampaign] = useState(null);

  const handleOpenOneTouchSend = useCallback(
    () => setOneTouchSend(true),
    [setOneTouchSend]
  );

  useEffect(() => {
    const init = async () => {
      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);
    };

    init();
  }, []);

  const visiabled = useMemo(
    () => campaign?.variation_key && campaign?.variation_key !== 'hidden',
    [campaign]
  );

  const handleOpenTutorHelp = useCallback(() => {
    window.open('https://tutors.circleinapp.com/home', '_blank');
  }, []);

  const qs = useMemo(() => queryString.parse(search), [search]);

  const button = useMemo(
    () => (
      <FormControlLabel
        control={
          <CustomSwitch
            checked={expertMode}
            onChange={toggleExpertMode}
            name="expert-mode"
          />
        }
      />
    ),
    [expertMode, toggleExpertMode]
  );

  const createNewPost = useMemo(
    () => (
      <ListItem
        button
        component={MyLink}
        className={`${classes.newItem} tour-onboarding-new`}
        link="/create_post"
      >
        <ListItemIcon className={classes.newIconContainer}>
          <AddIcon className={classes.newIcon} />
        </ListItemIcon>
        <ListItemText
          primary="Create New Post"
          classes={{
            root: classes.newRoot,
            primary: classes.newLabel
          }}
          primaryTypographyProps={{
            color: pathname.includes('/create') ? 'primary' : 'textPrimary'
          }}
        />
      </ListItem>
      // </Tooltip>
    ),
    [
      MyLink,
      classes.newIcon,
      classes.newIconContainer,
      classes.newItem,
      classes.newLabel,
      classes.newRoot,
      pathname
    ]
  );

  const renderExpertMenu = useCallback(
    () => (
      <>
        <DrawerItem
          OnIcon={<ChatIconOn />}
          primaryText="Chats"
          pathname={pathname}
          component={MyLink}
          link="/chat"
          OffIcon={<ChatIconOff />}
          listItemClass={classes.otherPath}
        />
        {landingPageCampaign && (
          <DrawerItem
            listItemClass={classNames(
              ['/feed', '/'].includes(pathname)
                ? classes.currentPath
                : classes.otherPath
            )}
            link="/"
            pathname={pathname}
            OnIcon={<ClassFeedIconOn />}
            primaryText="Class Feed"
            component={MyLink}
            OffIcon={<ClassFeedIconOff />}
          />
        )}
        <ListItem
          button
          component={MyLink}
          link={`/my_posts?${queryString.stringify({ ...qs, from: 'me' })}`}
          className={classNames(
            classes.item,
            ['/my_posts'].includes(pathname) && qs.from === 'me'
              ? classes.currentPath
              : classes.otherPath
          )}
        >
          <ListItemText
            primary="My Posts"
            classes={{
              primary: classes.label
            }}
          />
        </ListItem>
        <ListItem
          button
          component={MyLink}
          link={`/bookmarks?${queryString.stringify({
            ...qs,
            from: 'bookmarks'
          })}`}
          className={classNames(
            classes.item,
            ['/bookmarks'].includes(pathname) && qs.from === 'bookmarks'
              ? classes.currentPath
              : classes.otherPath
          )}
        >
          <ListItemText
            primary="Bookmarks"
            classes={{
              primary: classes.label
            }}
          />
        </ListItem>
        <DrawerItem
          OnIcon={<MyClassOn />}
          primaryText="My Classes"
          pathname={pathname}
          component={MyLink}
          link="/classes"
          OffIcon={<MyClassOff />}
          listItemClass={classNames(
            ['/classes'].includes(pathname)
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        {landingPageCampaign && (
          <DrawerItem
            OnIcon={<WorkflowIconOn />}
            primaryText="Workflow"
            pathname={pathname}
            component={MyLink}
            link="/workflow"
            OffIcon={<WorkflowIconOff />}
            listItemClass={classNames(
              ['/workflow'].includes(pathname)
                ? classes.currentPath
                : classes.otherPath
            )}
          />
        )}
        {newNotesScreen && (
          <DrawerItem
            OnIcon={<NotesIconOn />}
            primaryText="Notes"
            pathname={pathname}
            component={MyLink}
            link="/notes"
            OffIcon={<NotesIconOff />}
            listItemClass={classNames(
              ['/notes'].includes(pathname)
                ? classes.currentPath
                : classes.otherPath
            )}
          />
        )}
        <DrawerItem
          OnIcon={
            <img
              src={FlashcardsIconOn}
              alt="flashcards on"
              className={classes.flashcardIconOn}
            />
          }
          primaryText="Flashcards"
          pathname={pathname}
          component={MyLink}
          link={`/flashcards${search}`}
          OffIcon={<FlashcardsIconOff />}
          listItemClass={classNames(
            pathname.includes('/flashcards')
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        {!newClassExperience && (
          <div className={classes.myClasses}>
            <ListItemIcon className={classes.menuIcon}>
              <GradCapIcon className={classNames('whiteSvg')} />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </div>
        )}
        {!newClassExperience && (
          <ListItemText>
            <ClassList onClick={handleManageClasses} />
          </ListItemText>
        )}
        <DrawerItem
          OnIcon={<OneTouchSendIconOn />}
          primaryText="One-Touch Send"
          component={MyLink}
          link="/chat"
          OffIcon={<OneTouchSendIconOff />}
          listItemClass={classes.otherPath}
          onClick={handleOpenOneTouchSend}
        />
        <div className={classes.divider} />
        <ListItem
          button
          onClick={handleOpenTutorHelp}
          className={classes.otherPath}
        >
          <ListItemIcon className={classes.menuIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Support Center" />
        </ListItem>
        <DrawerItem
          onClick={handleOpenFeedback}
          listItemClass={classes.lastItem}
          OnIcon={<FeedbackIconOn />}
          primaryText="Give Feedback"
          OffIcon={<FeedbackIconOff />}
        />
      </>
    ),
    [
      MyLink,
      landingPageCampaign,
      pathname,
      newClassExperience,
      classes,
      newNotesScreen,
      qs,
      handleManageClasses
    ]
  );

  const renderStudentMenu = useCallback(
    () => (
      <>
        <DrawerItem
          listItemClass={classNames(
            ['/'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
          link="/"
          pathname={pathname}
          OnIcon={<HomeIconOn />}
          primaryText="Home"
          component={MyLink}
          OffIcon={<HomeIconOff />}
        />
        <DrawerItem
          OnIcon={<ChatIconOn />}
          primaryText="Chats"
          pathname={pathname}
          component={MyLink}
          link="/chat"
          OffIcon={<ChatIconOff />}
          listItemClass={classes.otherPath}
        />
        <HomeItem MyLink={MyLink} newClassExperience={newClassExperience} />
        <DrawerItem
          OnIcon={
            <img
              src={FlashcardsIconOn}
              alt="flashcards on"
              className={classes.flashcardIconOn}
            />
          }
          primaryText="Flashcards"
          pathname={pathname}
          component={MyLink}
          link={`/flashcards${search}`}
          OffIcon={<FlashcardsIconOff />}
          listItemClass={classNames(
            pathname.includes('/flashcards')
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        {visiabled && (
          <Tooltip
            id={9059}
            placement="right"
            text="Pssst! You can start video chatting from the left navigation! 😍"
            okButton="Nice!"
          >
            <DrawerItem
              onClick={handleOpenGetApp}
              listItemClass={classes.otherPath}
              OnIcon={<OnStudyRoom />}
              component={MyLink}
              link="/video-call"
              primaryText="Study Room"
              OffIcon={<OffStudyRoom />}
            />
          </Tooltip>
        )}
        <DrawerItem
          OnIcon={<WorkflowIconOn />}
          primaryText="Workflow"
          pathname={pathname}
          component={MyLink}
          link="/workflow"
          OffIcon={<WorkflowIconOff />}
          listItemClass={classNames(
            ['/workflow'].includes(pathname)
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        {newNotesScreen && (
          <DrawerItem
            OnIcon={<NotesIconOn />}
            primaryText="Notes"
            pathname={pathname}
            component={MyLink}
            link="/notes"
            OffIcon={<NotesIconOff />}
            listItemClass={classNames(
              ['/notes'].includes(pathname)
                ? classes.currentPath
                : classes.otherPath
            )}
          />
        )}
        <DrawerItem
          OnIcon={<LeaderboardIconOn />}
          primaryText="Leaderboard"
          pathname={!qs.class && pathname}
          component={MyLink}
          link="/leaderboard"
          OffIcon={<LeaderboardIconOff />}
          listItemClass={
            !qs.class && ['/leaderboard'].includes(pathname)
              ? classes.currentPath
              : classes.otherPath
          }
        />
        <DrawerItem
          OnIcon={<RewardsIconOn />}
          primaryText="Rewards Store"
          pathname={pathname}
          component={MyLink}
          link="/store"
          OffIcon={<RewardsIconOff />}
          listItemClass={classNames(
            ['/store'].includes(pathname)
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        {!newClassExperience && (
          <div className={classes.myClasses}>
            <ListItemIcon className={classes.menuIcon}>
              <GradCapIcon className={classNames('whiteSvg')} />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </div>
        )}
        {!newClassExperience && (
          <ListItemText>
            <ClassList onClick={handleManageClasses} />
          </ListItemText>
        )}
        {!newClassExperience && (
          <div className={classes.myClasses}>
            <ListItemIcon className={classes.menuIcon}>
              <GradCapIcon className={classNames('whiteSvg')} />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </div>
        )}
        {!newClassExperience && (
          <ListItemText>
            <ClassList onClick={handleManageClasses} />
          </ListItemText>
        )}
        <DrawerItem
          OnIcon={<MyClassOn />}
          primaryText="My Classes"
          pathname={pathname}
          component={MyLink}
          link="/classes"
          OffIcon={<MyClassOff />}
          listItemClass={classNames(
            ['/classes'].includes(pathname)
              ? classes.currentPath
              : classes.otherPath
          )}
        />
        <div className={classes.divider} />
        <DrawerItem
          onClick={handleOpenGetApp}
          listItemClass={classes.otherPath}
          OnIcon={<GetAppIconOn />}
          primaryText="Get the Mobile App"
          OffIcon={<GetAppIconOff />}
        />
        <DrawerItem
          onClick={handleOpenFeedback}
          listItemClass={classes.lastItem}
          OnIcon={<FeedbackIconOn />}
          primaryText="Give Feedback"
          OffIcon={<FeedbackIconOff />}
        />
      </>
    ),
    [
      MyLink,
      landingPageCampaign,
      newClassExperience,
      pathname,
      visiabled,
      classes,
      newNotesScreen,
      qs,
      handleManageClasses
    ]
  );
  return (
    <>
      <List className={classes.drawerList} style={{ marginTop: appBarHeight }}>
        {isExpert && (
          <Tooltip
            id={9044}
            delay={600}
            placement="right"
            text="You can easily toggle between Expert Mode and Student Mode! 🙌🏽"
          >
            <div className={classes.expertContainer}>
              <Typography className={classes.expertTitle}>
                Expert Mode
              </Typography>
              {button}
            </div>
          </Tooltip>
        )}
        {createNewPost}
        {expertMode ? renderExpertMenu() : renderStudentMenu()}
        <div className={classes.separator} />
        <ListItem
          button
          link={`/profile/${userId}`}
          component={MyLink}
          className={classes.otherPath}
        >
          <Avatar className={classes.avatar} src={userProfileUrl}>
            {initials}
          </Avatar>
          <ListItemText primary={fullName} />
        </ListItem>
      </List>
    </>
  );
};
export default memo(Drawer);
