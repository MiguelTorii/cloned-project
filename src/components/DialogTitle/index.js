// @flow

import React from 'react';
import type { Node } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {},
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  id?: string,
  variant?: string,
  children: Node,
  onClose?: Function
};

class DialogTitle extends React.PureComponent<Props> {
  static defaultProps = {
    id: '',
    variant: 'h6',
    onClose: () => {}
  };

  render() {
    const { classes, id, variant, children, onClose } = this.props;
    return (
      <MuiDialogTitle disableTypography id={id} className={classes.root}>
        <Typography variant={variant}>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  }
}

export default withStyles(styles)(DialogTitle);
