// @flow
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import DrawerMenu from 'components/MainLayout/Drawer'
import CreatePostMenu from 'components/MainLayout/CreatePostMenu'
import MobileMenu from 'components/MainLayout/MobileMenu'
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx'
import GetAppDialog from 'components/GetAppDialog';
import { withRouter } from 'react-router';
import QuickNotes from 'containers/QuickNotes'
import logo from '../../assets/svg/circlein_logo.svg';
import './currentRoute.css'
import UseCases from '../UseCases';
import Dialog from '../Dialog';
import HowDoIEarnPoints from '../HowDoIEarnPoints';
import GiveFeedback from '../../containers/GiveFeedback'
import Tooltip from '../../containers/Tooltip';
import { AnnouncementBanner } from '../../containers/Announcements';

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
  root: {
    display: 'flex',
  },
  marginChat: {
    margin: theme.spacing()
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
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
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(8)
    }
  },

  myClasses: {
    display: 'flex',
    marginLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
  backContainer: {
    cursor: 'pointer'
  },
});

type Props = {
  classes: Object,
  helpLink: string,
  width: string,
  userId: string,
  initials: string,
  userProfileUrl: string,
  children: any,
  unreadCount: number,
  unreadMessages: number,
  pathname: string,
  handleNotificationOpen: Function,
  handleSignOut: Function,
  onManageClasses: Function,
  userClasses: Object,
  onManageBlockedUsers: Function,
  newClassExperience: boolean,
  landingPageCampaign: boolean,
  updateFeed: Function,
  location: {
    search: string
  }
};

type State = {
  announcementLoaded: boolean,
  open: boolean,
  anchorEl: ?string,
  mobileMoreAnchorEl: ?string,
  createPostAnchorEl: ?string,
  openGetApp: boolean,
  openHowEarnPoints: boolean,
  openUseCases: boolean,
  createPostOpen: boolean
};

class MainLayout extends React.Component<Props, State> {
  state = {
    open: false,
    anchorEl: null,
    mobileMoreAnchorEl: null,
    createPostAnchorEl: null,
    openGetApp: false,
    openFeedback: false,
    openHowEarnPoints: false,
    openUseCases: false,
    createPostOpen: false
  };

  constructor(props) {
    super(props);
    this.appBarRef = React.createRef();
  }

  handleAnnouncementLoaded = () => {
    // this.setState({ announcementLoaded: true });
  }

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

  handleOpenReferralStatus = () => {
    const { onOpenReferralStatus } = this.props;
    this.handleMenuClose();
    onOpenReferralStatus();
  };

