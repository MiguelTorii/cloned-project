// @flow
import React, { useState, useEffect, memo, useCallback, useMemo, Fragment } from 'react'
import classNames from 'classnames';
import queryString from 'query-string'

// import { decypherClass } from 'utils/crypto'
// import ClassmatesDialog from 'components/ClassmatesDialog'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';


import HomeItem from 'components/MainLayout/HomeItem'
import ClassList from 'components/ClassList'
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
import { ReactComponent as StudentBlogIconOff } from 'assets/svg/student-blog-icon-off.svg';
import { ReactComponent as StudentBlogIconOn } from 'assets/svg/student-blog-icon-on.svg';
import { ReactComponent as WorkflowIconOff } from 'assets/svg/workflow-icon-off.svg';
import { ReactComponent as WorkflowIconOn } from 'assets/svg/workflow-icon-on.svg';
import { ReactComponent as OneTouchSendIconOn } from 'assets/svg/one-touch-send-icon-on.svg';
import { ReactComponent as OneTouchSendIconOff } from 'assets/svg/one-touch-send-icon-off.svg';
import { ReactComponent as GradCapIcon } from 'assets/svg/ic_grad_cap.svg';
import { ReactComponent as CircleInLogoIcon } from 'assets/svg/ic_simple_circlein_logo.svg';
import { ReactComponent as MyClassOff } from 'assets/svg/myclass-inactive.svg';
import { ReactComponent as MyClassOn } from 'assets/svg/myclass-active.svg';
// import { ReactComponent as CommunityOn } from 'assets/svg/active-community.svg';
// import { ReactComponent as CommunityOff } from 'assets/svg/inactive-community.svg';
import { ReactComponent as OffStudyRoom } from 'assets/svg/inactive-study-room.svg';
import { ReactComponent as OnStudyRoom } from 'assets/svg/active-study-room.svg';
import DrawerItem from 'components/MainLayout/DrawerItem'
import BatchMessageDialog from 'containers/BatchMessageDialog'

import { useStyles } from '../_styles/MainLayout/Drawer';

