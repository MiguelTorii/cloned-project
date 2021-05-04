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

import { styles } from '../_styles/MeetUp/WhiteboardControls';

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
  openColor: boolean,
  openErase: boolean
};

class WhiteboardControls extends React.PureComponent<Props, State> {
  state = {
    openPencil: false,
    openColor: false,
    openErase: false
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

    if (
      name === 'openErase' &&
      this.eraseAnchorEl &&
      this.eraseAnchorEl.contains(event.target)
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

  handleEraseChange = size => () => {
    const { onErase } = this.props;
    this.handleToggle('openErase');
    this.setState({ openErase: false });
    onErase(size);
  };

  colorAnchorEl: Object;

  pencilAnchorEl: Object;

  eraseAnchorEl: Object;

  render() {
    const { classes, onText, onSave, onClear } = this.props;
    const { openPencil, openColor, openErase } = this.state;

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
          <ButtonBase
            color="primary"
            aria-label="eraser"
            className={cx(classes.button, classes.buttonLast)}
            buttonRef={node => {
              this.eraseAnchorEl = node;
            }}
            aria-owns={openErase ? 'erase-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle('openErase')}
          >
            <CropPortraitIcon />
          </ButtonBase>
          <Popper
            open={openErase}
            anchorEl={this.eraseAnchorEl}
            placement="left"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="erase-list-grow">
                <Paper className={classes.menu}>
                  <ClickAwayListener
                    onClickAway={this.handleClose('openErase')}
                  >
                    <div className={classes.menuList}>
                      {[
                        { className: classes.iconXS, size: 2 },
                        { className: classes.iconSM, size: 4 },
                        { className: classes.iconMD, size: 8 },
                        { className: classes.iconLG, size: 16 },
                        { className: classes.iconXL, size: 32 }
                      ].map(item => (
                        <ButtonBase
                          key={item.className}
                          color="primary"
                          className={cx(classes.button)}
                          onClick={this.handleEraseChange(item.size)}
                        >
                          <CropPortraitIcon className={item.className} />
                        </ButtonBase>
                      ))}
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
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
