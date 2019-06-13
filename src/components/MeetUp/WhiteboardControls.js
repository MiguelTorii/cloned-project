// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import CreateIcon from '@material-ui/icons/Create';
import TitleIcon from '@material-ui/icons/Title';
import SaveIcon from '@material-ui/icons/Save';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ColorLensIcon from '@material-ui/icons/ColorLens';
// import CategoryIcon from '@material-ui/icons/Category';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 900
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonFirst: {
    borderTopLeftRadius: 4
  },
  buttonLast: {
    borderBottomLeftRadius: 4
  },
  button: {
    height: 60,
    width: 60
  },
  iconXS: {
    height: 20,
    width: 20
  },
  iconSM: {
    height: 30,
    width: 30
  },
  iconMD: {
    height: 40,
    width: 40
  },
  iconLG: {
    height: 50,
    width: 50
  },
  iconXL: {
    height: 60,
    width: 60
  },
  menu: {
    marginRight: theme.spacing.unit
  },
  menuList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorLabel: {
    height: 40,
    width: 40,
    borderRadius: '50%'
  }
});

type Props = {
  classes: Object,
  onPencilChange: Function,
  onColorChange: Function,
  onErase: Function,
  onSave: Function,
  onText: Function,
  onClear: Function
};

type State = {
  openPencil: boolean,
  openColor: boolean
};

class WhiteboardControls extends React.PureComponent<Props, State> {
  state = {
    openPencil: false,
    openColor: false
  };

  handleToggle = name => () => {
    this.setState(state => ({ [name]: !state[name] }));
  };

  handleClose = name => event => {
    if (
      name === 'openPencil' &&
      this.pencilAnchorEl &&
      this.pencilAnchorEl.contains(event.target)
    ) {
      return;
    }

    if (
      name === 'openColor' &&
      this.colorAnchorEl &&
      this.colorAnchorEl.contains(event.target)
    ) {
      return;
    }

    this.setState({ [name]: false });
  };

  handlePencilChange = size => () => {
    const { onPencilChange } = this.props;
    this.handleToggle('openPencil');
    this.setState({ openPencil: false });
    onPencilChange(size);
  };

  handleColorChange = color => () => {
    const { onColorChange } = this.props;
    this.handleToggle('openColor');
    this.setState({ openColor: false });
    onColorChange(color);
  };

  colorAnchorEl: Object;

  pencilAnchorEl: Object;

  render() {
    const { classes, onErase, onText, onSave, onClear } = this.props;
    const { openPencil, openColor } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <ButtonBase
            color="primary"
            aria-label="pencil"
            buttonRef={node => {
              this.pencilAnchorEl = node;
            }}
            aria-owns={openPencil ? 'pencil-list-grow' : undefined}
            aria-haspopup="true"
            className={cx(classes.button, classes.buttonFirst)}
            onClick={this.handleToggle('openPencil')}
          >
            <CreateIcon />
          </ButtonBase>
          <Popper
            open={openPencil}
            anchorEl={this.pencilAnchorEl}
            placement="left"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="pencil-list-grow">
                <Paper className={classes.menu}>
                  <ClickAwayListener
                    onClickAway={this.handleClose('openPencil')}
                  >
                    <div className={classes.menuList}>
                      {[
                        { className: classes.iconXS, size: 1 },
                        { className: classes.iconSM, size: 2 },
                        { className: classes.iconMD, size: 4 },
                        { className: classes.iconLG, size: 8 },
                        { className: classes.iconXL, size: 16 }
                      ].map(item => (
                        <ButtonBase
                          key={item.className}
                          color="primary"
                          className={cx(classes.button)}
                          onClick={this.handlePencilChange(item.size)}
                        >
                          <CreateIcon className={item.className} />
                        </ButtonBase>
                      ))}
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <ButtonBase
            color="primary"
            aria-label="select-color"
            className={classes.button}
            buttonRef={node => {
              this.colorAnchorEl = node;
            }}
            aria-owns={openColor ? 'color-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle('openColor')}
          >
            <ColorLensIcon />
          </ButtonBase>
          <Popper
            open={openColor}
            anchorEl={this.colorAnchorEl}
            placement="left"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="color-list-grow">
                <Paper className={classes.menu}>
                  <ClickAwayListener
                    onClickAway={this.handleClose('openColor')}
                  >
                    <div className={classes.menuList}>
                      {[
                        'black',
                        'green',
                        'red',
                        'blue',
                        'yellow',
                        'purple',
                        'pink',
                        'brown'
                      ].map(item => (
                        <ButtonBase
                          key={item}
                          color="primary"
                          className={cx(classes.button)}
                          onClick={this.handleColorChange(item)}
                        >
                          <span
                            className={classes.colorLabel}
                            style={{ backgroundColor: item }}
                          />
                        </ButtonBase>
                      ))}
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Tooltip title="Eraser" placement="left">
            <ButtonBase
              color="primary"
              aria-label="eraser"
              className={cx(classes.button, classes.buttonLast)}
              onClick={onErase}
            >
              <CropPortraitIcon />
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Add Text" placement="left">
            <ButtonBase
              color="primary"
              aria-label="add-text"
              className={classes.button}
              onClick={onText}
            >
              <TitleIcon />
            </ButtonBase>
          </Tooltip>
          {/* <Tooltip title="Shapes" placement="left">
            <ButtonBase
              color="primary"
              aria-label="add-shape"
              className={classes.button}
            >
              <CategoryIcon />
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Import Image" placement="left">
            <ButtonBase
              color="primary"
              aria-label="import-image"
              className={classes.button}
            >
              <InsertPhotoIcon />
            </ButtonBase>
          </Tooltip> */}
          <Tooltip title="Save Canvas" placement="left">
            <ButtonBase
              color="primary"
              aria-label="export-canvas"
              className={classes.button}
              onClick={onSave}
            >
              <SaveIcon />
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Clear Screen" placement="left">
            <ButtonBase
              color="primary"
              aria-label="clear-canvas"
              className={classes.button}
              onClick={onClear}
            >
              <DeleteForeverIcon />
            </ButtonBase>
          </Tooltip>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(WhiteboardControls);
