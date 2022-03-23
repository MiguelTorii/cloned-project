import { useState } from 'react';

import clsx from 'clsx';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import IconClip from 'assets/svg/clip.svg';
import IconLink from 'assets/svg/ic_link.svg';

import styles from './ShareLinkWidgetStyles';

type Props = {
  className?: string;
  classes: Record<string, any>;
  headerText?: string;
  shareLink?: string;
  isLoading?: boolean;
};

const ShareLinkWidget = ({
  classes,
  className,
  shareLink,
  headerText = 'Share a link',
  isLoading = false
}: Props) => {
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
              <img alt="icon-clip" src={IconClip} className={clsx(classes.img, classes.imgCopy)} />
            </Tooltip>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles as any)(ShareLinkWidget);