  handleReferralStatus = () => {
    const { onManageBlockedUsers } = this.props;
    this.handleMenuClose();
    onManageBlockedUsers();
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

  handleOpenFeedback = () => {
    this.setState({ openFeedback: true });
    this.handleMenuClose();
  };

  handleCloseFeedback = () => {
    this.setState({ openFeedback: false });
  };

  handleOpenHowEarnPoints = () => {
    const { helpLink } = this.props
    if (helpLink) {
      window.open(helpLink, '_blank')
    } else {
      this.setState({ openHowEarnPoints: true });
      this.handleMenuClose();
    }
  };

  handleCloseHowEarnPoints = () => {
    this.setState({ openHowEarnPoints: false });
  };

  handleOpenUseCases = () => {
    this.setState({ openUseCases: true });
    this.handleMenuClose();
  };

  handleCloseUseCases = () => {
    this.setState({ openUseCases: false });
  };

  render() {
    const {
      open,
      anchorEl,
      createPostOpen,
      mobileMoreAnchorEl,
      createPostAnchorEl,
      openGetApp,
      openFeedback,
      openHowEarnPoints,
      openUseCases
    } = this.state;
    const {
      classes,
      userId,
      initials,
      userProfileUrl,
      width,
      children,
      unreadCount,
      unreadMessages,
      location: { search = '' },
      pathname,
    } = this.props;

    let appBarHeight = 0;

    if (this.appBarRef.current && this.appBarRef.current.clientHeight) {
      appBarHeight = this.appBarRef.current.clientHeight;
    }

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isCreatePostMenuOpen = Boolean(createPostAnchorEl);

    const { updateFeed, newClassExperience, userClasses, landingPageCampaign, newNotesScreen } = this.props

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
        {userClasses.canAddClasses && <MenuItem onClick={this.handleManageClasses}>
          Add/Remove Classes
        </MenuItem>}
        <MenuItem onClick={this.handleBlockedUsers}>Unblock Users</MenuItem>
        <MenuItem onClick={this.handleOpenReferralStatus}>Referred Classmates</MenuItem>
        <MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        MyLink={MyLink}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={this.handleMobileMenuClose}
        handleNotificationOpen={this.handleNotificationOpen}
        open={open}
        unreadMessages={unreadMessages}
        width={width}
        unreadCount={unreadCount}
        handleProfileMenuOpen={this.handleProfileMenuOpen}
        initials={initials}
        userProfileUrl={userProfileUrl}
      />
    );

    const renderCreatePostMenu = (
      <CreatePostMenu
        MyLink={MyLink}
        createPostAnchorEl={createPostAnchorEl}
        isCreatePostMenuOpen={isCreatePostMenuOpen}
        search={search}
        handleCreatePostMenuClose={this.handleCreatePostMenuClose}
      />
    )

    const drawer = (
      <DrawerMenu
        handleCreatePostMenuOpen={this.handleCreatePostMenuOpen}
        appBarHeight={appBarHeight}
        updateFeed={updateFeed}
        newNotesScreen={newNotesScreen}
        newClassExperience={newClassExperience}
        createPostOpen={createPostOpen}
        handleOpenGetApp={this.handleOpenGetApp}
        handleOpenFeedback={this.handleOpenFeedback}
        MyLink={MyLink}
        search={search}
        pathname={pathname}
        handleManageClasses={this.handleManageClasses}
        handleOpenUseCases={this.handleOpenUseCases}
        handleOpenHowEarnPoints={this.handleOpenHowEarnPoints}
        landingPageCampaign={landingPageCampaign}
        userClasses={userClasses}
      />
    )

    return (
      <Fragment>
        <div className={clsx(classes.root, pathname !== '/chat' && classes.marginChat)}>
          <AppBar
            ref={this.appBarRef}
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
                <QuickNotes />
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
                <Tooltip
                  id={3292}
                  placement="left"
                  text="Setup a group chat with your class to connect on topics and discuss problems"
                >
                  <IconButton
                    color="inherit"
                    component={MyLink}
                    link='/chat'
                  >
                    <Badge badgeContent={unreadMessages} color="secondary">
                      <ChatIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar className='avatar-menu' src={userProfileUrl}>{initials}</Avatar>
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
            <AnnouncementBanner onLoaded={this.handleAnnouncementLoaded} />
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
          {pathname !== '/chat' && <Hidden xsDown implementation="css">
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
          </Hidden>}
          <main className={classes.content} style={{ marginTop: appBarHeight }}>
            {children}
          </main>
        </div>
        <GetAppDialog
          open={openGetApp}
          onClose={this.handleCloseGetApp}
        />
        <GiveFeedback
          origin='Side Menu'
          open={openFeedback}
          onClose={this.handleCloseFeedback}
        />
        <HowDoIEarnPoints
          open={openHowEarnPoints}
          onClose={this.handleCloseHowEarnPoints}
        />
        <Dialog
          open={openUseCases}
          onCancel={this.handleCloseUseCases}
          title="How to use CircleIn for Studying"
        >
          <UseCases onRedirect={this.handleCloseUseCases} landingPageCampaign={landingPageCampaign} />
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withWidth()(withRouter(MainLayout)));
