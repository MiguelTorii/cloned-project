// @flow
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
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
import ViewListIcon from '@material-ui/icons/ViewList';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DuoIcon from '@material-ui/icons/Duo';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LanguageIcon from '@material-ui/icons/Language';
import StoreIcon from '@material-ui/icons/Store';
// import AnnouncementIcon from '@material-ui/icons/Announcement';
import EventIcon from '@material-ui/icons/Event';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import HelpOutline from '@material-ui/icons/HelpOutline';
import logo from '../../assets/svg/circlein_logo.svg';
// $FlowIgnore
import { ReactComponent as LeaderboardIcon } from '../../assets/svg/ic_leaderboard.svg';
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';
import './currentRoute.css'
import HowDoIEarnPoints from '../HowDoIEarnPoints';

const MyLink = React.forwardRef(({ link, ...props }, ref) => <RouterLink to={link} {...props} ref={ref} />);

const drawerWidth = 240;

const styles = theme => ({
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
    width: drawerWidth
  },
  drawerOpen: {
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
    margin: theme.spacing(2),
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  otherPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(2),
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
});

type Props = {
  classes: Object,
  width: string,
  userId: string,
  initials: string,
  userProfileUrl: string,
  children: any,
  unreadCount: number,
  pathname: string,
  handleNotificationOpen: Function,
  handleSignOut: Function,
  onManageClasses: Function,
  onManageBlockedUsers: Function,
  // onOpenLeaderboard: Function
  // onOpenAnnouncements: Function
};

type State = {
  open: boolean,
  anchorEl: ?string,
  mobileMoreAnchorEl: ?string,
  createPostAnchorEl: ?string,
  openHowEarnPoints: boolean
};

class MainLayout extends React.Component<Props, State> {
  state = {
    open: false,
    anchorEl: null,
    mobileMoreAnchorEl: null,
    createPostAnchorEl: null,
    openHowEarnPoints: false
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
    this.setState({ createPostAnchorEl: event.currentTarget });
  };

  handleCreatePostMenuClose = () => {
    this.setState({ createPostAnchorEl: null });
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

  handleOpenHowEarnPoints = () => {
    this.setState({ openHowEarnPoints: true });
    this.handleMenuClose();
  };

  handleCloseHowEarnPoints = () => {
    this.setState({ openHowEarnPoints: false });
  };

  render() {
    const {
      open,
      anchorEl,
      mobileMoreAnchorEl,
      createPostAnchorEl,
      openHowEarnPoints
    } = this.state;
    const {
      classes,
      userId,
      initials,
      userProfileUrl,
      width,
      children,
      unreadCount,
      pathname,
      // onOpenLeaderboard
      // onOpenAnnouncements
    } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isCreatePostMenuOpen = Boolean(createPostAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem component={MyLink} link={`/profile/${userId}`}>
          My Profile
        </MenuItem>
        <MenuItem component={MyLink} link="/study-circle">
          My Study Circle
        </MenuItem>
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
          link="/create/question"
        >
          <ListItemIcon>
            <ContactSupportIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Ask a Question"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="1K for replying with an answer, 25K points for being selected as best answer"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/create/notes"
        >
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Upload Notes"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="10K points for initial page, 5K for second page and more points for more pages"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/create/sharelink"
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Share Link"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="2K points"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/create/flashcards"
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Create Flashcards"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="5K points for first 4 cards, 2.5K points more per cards"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/video-call"
        >
          <ListItemIcon>
            <DuoIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Video Meet Up"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="20K points for initiating a session, 50K additional points after a 10-minute session"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={this.handleCreatePostMenuClose}
          component={MyLink}
          link="/reminders"
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText
            inset
            primary="Create Reminders"
            secondaryTypographyProps={{
              variant: 'caption',
              color: 'textPrimary'
            }}
            secondary="300 points for creating, 400 points for completing"
          />
        </MenuItem>
      </Menu>
    );

    const drawer = (
      <Fragment>
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <ListItem button className={classes.newItem} onClick={this.handleCreatePostMenuOpen}>
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
          <ListItem 
            button 
            component={MyLink} 
            link="/"
            className={classNames(
              ['/', '/feed'].includes(pathname) ? classes.currentPath : classes.otherPath
            )}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText
              primary="Study"
            />
          </ListItem>
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
              ['/leaderboard'].includes(pathname) ? classes.currentPath : classes.otherPath
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
          <ListItem 
            button 
            onClick={this.handleManageClasses}
            className={classes.otherPath}
          >
            <ListItemIcon>
              <GradCapIcon className={classNames("whiteSvg")} />
            </ListItemIcon>
            <ListItemText primary="Add/Remove Classes" />
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
        <HowDoIEarnPoints
          open={openHowEarnPoints}
          onClose={this.handleCloseHowEarnPoints}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(withWidth()(MainLayout));
