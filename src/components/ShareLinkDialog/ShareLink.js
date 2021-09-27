// @flow

import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';

import GradientButton from 'components/Basic/Buttons/GradientButton';
import IconLink from 'assets/svg/ic_link.svg';
import { styles } from '../_styles/ShareLinkWidget';

type Props = {
  classes: Object,
  shareLink: string
};

const ShareLinkWidget = ({ classes, shareLink }: Props) => {
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const handleCopied = () => {
    setIsTooltipShown(true);

    setTimeout(() => {
      setIsTooltipShown(false);
    }, 3000);
  };

  return (
    <div className={classes.shareLinkContent}>
      <img alt="icon-link" src={IconLink} className={classes.img} />
      <Typography className={classes.link} variant="body2">
        {shareLink}
      </Typography>
      <CopyToClipboard text={shareLink} onCopy={handleCopied}>
        <Tooltip
          placement="top-end"
          title="Link Copied!"
          arrow
          open={isTooltipShown}
          classes={{
            popper: classes.popper,
            tooltip: classes.tooltip,
            arrow: classes.arrow
          }}
        >
          <GradientButton className={classes.copyLink}>Copy Link</GradientButton>
        </Tooltip>
      </CopyToClipboard>
    </div>
  );
};

export default withStyles(styles)(ShareLinkWidget);
