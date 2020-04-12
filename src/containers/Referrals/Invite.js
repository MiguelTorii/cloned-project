// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import LoadImg from 'components/LoadImg';

const styles = theme => ({
  action: {
    color: theme.circleIn.palette.action
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    padding: 10,
    width: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  }
})

type Props = {
  classes: Object,
  imageUrl: string,
  link: string,
  onLinkCopied: Function,
  subtitle: string,
  title: string
};

const Invite = ({ classes, imageUrl, link, onLinkCopied, subtitle, title }: Props ) => {
  return (
    <div className={classes.body}>
      <LoadImg key={imageUrl} url={imageUrl} style={{ width: 200 }} />
      <Typography className={classes.title}>
        {title}
      </Typography>
      <Typography className={classes.subtitle}>
        {subtitle}
      </Typography>
      <CopyToClipboard text={link} onCopy={onLinkCopied}>
        <div className={classes.coupon}>
          <p>{link}</p>
          <p className={classes.action}>Copy</p>
        </div>
      </CopyToClipboard>
    </div>
  )
};

export default withStyles(styles)(Invite);