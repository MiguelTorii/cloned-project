import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Dialog from '../Dialog/Dialog';
import { styles } from '../_styles/ShareDialog';

type Props = {
  classes: Record<string, any>;
  open: boolean;
  isLoading: boolean;
  link: string;
  onClose: (...args: Array<any>) => any;
  onLinkCopied: (...args: Array<any>) => any;
};
type State = {};

class ShareDialog extends React.PureComponent<Props, State> {
  render() {
    const { classes, open, link, isLoading, onLinkCopied, onClose } = this.props;
    return (
      <Dialog
        ariaDescribedBy="share-dialog-description"
        onCancel={onClose}
        open={open}
        title="Share this Post"
      >
        <Typography variant="h6" id="share-dialog-description" color="textPrimary">
          Copy this link and send it to your classmates.
        </Typography>
        <div className={classes.content}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Fragment>
              <div className={classes.link}>
                <Typography variant="subtitle1">{link}</Typography>
              </div>
              <CopyToClipboard text={link} onCopy={onLinkCopied}>
                <Button variant="contained" color="primary" autoFocus>
                  <FileCopyIcon className={classes.icon} />
                  Copy
                </Button>
              </CopyToClipboard>
            </Fragment>
          )}
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles as any)(ShareDialog);