const Drawer = ({
  newClassExperience,
  newNotesScreen,
  // createPostOpen,
  handleOpenGetApp,
  handleOpenFeedback,
  MyLink,
  search,
  pathname,
  handleManageClasses,
  appBarHeight,
  // handleCreatePostMenuOpen,
  handleOpenUseCases,
  handleOpenHowEarnPoints,
  landingPageCampaign,
  expertMode,
  isExpert,
  toggleExpertMode,
  // updateFeed,
  userId,
  fullName,
  userProfileUrl,
  initials,
  // userClasses
}) => {
  const classes = useStyles()
  // const [openClassmates, setOpenClassmates] = useState(null)
  const [openOneTouchSend, setOpenOneTouchSend] = useState(false)
  const [campaign, setCampaign] = useState(null)

  const handleOpenOneTouchSend = useCallback(() => setOpenOneTouchSend(true),[])
  const handleCloseOneTouchSend = useCallback(() => setOpenOneTouchSend(false),[])

  // const openClassmatesDialog = useCallback(name => () => {
  // setOpenClassmates(name)
  // }, [])

  // const closeClassmatesDialog = useCallback(() => {
  // setOpenClassmates(null)
  // }, [])

  // const courseDisplayName = useMemo(() => {
  // const query = queryString.parse(search)

  // if (query.classId && userClasses?.classList) {
  // const { classId } = decypherClass(query.class)
  // const c = userClasses.classList.find(cl => cl.classId === Number(classId))
  // if (c) return c.courseDisplayName
  // }
  // return ''
  // }, [search, userClasses.classList])

  useEffect(() => {
    const init = async () => {
      const aCampaign = await getCampaign({ campaignId: 9 })
      setCampaign(aCampaign);
    }

    init()
  }, [])

  const visiabled = useMemo(() => {
    return campaign?.variation_key && campaign?.variation_key !== 'hidden'
  }, [campaign])


  const handleOpenBlog = useCallback(() => {
    window.open('https://blog.circleinapp.com/', '_blank')
  }, [])

  const handleOpenTutorHelp = useCallback(() => {
    window.open('https://tutors.circleinapp.com/home', '_blank')
  }, [])

  const qs = useMemo(() => (
    queryString.parse(search)
  ), [search])

  const button = useMemo(() => (
    <FormControlLabel
      control={
        <CustomSwitch
          checked={expertMode}
          onChange={toggleExpertMode}
          name="expert-mode"
        />
      }
    />
  ), [expertMode, toggleExpertMode])

  const expertMenu = useMemo (() => expertMode && (
    <div>
      <BatchMessageDialog
        open={openOneTouchSend}
        closeDialog={handleCloseOneTouchSend}
      />
      <DrawerItem
        listItemClass={classNames(
          // ['/feed', '/my_posts', '/bookmarks'].includes(pathname) ? classes.currentPath : classes.otherPath
          ['/feed'].includes(pathname) ? classes.currentPath : classes.otherPath
        )}
        link="/feed"
        pathname={pathname}
        OnIcon={<ClassFeedIconOn />}
        primaryText='Class Feed'
        component={MyLink}
        OffIcon={<ClassFeedIconOff />}
      />
      <ListItem
        button
        component={MyLink}
        link={`/my_posts?${queryString.stringify({ ...qs, from: 'me' })}`}
        className={classNames(
          classes.item,
          ['/my_posts'].includes(pathname) && qs.from === 'me' ? classes.currentPath : classes.otherPath
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
          ['/bookmarks'].includes(pathname) && qs.from === 'bookmarks' ? classes.currentPath : classes.otherPath
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
        primaryText='My Classes'
        pathname={pathname}
        component={MyLink}
        link="/classes"
        OffIcon={<MyClassOff />}
        listItemClass={classNames(
          ['/classes'].includes(pathname) ? classes.currentPath : classes.otherPath
        )}
      />
      {/* <ListItem */}
      {/* button */}
      {/* onClick={openClassmatesDialog('student')} */}
      {/* className={classNames( */}
      {/* classes.item, */}
      {/* classes.otherPath */}
      {/* )} */}
      {/* > */}
      {/* <ListItemText */}
      {/* primary="Students" */}
      {/* classes={{ */}
      {/* primary: classes.label */}
      {/* }} */}
      {/* /> */}
      {/* </ListItem> */}
    </div>
  ), [MyLink, classes.currentPath, classes.item, classes.label, classes.otherPath, expertMode, handleCloseOneTouchSend, openOneTouchSend, pathname, qs])

  const createNewPost = useMemo(() => (
    // <Tooltip
    //   hidden={createPostOpen}
    //   id={5792}
    //   placement="right"
    //   text="Now that you’re in your class, click here to post on the feed and start earning points!"
    // >
    <ListItem
      button
      component={MyLink}
      className={`${classes.newItem} tour-onboarding-new`}
      // onClick={handleCreatePostMenuOpen}
      link="/create_post"
    >
      <ListItemIcon className={classes.newIconContainer}>
        <AddIcon
          className={classes.newIcon}
        />
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
  ), [MyLink, classes.newIcon, classes.newIconContainer, classes.newItem, classes.newLabel, classes.newRoot, pathname])

  return (
    <Fragment>
      {/* <ClassmatesDialog */}
      {/* userId={userId} */}
      {/* userClasses={userClasses} */}
      {/* close={closeClassmatesDialog} */}
      {/* state={openClassmates} */}
      {/* courseDisplayName={courseDisplayName} */}
      {/* /> */}
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
        {expertMenu}
        {landingPageCampaign && (
          <DrawerItem
            OnIcon={<WorkflowIconOn />}
            primaryText='Workflow'
            pathname={pathname}
            component={MyLink}
            link="/"
            OffIcon={<WorkflowIconOff/>}
            listItemClass={classNames(
              ['/'].includes(pathname) ? classes.currentPath : classes.otherPath
            )}
          />
        )}
        {newNotesScreen && (
          <DrawerItem
            OnIcon={<NotesIconOn />}
            primaryText='Notes'
            pathname={pathname}
            component={MyLink}
            link="/notes"
            OffIcon={<NotesIconOff />}
            listItemClass={classNames(
              ['/notes'].includes(pathname) ? classes.currentPath : classes.otherPath
            )}
          />
        )}
        <DrawerItem
          OnIcon={<img src={FlashcardsIconOn} alt='flashcards on' className={classes.flashcardIconOn} />}
          primaryText='Flashcards'
          pathname={pathname}
          component={MyLink}
          link={`/flashcards${search}`}
          OffIcon={<FlashcardsIconOff />}
          listItemClass={classNames(
            pathname.includes('/flashcards') ? classes.currentPath : classes.otherPath
          )}
        />
        {!expertMode && <HomeItem
          MyLink={MyLink}
          newClassExperience={newClassExperience}
          // createPostOpen={createPostOpen}
          // userClasses={userClasses}
          // updateFeed={updateFeed}
          // landingPageCampaign={landingPageCampaign}
          // openClassmatesDialog={openClassmatesDialog('classmate')}
        />}
        {!expertMode && (
          <Tooltip
            id={9054}
            placement="right"
            okButton='Okay!'
            text="Hey! You can access your classes by clicking “My Classes”"
          >
            <DrawerItem
              OnIcon={<MyClassOn />}
              primaryText='My Classes'
              pathname={pathname}
              component={MyLink}
              link="/classes"
              OffIcon={<MyClassOff />}
              listItemClass={classNames(
                ['/classes'].includes(pathname) ? classes.currentPath : classes.otherPath
              )}
            />
          </Tooltip>
        )}
        {!landingPageCampaign && (
          <DrawerItem
            OnIcon={<WorkflowIconOn />}
            primaryText='Workflow'
            pathname={pathname}
            component={MyLink}
            link="/workflow"
            OffIcon={<WorkflowIconOff/>}
            listItemClass={classNames(
              ['/workflow'].includes(pathname) ? classes.currentPath : classes.otherPath
            )}
          />
        )}
        <DrawerItem
          OnIcon={<ChatIconOn />}
          primaryText='Chats'
          pathname={pathname}
          component={MyLink}
          link="/chat"
          OffIcon={<ChatIconOff />}
          listItemClass={classes.otherPath}
        />

        {/* <DrawerItem
          OnIcon={<CommunityOn />}
          primaryText='Communities'
          pathname={pathname}
          component={MyLink}
          link="/communities"
          OffIcon={<CommunityOff />}
          listItemClass={classes.otherPath}
        /> */}
        {visiabled && <Tooltip
          id={9059}
          placement="right"
          variant="secondary"
          text="Pssst! You can start video chatting from the left navigation! 😍"
          okButton="Nice!"
        >
          <DrawerItem
            onClick={handleOpenGetApp}
            listItemClass={classes.otherPath}
            OnIcon={<OnStudyRoom />}
            component={MyLink}
            link="/video-call"
            primaryText='Study Room'
            OffIcon={<OffStudyRoom />}
          />
        </Tooltip>}
        {expertMode && <DrawerItem
          OnIcon={<OneTouchSendIconOn />}
          primaryText='One-Touch Send'
          onClick={handleOpenOneTouchSend}
          OffIcon={<OneTouchSendIconOff />}
          listItemClass={classes.otherPath}
        />}
        {!expertMode && <DrawerItem
          OnIcon={<LeaderboardIconOn />}
          primaryText='Leaderboard'
          pathname={!qs.class && pathname}
          component={MyLink}
          link="/leaderboard"
          OffIcon={<LeaderboardIconOff />}
          listItemClass={
            !qs.class && ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath
          }
        />}
        {!expertMode && <DrawerItem
          OnIcon={<RewardsIconOn />}
          primaryText='Rewards Store'
          pathname={pathname}
          component={MyLink}
          link="/store"
          OffIcon={<RewardsIconOff/>}
          listItemClass={classNames(
            ['/store'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        />}
        {!newClassExperience && <div className={classes.myClasses}>
          <ListItemIcon className={classes.menuIcon}>
            <GradCapIcon className={classNames("whiteSvg")} />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </div>}
        {!newClassExperience && <ListItemText>
          <ClassList
            onClick={handleManageClasses}
          />
        </ListItemText>}
        {!expertMode && <ListItem
          button
          className={classes.otherBlue}
          onClick={handleOpenUseCases}
        >
          <ListItemIcon className={classes.menuIcon}>
            <CircleInLogoIcon />
          </ListItemIcon>
          <ListItemText primary="Studying on CircleIn" />
        </ListItem>}

        <div className={classes.divider} />
        {expertMode && <ListItem
          button
          onClick={handleOpenTutorHelp}
          className={classes.otherPath}
        >
          <ListItemIcon className={classes.menuIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Tutor Help Center" />
        </ListItem>}

        {!expertMode && <ListItem
          button
          onClick={handleOpenHowEarnPoints}
          className={classes.otherPath}
        >
          <ListItemIcon className={classes.menuIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Student Help Center" />
        </ListItem>}
        {!expertMode && <DrawerItem
          onClick={handleOpenGetApp}
          listItemClass={classes.otherPath}
          OnIcon={<GetAppIconOn />}
          primaryText='Get the Mobile App'
          OffIcon={<GetAppIconOff />}
        />}
        {/* currently always showing the tooltip, need to implement logic to conditionally render depending on preferences */}
        {!expertMode && <Tooltip
          id={3181}
          delay={600}
          hidden
          placement="top"
          text="Visit our student blog and learn successful study habits, how to remain calm before finals, and more!"
        >
          <DrawerItem
            onClick={handleOpenBlog}
            listItemClass={classes.otherPath}
            OnIcon={<StudentBlogIconOn />}
            primaryText='Student Blog'
            OffIcon={<StudentBlogIconOff />}
          />
        </Tooltip>}
        <DrawerItem
          onClick={handleOpenFeedback}
          listItemClass={classes.lastItem}
          OnIcon={<FeedbackIconOn />}
          primaryText='Give Feedback'
          OffIcon={<FeedbackIconOff/>}
        />
        <div className={classes.separator}>
        </div>
        <ListItem
          button
          link={`/profile/${userId}`}
          component={MyLink}
          className={classes.otherPath}
        >
          <Avatar
            className={classes.avatar}
            src={userProfileUrl}>
            {initials}
          </Avatar>
          <ListItemText primary={fullName} />
        </ListItem>
      </List>
    </Fragment>
  )
}
export default memo(Drawer)
