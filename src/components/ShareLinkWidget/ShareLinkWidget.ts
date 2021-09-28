// @flow

import React, { useState } from 'react';
import cx from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import IconLink from 'assets/svg/ic_link.svg';
import IconClip from 'assets/svg/clip.svg';
import Tooltip from '@material-ui/core/Tooltip';
import { styles } from '../_styles/ShareLinkWidget';

type Props = {
  className: string,
  classes: Object,
  headerText: string,
  shareLink: string,
  isLoading: boolean
};

const ShareLinkWidget = (props: Props) => {
  const { className, classes, shareLink, headerText = 'Share a link', isLoading = false } = props;
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const handleCopied = () => {
    setIsTooltipShown(true);

    setTimeout(() => {
      setIsTooltipShown(false);
    }, 3000);
  };

  return (
    <div className={className}>
      <Typography className={classes.header} variant="body2">
        {headerText}
      </Typography>
      {isLoading ? (
        <div className={classes.content}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={classes.content}>
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
              <img alt="icon-clip" src={IconClip} className={cx(classes.img, classes.imgCopy)} />
            </Tooltip>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(ShareLinkWidget);
