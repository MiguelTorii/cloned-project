// @flow
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';

import Dialog, { dialogStyle } from 'components/Dialog';
import { logEventLocally } from 'api/analytics';
import { getReferralProgram } from 'api/referral';

import Invite from './Invite';

const styles = theme => ({
  body: {
    padding: 16,
    width: '100%'
  },
  button: {
    width: '100%'
  },
  dialog: {
    ...dialogStyle,
    width: 500
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1,
    zIndex: 100000
  },
  text: {
    margin: '10px 0px'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

const CTA = ({
  classes,
  enqueueSnackbar,
}: {
  classes: Object,
  enqueueSnackbar: Function
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [referralProgram, setReferralProgram] = useState(null);

  useEffect(() => {
    const init = async () => {
      const result = await getReferralProgram();

      if (result) {
        setReferralProgram(result);
      }
    }

    init();
  }, []);

  const handleLinkCopied = () => {
    logEventLocally({
      category: 'Referral',
      objectId: (referralProgram && referralProgram.code) || '',
      type: 'Copied',
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

  if (!referralProgram || !referralProgram.is_visible) return null;

  const {
    code,
    cta,
    cta_body: ctaBody,
    cta_title: ctaTitle,
    img_url: imageUrl,
    title,
    subtitle
  } = referralProgram;

  return (
    <div className={classes.body}>
      <Typography className={classes.title}>
        {ctaTitle}
      </Typography>
      <Typography className={classes.text}>
        {ctaBody.split("\n").map((item) => {
          return (<span key={Math.random()}>{item}<br /></span>)
        })}
      </Typography>
      <Button
        className={classes.button}
        color='primary'
        onClick={() => setDialogOpen(true)}
        variant='contained'
      >
        {cta}
      </Button>
      <Dialog
        className={classes.dialog}
        onCancel={() => setDialogOpen(false)}
        open={dialogOpen}
      >
        <Invite
          imageUrl={imageUrl}
          link={`${window.location.host}/referral/${code}`}
          onLinkCopied={handleLinkCopied}
          subtitle={subtitle}
          title={title}
        />
      </Dialog>
    </div>
  );
}

export default withRouter(withSnackbar(withStyles(styles)(CTA)));