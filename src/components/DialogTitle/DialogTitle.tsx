import React from 'react';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { styles } from '../_styles/DialogTitle';

type Props = {
  classes: Record<string, any>;
  id?: string;
  variant?: string;
  children: React.ReactNode;
  onClose?: (...args: Array<any>) => any;
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
        <Typography variant={variant as any} align="center">
          {children}
        </Typography>
        {onClose ? (
          <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  }
}

export default withStyles(styles as any)(DialogTitle);
