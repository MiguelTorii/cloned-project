// @flow
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AddIcon from '@material-ui/icons/Add';
import StoreIcon from '@material-ui/icons/Store';
// import AnnouncementIcon from '@material-ui/icons/Announcement';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';
import HomeItem from 'components/MainLayout/HomeItem'
import ClassList from 'components/ClassList'
import queryString from 'query-string'
import clsx from 'clsx'
import { withRouter } from 'react-router';
import ClassmatesDialog from 'components/ClassmatesDialog'
import logo from '../../assets/svg/circlein_logo.svg';
// $FlowIgnore
import { ReactComponent as LeaderboardIcon } from '../../assets/svg/ic_leaderboard.svg';
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';
import FlashCards from '../../assets/svg/flashcards.svg';
import Links from '../../assets/svg/links.svg';
import Notes from '../../assets/svg/notes.svg';
import Questions  from '../../assets/svg/questions.svg';
import Reminders from '../../assets/svg/reminders.svg';
import Videos from '../../assets/svg/videos.svg';
import './currentRoute.css'
import GetApp from '../GetApp';
import HowDoIEarnPoints from '../HowDoIEarnPoints';
import Tooltip from '../../containers/Tooltip';

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  if (![
    '/feed',
    '/create/notes',
    '/create/sharelink',
    '/create/question',
    '/create/flashcards'
  ].includes(window.location.pathname)) document.title = 'CircleIn'
  return <RouterLink to={link} {...props} ref={ref} />
});

const drawerWidth = 280;

const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: 8
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#547686',
      borderRadius: 16,
      outline: '1px solid slategrey'
    }
  },
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 12,
    }
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logo: {
    maxWidth: 160,
    paddingLeft: theme.spacing(2)
  },
  hide: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  drawerOpen: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    width: '75%',
    padding: theme.spacing(),
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(8)
    }
  },
  currentRoute: {
    color: theme.palette.primary.main
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
  newIcon: {
    color: 'black',
    fontWeight: 'bold'
  },
  currentPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.buttonBackground,
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(2),
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  otherPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  myClasses: {
    display: 'flex',
    marginLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
  drawerList: {
    overflow: 'auto !important'
  },
  backHeader: {
    margin: theme.spacing(2)
  },
  backContainer: {
    cursor: 'pointer'
  },
  backTitle: {
    width: '100%',
    fontSize: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {
    height: 36,
    marginLeft: 4,
    marginRight: 20,
    width: 36,
  },
  menuItemContent: {
    alignItems: 'center',
    display: 'flex',
    marginRight: 10,
  },
  primaryItem: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryItem: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 14,
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 2,
    margin: '6px 0px',
  },
});

type Props = {
  classes: Object,
  width: string,
  runningTour: boolean,
  userId: string,
  initials: string,
  userProfileUrl: string,
  children: any,
  unreadCount: number,
  pathname: string,
  handleNotificationOpen: Function,
  handleSignOut: Function,
  onManageClasses: Function,
  userClasses: Object,
  onManageBlockedUsers: Function,
  newClassExperience: boolean,
  updateFeed: Function,
  location: {
    search: string
  }
  // onOpenLeaderboard: Function
  // onOpenAnnouncements: Function
};

type State = {
  open: boolean,
  anchorEl: ?string,
  mobileMoreAnchorEl: ?string,
  createPostAnchorEl: ?string,
  openGetApp: boolean,
  openHowEarnPoints: boolean,
  createPostOpen: boolean
};

