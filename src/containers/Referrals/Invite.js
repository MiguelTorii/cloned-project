// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import { logEventLocally } from 'api/analytics';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import LoadImg from 'components/LoadImg/LoadImg';

const styles = (theme) => ({
  action: {
    color: theme.circleIn.palette.action,
    marginLeft: 20
  },
  body: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  dialog: {
    ...dialogStyle,
    width: 500
  },
  coupon: {
    alignItems: 'center',
    border: '1px #fefefe dashed',
    borderRadius: 20,
    cursor: 'pointer',
    display: 'flex',
    height: 40,
    justifyContent: 'space-between',
    margin: '20px 0px',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  }
});

type Props = {
  classes: Object,
  enqueueSnackbar: Function,
  onHide: Function,
  referralData: {
    code: string,
    imageUrl: string,
    subtitle: string,
    title: string
  },
  visible: boolean
};

const Invite = ({
  classes,
  enqueueSnackbar,
  onHide,
  referralData: { code, imageUrl, subtitle, title },
  visible
}: Props) => {
  const handleLinkCopied = () => {
    logEventLocally({
      category: 'Referral',
      objectId: code || '',
      type: 'Copied'
    });

    enqueueSnackbar('Link copied', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      autoHideDuration: 3000,
      ContentProps: {
        classes: {
          root: classes.stackbar
        }
      }
    });
  };

  const link = `${window.location.host}/referral/${code}`;

  return (
    <Dialog className={classes.dialog} onCancel={onHide} open={visible}>
      <div className={classes.body}>
        <LoadImg key={imageUrl} url={imageUrl} style={{ width: 200 }} />
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>
          {subtitle.split('\n').map((item) => (
              <span key={Math.random()}>
                {item}
                <br />
              </span>
            ))}
        </Typography>
        <CopyToClipboard text={link} onCopy={handleLinkCopied}>
          <div className={classes.coupon}>
            <p>{link}</p>
            <p className={classes.action}>Copy</p>
          </div>
        </CopyToClipboard>
      </div>
    </Dialog>
  );
};

export default withSnackbar(withStyles(styles)(Invite));
