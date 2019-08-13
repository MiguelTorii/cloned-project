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
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import RedeemIcon from '@material-ui/icons/Redeem';
import AddBoxIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
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
import HelpIcon from '@material-ui/icons/Help'
import logo from '../../assets/svg/circlein_logo.svg';
import HowDoIEarnPoints from '../HowDoIEarnPoints';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

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
    marginLeft: drawerWidth,
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
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 12,
      marginRight: 36
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
    maxWidth: 160
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
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1
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
    padding: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing.unit * 8
    }
  },
  currentRoute: {
    color: theme.palette.primary.main
  }
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
  onOpenLeaderboard: Function,
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
      onOpenLeaderboard,
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
          <ListItemText inset primary="Ask a Question" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="1,000 points for best answer"/>
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
          <ListItemText inset primary="Upload Notes" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="500 points for initial page, 100 points for each additional page"/>
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
          <ListItemText inset primary="Share Link" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="200 - 500 points" />
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
          <ListItemText inset primary="Create Flashcards" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="500 points" />
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
          <ListItemText inset primary="Video Meet Up" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="250 points" />
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
          <ListItemText inset primary="Create Reminders" secondaryTypographyProps={{variant: "caption", color: "textPrimary"}} secondary="20 points" />
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
        <Divider />
        <List>
          <ListItem button onClick={this.handleCreatePostMenuOpen}>
            <ListItemIcon>
              <AddBoxIcon className={classNames(pathname.includes('/create') && classes.currentRoute)} />
            </ListItemIcon>
            <ListItemText primary="Create Post"
            primaryTypographyProps={{ color: pathname.includes('/create') ? 'primary' : 'textPrimary' }}
            />
          </ListItem>
          <Divider light />
          <ListItem button component={MyLink} link="/">
            <ListItemIcon>
              <HomeIcon className={classNames(pathname === '/' && classes.currentRoute)} />
            </ListItemIcon>
            <ListItemText primary="Home" primaryTypographyProps={{ color: pathname === '/' ? 'primary' : 'textPrimary' }} />
          </ListItem>
          <ListItem button component={MyLink} link="/feed">
            <ListItemIcon>
              <ViewListIcon className={classNames(pathname === '/feed' && classes.currentRoute)} />
            </ListItemIcon>
            <ListItemText
              primary="Feed"
              primaryTypographyProps={{ color: pathname === '/feed' ? 'primary' : 'textPrimary' }}
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
          <ListItem button onClick={onOpenLeaderboard}>
            <ListItemIcon>
              <RedeemIcon />
            </ListItemIcon>
            <ListItemText primary="Leaderboard" />
          </ListItem>
          <ListItem button component={MyLink} link="/store">
            <ListItemIcon>
              <StoreIcon className={classNames(pathname === '/store' && classes.currentRoute)}/>
            </ListItemIcon>
            <ListItemText primary="Store"
            primaryTypographyProps={{ color: pathname === '/store' ? 'primary' : 'textPrimary' }}
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
          <ListItem button onClick={this.handleOpenHowEarnPoints}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="How Do I Earn Points" />
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
              variant="permanent"
              className={classNames(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open
              })}
              classes={{
                paper: classNames({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open
                })
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
