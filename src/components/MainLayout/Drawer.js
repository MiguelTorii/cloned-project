// @flow
import React, { memo, useCallback, useMemo, Fragment } from 'react'
import classNames from 'classnames';
import queryString from 'query-string'

import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import LaptopIcon from '@material-ui/icons/Laptop';
import StoreIcon from '@material-ui/icons/Store';
import AddIcon from '@material-ui/icons/Add';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import HelpOutline from '@material-ui/icons/HelpOutline';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined'
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';


import HomeItem from 'components/MainLayout/HomeItem'
import ClassList from 'components/ClassList'
import CustomSwitch from 'components/MainLayout/Switch';
import Tooltip from '../../containers/Tooltip';

import Logo from '../../assets/svg/icon_ic_simple_circlein_logo.svg';
import FlashcardsIcon from '../../assets/svg/flashcards-menu.svg';
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';
import { ReactComponent as LeaderboardIcon } from '../../assets/svg/ic_leaderboard.svg';
import { ReactComponent as HandshakeIcon } from '../../assets/svg/hand_shake.svg';

const useStyles = makeStyles((theme) => ({
  backHeader: {
    margin: theme.spacing(2)
  },
  drawerList: {
    overflow: 'auto !important',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  backTitle: {
    width: '100%',
    fontSize: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  newItem: {
    width: 'auto',
    margin: theme.spacing(),
    padding: 0,
    paddingLeft: theme.spacing(3),
    borderRadius: theme.spacing(),
    marginTop: theme.spacing(2)
  },
  newRoot: {
    flex: 'inherit'
  },
  newLabel: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  currentPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.hoverMenu,
    '& span': {
      fontWeight: 'bold',
    },
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(1, 2),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  otherPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  otherBlue: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    color: theme.circleIn.palette.brand,
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  separator: {
    marginTop: 'auto',
  },
  verticalSpacing: {
    margin: theme.spacing(2, 0, 1, 0)
  },
  iconColorBrand: {
    color: theme.circleIn.palette.brand
  },
  lastItem: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  newIconContainer: {
    padding: theme.spacing(3/2),
    borderRadius: '50%',
    marginRight: theme.spacing(),
    backgroundImage: `linear-gradient(to top, #94daf9, ${theme.circleIn.palette.primaryii222})`
  },
  newIcon: {
    color: 'black',
    fontWeight: 'bold'
  },
  bulb: {
    transform: 'rotate(180deg)'
  },
  expertContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2)
  },
  expertToggle: {
    cursor: 'pointer',
    height: 35,
    width: 50
  },
  expertTitle: {
    fontWeight: 'bold'
  },
  pr1: {
    paddingRight: theme.spacing(0.6)
  },
  item: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(3),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  flashcardsIcon: {
    width: 24,
    height: 24
  }
}));

