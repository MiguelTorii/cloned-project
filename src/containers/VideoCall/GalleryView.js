import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import Tooltip from 'containers/Tooltip'
// import { ReactComponent as FullScreenView } from 'assets/svg/fullscreen-view.svg';
import { ReactComponent as SpeakerView } from 'assets/svg/speaker-view.svg';
import { ReactComponent as GalleryView } from 'assets/svg/gallery-view.svg';
import { ReactComponent as SideBySideView } from 'assets/svg/side-by-side.svg';
import { ReactComponent as ViewChecked } from 'assets/svg/view-checked.svg';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  viewList: {
    backgroundColor: theme.circleIn.palette.appBar,
    color: theme.circleIn.palette.white,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    borderRadius: 10
  },
  viewListMenu: {
    marginTop: theme.spacing(1),
  },
  view: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewItem: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.circleIn.palette.brand
    }
  },
  checked: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing(2)
  }
}));

function GalleryViewMode({ onChange, currentView, isSharing }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isSharing) {
      onChange('speaker-view')
    }
  }, [onChange, isSharing])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const selctView = useCallback(value => () => {
    onChange(value)
    setAnchorEl(null);
  }, [onChange])

  const renderMenu = useMemo(() => (
    <MenuList>
      {isSharing
        ? <MenuItem
          onClick={selctView('side-by-side')}
          classes={{ root: classes.viewItem }}
        >
          <div className={classes.view}>
            <div className={classes.center}>
              <ListItemIcon>
                <SideBySideView />
              </ListItemIcon>
              <Typography variant="inherit">Side By Side</Typography>
            </div>
            {currentView === 'side-by-side' &&
                <div className={classes.checked}><ViewChecked /></div>}
          </div>
        </MenuItem>
        : <MenuItem
          onClick={selctView('gallery-view')}
          classes={{ root: classes.viewItem }}
        >
          <div className={classes.view}>
            <div className={classes.center}>
              <ListItemIcon>
                <GalleryView />
              </ListItemIcon>
              <Typography variant="inherit">Gallery</Typography>
            </div>
            {currentView === 'gallery-view' &&
            <div className={classes.checked}><ViewChecked /></div>}
          </div>
        </MenuItem>}
      <Tooltip
        id={9063}
        placement="right"
        variant="secondary"
        text="Change screen views here. You can also select different views when sharing screen."
        totalSteps={4}
        completedSteps={3}
        okButton="Nice!"
      >
        <MenuItem
          onClick={selctView('speaker-view')}
          classes={{ root: classes.viewItem }}
        >
          <div className={classes.view}>
            <div className={classes.center}>
              <ListItemIcon>
                <SpeakerView />
              </ListItemIcon>
              <Typography variant="inherit">Speaker</Typography>
            </div>
            {currentView === 'speaker-view' &&
                    <div className={classes.checked}><ViewChecked /></div>}
          </div>
        </MenuItem>
      </Tooltip>
      {/* <MenuItem
        onClick={selctView('fullscreen-view')}
        classes={{ root: classes.viewItem }}
      >
        <div className={classes.view}>
          <div className={classes.center}>
            <ListItemIcon>
              <FullScreenView />
            </ListItemIcon>
            <Typography variant="inherit">Fullscreen</Typography>
          </div>
          {currentView === 'fullscreen-view' &&
                  <div className={classes.checked}><ViewChecked /></div>}
        </div>
      </MenuItem> */}
    </MenuList>
  ), [classes.center, classes.checked, classes.view, classes.viewItem, currentView, isSharing, selctView])

  return (
    <div>
      <Button
        className={classes.viewList}
        variant="contained"
        color="secondary"
        aria-describedby={id}
        onClick={handleClick}
        startIcon={<GalleryView />}
      >
        View
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{
          root: classes.viewListMenu
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper>
          {renderMenu}
        </Paper>
      </Popover>
    </div>
  );
}

export default GalleryViewMode