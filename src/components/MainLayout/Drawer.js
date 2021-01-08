// @flow
import React, { memo, useCallback, useState, useMemo, Fragment } from 'react'
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import List from '@material-ui/core/List';
import LaptopIcon from '@material-ui/icons/Laptop';
import AddIcon from '@material-ui/icons/Add';
import HelpOutline from '@material-ui/icons/HelpOutline';
import ClassmatesDialog from 'components/ClassmatesDialog'
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined'
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import classNames from 'classnames';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'
import HomeItem from 'components/MainLayout/HomeItem'
import ClassList from 'components/ClassList'
import StoreIcon from '@material-ui/icons/Store';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import queryString from 'query-string'
import { decypherClass } from 'utils/crypto'
import ListItemText from '@material-ui/core/ListItemText';
import anon from 'assets/svg/anon.svg'
import anoff from 'assets/svg/anoff.svg'
import Grid from '@material-ui/core/Grid'
import Tooltip from '../../containers/Tooltip';
import Logo from '../../assets/svg/icon_ic_simple_circlein_logo.svg';
import FlashcardsIcon from '../../assets/svg/flashcards-menu.svg';
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';
// $FlowIgnore
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
  updateFeed,
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
  userId,
  toggleExpertMode,
  userClasses
}) => {
  const classes = useStyles()
  const [openClassmates, setOpenClassmates] = useState(null)

  const openClassmatesDialog = useCallback(name => () => {
    setOpenClassmates(name)
  }, [])

  const closeClassmatesDialog = useCallback(() => {
    setOpenClassmates(null)
  }, [])

  const courseDisplayName = useMemo(() => {
    const query = queryString.parse(search)

    if (query.classId && userClasses?.classList) {
      const { classId } = decypherClass(query.class)
      const c = userClasses.classList.find(cl => cl.classId === Number(classId))
      if (c) return c.courseDisplayName
    }
    return ''
  }, [search, userClasses.classList])

  const handleOpenBlog = useCallback(() => {
    window.open('https://blog.circleinapp.com/', '_blank')
  }, [])



  const qs = useMemo(() => (
    queryString.parse(search)
  ), [search])

  const button = useMemo(() => (
    <Grid onClick={toggleExpertMode}>
      {expertMode ? <img alt='on' src={anon} className={classes.expertToggle} />
        : <img alt='off' src={anoff} className={classes.expertToggle} />}
    </Grid>
  ), [classes.expertToggle, expertMode, toggleExpertMode])

  const expertMenu = useMemo (() => expertMode && (
    <div>
      <ListItem
        button
        component={MyLink}
        link="/feed"
        className={classNames(
          ['/feed'].includes(pathname) ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemIcon>
          <GradCapIcon className={classNames("whiteSvg")} />
        </ListItemIcon>
        <ListItemText
          primary="Class Feed"
        />
      </ListItem>
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
      <ListItem
        button
        onClick={openClassmatesDialog('student')}
        className={classNames(
          classes.item,
          classes.otherPath
        )}
      >
        <ListItemText
          primary="Students"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
    </div>
  ), [MyLink, classes.currentPath, classes.item, classes.label, classes.otherPath, expertMode, openClassmatesDialog, pathname, qs])

  return (
    <Fragment>
      <ClassmatesDialog
        userId={userId}
        userClasses={userClasses}
        close={closeClassmatesDialog}
        state={openClassmates}
        courseDisplayName={courseDisplayName}
      />
      <List className={classes.drawerList} style={{ marginTop: appBarHeight }}>
        {isExpert && <div className={classes.expertContainer}>
          <Typography className={classes.expertTitle}>
            Expert Mode
          </Typography>
          {button}
        </div>}
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
          createPostOpen={createPostOpen}
          MyLink={MyLink}
          userClasses={userClasses}
          updateFeed={updateFeed}
          landingPageCampaign={landingPageCampaign}
          newClassExperience={newClassExperience}
          openClassmatesDialog={openClassmatesDialog('classmate')}
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