const Drawer = ({
  newClassExperience,
  newNotesScreen,
  createPostOpen,
  handleOpenGetApp,
  handleOpenFeedback,
  MyLink,
  search,
  pathname,
  handleManageClasses,
  appBarHeight,
  handleCreatePostMenuOpen,
  handleOpenUseCases,
  handleOpenStudentJobs,
  handleOpenHowEarnPoints,
  landingPageCampaign,
  expertMode,
  isExpert,
  toggleExpertMode,
  viewedOnboarding
}) => {
  const classes = useStyles()

  const handleOpenBlog = useCallback(() => {
    window.open('https://blog.circleinapp.com/', '_blank')
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
      <ListItem
        button
        component={MyLink}
        link="/feed"
        className={classNames(
          ['/feed', '/my_posts', '/bookmarks'].includes(pathname) ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemIcon>
          <GradCapIcon className={classNames("whiteSvg")} />
        </ListItemIcon>
        <ListItemText
          primary="Class Feeds"
        />
      </ListItem>
    </div>
  ), [MyLink, classes.currentPath, classes.otherPath, expertMode, pathname])

  const createNewPost = useMemo(() => (
    <Tooltip
      hidden={createPostOpen}
      id={5792}
      placement="right"
      text="Now that you’re in your class, click here to post on the feed and start earning points!"
    >
      <ListItem button className={`${classes.newItem} tour-onboarding-new`} onClick={handleCreatePostMenuOpen}>
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
    </Tooltip>
  ), [classes.newIcon, classes.newIconContainer, classes.newItem, classes.newLabel, classes.newRoot, createPostOpen, handleCreatePostMenuOpen, pathname])

  return (
    <Fragment>
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
        {landingPageCampaign && <ListItem
          button
          component={MyLink}
          link="/"
          className={classNames(
            ['/'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText
            primary="Workflow"
          />
        </ListItem>}
        {newNotesScreen && <ListItem
          button
          component={MyLink}
          className={classNames(
            ['/notes'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
          link='/notes'
        >
          <ListItemIcon>
            <BookOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Notes"
          />
        </ListItem>}
        <ListItem
          button
          component={MyLink}
          className={classNames(
            ['/create/flashcards'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
          link={`/create/flashcards${search}`}
        >
          <ListItemIcon>
            <img
              src={FlashcardsIcon}
              alt='flashcards-menu'
              className={classes.flashcardsIcon}
            />
          </ListItemIcon>
          <ListItemText
            primary="Flashcards"
          />
        </ListItem>
        {!expertMode && <HomeItem
          MyLink={MyLink}
          newClassExperience={newClassExperience}
        />}
        {!landingPageCampaign && <ListItem
          button
          component={MyLink}
          link="/workflow"
          className={classNames(
            ['/workflow'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText
            primary="Workflow"
          />
        </ListItem>}
        <ListItem
          button
          component={MyLink}
          className={classes.otherPath}
          link='/chat'
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText
            primary="Chats"
          />
        </ListItem>
        <ListItem
          button
          component={MyLink}
          link="/leaderboard"
          className={classNames(
            'tour-onboarding-leaderboard',
            !qs.class && ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemIcon>
            <LeaderboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Leaderboard"
          />
        </ListItem>
        <ListItem
          button
          component={MyLink}
          link="/store"
          className={classNames(
            ['/store'].includes(pathname) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText
            primary="Your Rewards"
          />
        </ListItem>
        {!newClassExperience && <div className={classes.myClasses}>
          <ListItemIcon>
            <GradCapIcon className={classNames("whiteSvg")} />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </div>}
        {!newClassExperience && <ListItemText>
          <ClassList
            onClick={handleManageClasses}
          />
        </ListItemText>}
        <ListItem
          button
          className={classes.otherBlue}
          onClick={handleOpenUseCases}
        >
          <ListItemIcon>
            <img src={Logo} alt="logo" />
          </ListItemIcon>
          <ListItemText primary="Studying on CircleIn" />
        </ListItem>
        {/* currently always showing the tooltip, need to implement logic to conditionally render depending on preferences */}
        <ListItem
          button
          onClick={handleOpenHowEarnPoints}
          className={classes.otherPath}
        >
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
        <div className={classes.separator}>
          <ListItem
            button
            onClick={handleOpenGetApp}
            className={classes.otherBlue}
          >
            <ListItemIcon>
              <SystemUpdateIcon className={classes.iconColorBrand}/>
            </ListItemIcon>
            <ListItemText primary="Get the Mobile App" />
          </ListItem>

          <div className={classes.verticalSpacing}>
            <ListItem
              button
              onClick={handleOpenStudentJobs}
              className={classes.otherPath}
            >
              <ListItemIcon>
                <HandshakeIcon className={classes.pr1}/>
              </ListItemIcon>
              <ListItemText primary="Student Jobs" />
            </ListItem>
          </div>

          <div className={classes.verticalSpacing}>
            <Tooltip
              id={3181}
              delay={600}
              hidden
              placement="top"
              text="Visit our student blog and learn successful study habits, how to remain calm before finals, and more!"
            >
              <ListItem
                button
                className={classes.otherPath}
                onClick={handleOpenBlog}
              >
                <ListItemIcon>
                  <LaptopIcon />
                </ListItemIcon>
                <ListItemText primary="Student Blog" />
              </ListItem>
            </Tooltip>
          </div>
        </div>
        <ListItem
          button
          onClick={handleOpenFeedback}
          className={classes.lastItem}
        >
          <ListItemIcon>
            <WbIncandescentOutlinedIcon className={classes.bulb} />
          </ListItemIcon>
          <ListItemText primary="Give Feedback" />
        </ListItem>
      </List>
    </Fragment>
  )
}
export default memo(Drawer)