class MainLayout extends React.Component<Props, State> {
  state = {
    open: false,
    anchorEl: null,
    mobileMoreAnchorEl: null,
    createPostAnchorEl: null,
    openGetApp: false,
    openHowEarnPoints: false,
    openClassmates: false,
    createPostOpen: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleCreatePostMenuOpen = event => {
    this.setState({ createPostAnchorEl: event.currentTarget, createPostOpen: true });
  };

  handleCreatePostMenuClose = () => {
    this.setState({ createPostAnchorEl: null, createPostOpen: false });
  };

  handleNotificationOpen = event => {
    const { handleNotificationOpen } = this.props;
    handleNotificationOpen(event);
    this.handleMobileMenuClose();
    this.handleMenuClose();
  };

  handleSignOut = () => {
    const { handleSignOut } = this.props;
    handleSignOut();
    this.handleMobileMenuClose();
    this.handleMenuClose();
  };

  handleManageClasses = () => {
    const { onManageClasses } = this.props;
    this.handleMenuClose();
    onManageClasses();
  };

  handleBlockedUsers = () => {
    const { onManageBlockedUsers } = this.props;
    this.handleMenuClose();
    onManageBlockedUsers();
  };

  handleOpenGetApp = () => {
    this.setState({ openGetApp: true });
    this.handleMenuClose();
  };

  handleCloseGetApp = () => {
    this.setState({ openGetApp: false });
  };

  handleOpenHowEarnPoints = () => {
    this.setState({ openHowEarnPoints: true });
    this.handleMenuClose();
  };

  handleCloseHowEarnPoints = () => {
    this.setState({ openHowEarnPoints: false });
  };

  getCourseDisplayName = classList => {
    const query = queryString.parse(window.location.search)

    if (query.classId && classList) {
      const c = classList.find(cl => cl.classId === Number(query.classId))
      if (c) return c.courseDisplayName
    }
    return ''
  }

  render() {
    const {
      open,
      anchorEl,
      createPostOpen,
      mobileMoreAnchorEl,
      createPostAnchorEl,
      openGetApp,
      openHowEarnPoints,
      openClassmates
    } = this.state;
    const {
      classes,
      userId,
      initials,
      userProfileUrl,
      width,
      children,
      unreadCount,
      location: { search = '' },
      pathname,
      runningTour,
      // onOpenLeaderboard
      // onOpenAnnouncements
    } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isCreatePostMenuOpen = Boolean(createPostAnchorEl);

    const MenuItemContent = ({ primaryText, secondaryText, icon }) => (
      <div className={classes.menuItemContent}>
        <img src={icon} alt="icon" className={classes.icon} />
        <div className={classes.menuItem}>
          <div className={classes.primaryItem}>{primaryText}</div>
          <div className={classes.secondaryItem}>{secondaryText}</div>
        </div>
      </div>
    )

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem component={MyLink} link={`/profile/${userId}${search}`}>
          My Profile
        </MenuItem>
        {/* <MenuItem component={MyLink} link="/study-circle"> */}
        {/* My Study Circle */}
        {/* </MenuItem> */}
        <MenuItem onClick={this.handleManageClasses}>
          Add/Remove Classes
        </MenuItem>
        {/* <MenuItem onClick={this.handleMenuClose}>Weekly Goals</MenuItem> */}
        {/* <MenuItem onClick={this.handleOpenHowEarnPoints}>
          How Do I Earn Points
        </MenuItem> */}
        <MenuItem onClick={this.handleBlockedUsers}>Unblock Users</MenuItem>
        <MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {width !== 'xs' && (
          <MenuItem
            onClick={this.handleNotificationOpen}
            aria-haspopup="true"
            aria-owns={open ? 'notifications-popper' : undefined}
          >
            <IconButton color="inherit">
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
        )}
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <Avatar src={userProfileUrl}>{initials}</Avatar>
          </IconButton>
          <p>Account</p>
        </MenuItem>
      </Menu>
    );

    const renderCreatePostMenu = (
      <Menu
        id="simple-menu"
        anchorEl={createPostAnchorEl}
        open={isCreatePostMenuOpen}
        onClose={this.handleCreatePostMenuClose}
      >
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link={`/create/notes${search}`}
        >
          <MenuItemContent
            primaryText="Share Notes"
            secondaryText="Earn 10k points for first page, 5k for second page, then more points for each page after"
            icon={Notes}
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link={`/create/question${search}`}
        >
          <MenuItemContent
            primaryText="Ask a Question"
            secondaryText="Earn 1k for answering a question, and 25k if your answer is chosen as Best Answer"
            icon={Questions}
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link={`/create/flashcards${search}`}
        >
          <Tooltip
            id={1194}
            placement="top"
            text="Create a set of flashcards now, and continue to edit them weekly as part of your studying for each class"
          >
            <MenuItemContent
              primaryText="Create Flashcards"
              secondaryText="Earn 5k points for the first 4 cards, then 2.5k for each card after"
              icon={FlashCards}
            />
          </Tooltip>
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link={`/create/sharelink${search}`}
        >
          <MenuItemContent
            primaryText="Share a Link"
            secondaryText="Earn 2k points for each link shared"
            icon={Links}
          />
        </MenuItem>
        <hr className={classes.hr} />
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/video-call"
        >
          <MenuItemContent
            primaryText="Video Meet-Up"
            secondaryText="Earn 20k points for starting a video meet-up, then 50k points after 10 minutes"
            icon={Videos}
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/reminders"
        >
          <MenuItemContent
            primaryText="Create a Reminder"
            secondaryText="Earn 300 points for creating a reminder, then 400 points for completing it"
            icon={Reminders}
          />
        </MenuItem>
      </Menu>
    );

    const { updateFeed, newClassExperience, userClasses } = this.props
    const courseDisplayName = this.getCourseDisplayName(userClasses.classList)

    const qs = queryString.parse(search)

    const openClassmatesDialog = () => this.setState({ openClassmates: true })
    const closeClassmatesDialog = () => this.setState({ openClassmates: false })

    const drawer = (
      <Fragment>
        <ClassmatesDialog
          close={closeClassmatesDialog}
          state={openClassmates}
          courseDisplayName={courseDisplayName}
        />
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List className={clsx(!runningTour && classes.drawerList)}>
          {/* TODO: move this to feed top */}
          {false && newClassExperience && courseDisplayName && <div className={classes.backHeader}>
            <Typography className={classes.backTitle}>{courseDisplayName}</Typography>
          </div>}
          <ListItem button className={`${classes.newItem} tour-onboarding-new`} onClick={this.handleCreatePostMenuOpen}>
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
          <HomeItem
            createPostOpen={createPostOpen}
            MyLink={MyLink}
            userClasses={userClasses}
            updateFeed={updateFeed}
            newClassExperience={newClassExperience}
            openClassmatesDialog={openClassmatesDialog}
          />
          {/* <ListItem button component={MyLink} link="/reminders">
            <ListItemIcon>
              <EventIcon className={classNames(pathname === '/reminders' && classes.currentRoute)} />
            </ListItemIcon>
            <ListItemText primary="Reminders"
            primaryTypographyProps={{ color: pathname === '/reminders' ? 'primary' : 'textPrimary' }}
            />
          </ListItem> */}
          <ListItem
            button
            component={MyLink}
            link="/leaderboard"
            className={classNames(
              'tour-onboarding-leaderboard',
              !qs.sectionId && ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath
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
          {/* <ListItem button component={MyLink} link="/video-call">
            <ListItemIcon>
              <DuoIcon className={classNames(pathname === '/video-call' && classes.currentRoute)}/>
            </ListItemIcon>
            <ListItemText primary="Video Meet Up"
            primaryTypographyProps={{ color: pathname === '/video-call' ? 'primary' : 'textPrimary' }}
            />
          </ListItem> */}
          {/* <ListSubheader>Help</ListSubheader> */}
          {/* <ListItem button onClick={onOpenAnnouncements}>
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Announcements" />
          </ListItem> */}
          {!newClassExperience && <div className={classes.myClasses}>
            <ListItemIcon>
              <GradCapIcon className={classNames("whiteSvg")} />
            </ListItemIcon>
            <ListItemText primary="My Classes" />
          </div>}
          {!newClassExperience && <ListItemText>
            <ClassList
              onClick={this.handleManageClasses}
            />
          </ListItemText>}
          <ListItem
            button
            onClick={this.handleOpenGetApp}
            className={classes.otherPath}
          >
            <ListItemIcon>
              <SystemUpdateIcon />
            </ListItemIcon>
            <ListItemText primary="Get the Mobile App" />
          </ListItem>
          <ListItem
            button
            onClick={this.handleOpenHowEarnPoints}
            className={classes.otherPath}
          >
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
        </List>
      </Fragment>
    );

    return (
      <Fragment>
        <div className={classes.root}>
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open
            })}
          >
            <Toolbar disableGutters={!open}>
              <Hidden smUp implementation="css">
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(classes.menuButton, {
                    [classes.hide]: open
                  })}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
              <Link href="/" component={MyLink} link="/">
                <img src={logo} alt="Logo" className={classes.logo} />
              </Link>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  color="inherit"
                  onClick={this.handleNotificationOpen}
                  aria-owns={open ? 'notifications-popper' : undefined}
                  aria-haspopup="true"
                >
                  <Badge badgeContent={unreadCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar src={userProfileUrl}>{initials}</Avatar>
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-haspopup="true"
                  onClick={this.handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMenu}
          {renderMobileMenu}
          {renderCreatePostMenu}
          <Hidden smUp implementation="css">
            <Drawer
              id='mobileMenu'
              variant="temporary"
              open={open && width === 'xs'}
              onClose={this.handleDrawerClose}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              id='desktopMenu'
              variant="permanent"
              className={classNames(
                classes.drawer,
                classes.drawerOpen,
              )}
              classes={{
                paper: classNames(
                  classes.drawerOpen
                )
              }}
              open={open}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        </div>
        <GetApp
          open={openGetApp}
          onClose={this.handleCloseGetApp}
        />
        <HowDoIEarnPoints
          open={openHowEarnPoints}
          onClose={this.handleCloseHowEarnPoints}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(withWidth()(withRouter(MainLayout)));
