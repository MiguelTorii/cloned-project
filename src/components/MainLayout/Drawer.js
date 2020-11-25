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
import Tooltip from '../../containers/Tooltip';
import Logo from '../../assets/svg/app-logo-white.svg';
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';
// $FlowIgnore
import { ReactComponent as LeaderboardIcon } from '../../assets/svg/ic_leaderboard.svg';

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
    justifyContent: 'center',
    margin: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.brand,
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
    marginTop: theme.spacing(2)
  },
  newRoot: {
    flex: 'inherit'
  },
  newLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
  currentPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.buttonBackground,
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(1, 2),
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  otherPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  blogLink: {
    marginTop: 'auto',
  },
  lastItem: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  newIcon: {
    color: 'black',
    fontWeight: 'bold'
  },
  bulb: {
    transform: 'rotate(180deg)'
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
  handleOpenHowEarnPoints,
  landingPageCampaign,
  userClasses
}) => {
  const classes = useStyles()
  const [openClassmates, setOpenClassmates] = useState(false)

  const openClassmatesDialog = useCallback(() => {
    setOpenClassmates(true)
  }, [])

  const closeClassmatesDialog = useCallback(() => {
    setOpenClassmates(false)
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



  const qs = queryString.parse(window.location.search)

  return (
    <Fragment>
      <ClassmatesDialog
        close={closeClassmatesDialog}
        state={openClassmates}
        courseDisplayName={courseDisplayName}
      />
      <List className={classes.drawerList} style={{ marginTop: appBarHeight }}>
        {/* TODO: move this to feed top */}
        {false && newClassExperience && courseDisplayName && <div className={classes.backHeader}>
          <Typography className={classes.backTitle}>{courseDisplayName}</Typography>
        </div>}
        <Tooltip
          hidden={createPostOpen}
          id={5792}
          placement="right"
          text="Now that you’re in your class, click here to post on the feed and start earning points!"
        >
          <ListItem button className={`${classes.newItem} tour-onboarding-new`} onClick={handleCreatePostMenuOpen}>
            <ListItemIcon>
              <AddIcon
                className={classes.newIcon}
              />
            </ListItemIcon>
            <ListItemText
              primary="New"
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
        <HomeItem
          createPostOpen={createPostOpen}
          MyLink={MyLink}
          userClasses={userClasses}
          updateFeed={updateFeed}
          landingPageCampaign={landingPageCampaign}
          newClassExperience={newClassExperience}
          openClassmatesDialog={openClassmatesDialog}
        />
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
            primary="Rewards Store"
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
          className={classes.otherPath}
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
          onClick={handleOpenGetApp}
          className={classes.otherPath}
        >
          <ListItemIcon>
            <SystemUpdateIcon />
          </ListItemIcon>
          <ListItemText primary="Get the Mobile App" />
        </ListItem>
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
        <div className={classes.blogLink}>
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
