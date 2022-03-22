import React, { memo, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import queryString from 'query-string';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';

import Avatar from 'components/Avatar';
import { Dispatch } from 'types/store';
import ClassList from 'components/ClassList/ClassList';
import CustomSwitch from './Switch';
import Tooltip from 'containers/Tooltip/Tooltip';
import { ReactComponent as ClassFeedIconOff } from 'assets/svg/class-feed-icon-off.svg';
import { ReactComponent as ClassFeedIconOn } from 'assets/svg/class-feed-icon-on.svg';
import { ReactComponent as ChatIconOn } from 'assets/svg/chat-icon-on.svg';
import { ReactComponent as ChatIconOff } from 'assets/svg/chat-icon-off.svg';
import { ReactComponent as FeedbackIconOff } from 'assets/svg/feedback-icon-off.svg';
import { ReactComponent as FeedbackIconOn } from 'assets/svg/feedback-icon-on.svg';
import { ReactComponent as FlashcardsIconOff } from 'assets/svg/flashcards-icon-off.svg';
import { ReactComponent as CircleInLogoIcon } from 'assets/svg/ic_simple_circlein_logo.svg';
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
import DrawerItem from './DrawerItem';
import { useStyles } from '../_styles/MainLayout/Drawer';
import { checkPath } from 'utils/helpers';
import { setOneTouchSendAction } from 'actions/chat';

type Props = {
  handleOpenGetApp?: any;
  handleOpenFeedback?: any;
  MyLink?: any;
  search?: any;
  pathname?: any;
  handleManageClasses?: any;
  appBarHeight?: any;
  expertMode?: any;
  isExpert?: any;
  toggleExpertMode?: any;
  userId?: any;
  fullName?: any;
  userProfileUrl?: any;
  initials?: any;
};

const Drawer = ({
  handleOpenGetApp,
  handleOpenFeedback,
  MyLink,
  search,
  pathname,
  handleManageClasses,
  appBarHeight,
  expertMode,
  isExpert,
  toggleExpertMode,
  userId,
  fullName,
  userProfileUrl,
  initials
}: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const handleOpenOneTouchSend = useCallback(
    () => dispatch(setOneTouchSendAction(true)),
    [dispatch]
  );

  const handleOpenTutorHelp = useCallback(() => {
    window.open('https://tutors.circleinapp.com/home', '_blank');
  }, []);
  const qs = useMemo(() => queryString.parse(search), [search]);
  const expertModeButton = useMemo(
    () => (
      <FormControlLabel
        control={
          <CustomSwitch checked={expertMode} onChange={toggleExpertMode} name="expert-mode" />
        }
        label={''}
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
          link={`/bookmarks?${queryString.stringify({ ...qs, from: 'bookmarks' })}`}
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
            ['/classes'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
        <DrawerItem
          OnIcon={
            <img src={FlashcardsIconOn} alt="flashcards on" className={classes.flashcardIconOn} />
          }
          primaryText="Flashcards"
          pathname={pathname}
          component={MyLink}
          link={`/flashcards`}
          OffIcon={<FlashcardsIconOff />}
          listItemClass={classNames(
            pathname.includes('/flashcards') ? classes.currentPath : classes.otherPath
          )}
        />
        <DrawerItem
          OnIcon={<OneTouchSendIconOn />}
          primaryText="One-Touch Send"
          component={MyLink}
          link="/chat"
          OffIcon={<OneTouchSendIconOff />}
          listItemClass={classes.otherPath}
          onClick={handleOpenOneTouchSend}
          pathname={undefined}
        />
        <DrawerItem
          OnIcon={<CircleInLogoIcon />}
          primaryText="Studying on CircleIn"
          pathname={pathname}
          component={MyLink}
          link="/study"
          OffIcon={<CircleInLogoIcon />}
          listItemClass={classNames(
            ['/study'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
        <div className={classes.divider} />
        <ListItem button onClick={handleOpenTutorHelp} className={classes.otherPath}>
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
          pathname={undefined}
        />
      </>
    ),
    [MyLink, pathname, classes, qs, handleManageClasses]
  );
  const renderStudentMenu = useCallback(
    () => (
      <>
        <DrawerItem
          listItemClass={classNames(
            ['/home'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
          link="/home"
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
        <DrawerItem
          OnIcon={<ClassFeedIconOn />}
          OffIcon={<ClassFeedIconOff />}
          primaryText="Class Feeds"
          link="/feed"
          component={MyLink}
          active={checkPath(pathname, [
            '/feed',
            '/question',
            '/notes',
            '/sharelink',
            '/question',
            '/post'
          ])}
        />
        <DrawerItem
          OnIcon={
            <img src={FlashcardsIconOn} alt="flashcards on" className={classes.flashcardIconOn} />
          }
          primaryText="Flashcards"
          pathname={pathname}
          component={MyLink}
          link="/flashcards"
          OffIcon={<FlashcardsIconOff />}
          active={checkPath(pathname, ['/flashcards'])}
        />
        <DrawerItem
          OnIcon={<WorkflowIconOn />}
          primaryText="Workflow"
          pathname={pathname}
          component={MyLink}
          link="/workflow"
          OffIcon={<WorkflowIconOff />}
          listItemClass={classNames(
            ['/workflow'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
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
            ['/store'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
        <DrawerItem
          OnIcon={<MyClassOn />}
          primaryText="My Classes"
          pathname={pathname}
          component={MyLink}
          link="/classes"
          OffIcon={<MyClassOff />}
          listItemClass={classNames(
            ['/classes'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
        <DrawerItem
          OnIcon={<CircleInLogoIcon />}
          primaryText="Studying on CircleIn"
          pathname={pathname}
          component={MyLink}
          link="/study"
          OffIcon={<CircleInLogoIcon />}
          listItemClass={classNames(
            ['/study'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />
        <div className={classes.divider} />
        <DrawerItem
          onClick={handleOpenGetApp}
          listItemClass={classes.otherPath}
          OnIcon={<GetAppIconOn />}
          primaryText="Get the Mobile App"
          OffIcon={<GetAppIconOff />}
          pathname={undefined}
        />
        <DrawerItem
          onClick={handleOpenFeedback}
          listItemClass={classes.lastItem}
          OnIcon={<FeedbackIconOn />}
          primaryText="Give Feedback"
          OffIcon={<FeedbackIconOff />}
          pathname={undefined}
        />
      </>
    ),
    [MyLink, pathname, classes, qs, handleManageClasses]
  );
  return (
    <>
      <List
        className={classes.drawerList}
        style={{
          marginTop: appBarHeight
        }}
      >
        {isExpert && (
          <Tooltip
            id={9044}
            delay={600}
            placement="right"
            text="You can easily toggle between Expert Mode and Student Mode! 🙌🏽"
          >
            <div className={classes.expertContainer}>
              <Typography className={classes.expertTitle}>Expert Mode</Typography>
              {expertModeButton}
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
          <Avatar profileImage={userProfileUrl} initials={initials} fromChat />
          <ListItemText primary={fullName} />
        </ListItem>
      </List>
    </>
  );
};

export default memo(Drawer);
