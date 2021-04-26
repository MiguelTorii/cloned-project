// @flow

import React, {useState} from 'react';
import cx from 'classnames';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import IconLink from 'assets/svg/ic_link.svg';
import IconClip from 'assets/svg/clip.svg';
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme) => ({
  header: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(3),
    backgroundColor: theme.circleIn.palette.appBar
  },
  img: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  imgCopy: {
    cursor: 'pointer'
  },
  link: {
    color: theme.circleIn.palette.textOffwhite,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  // @TODO: upcoming design system can reuse these styles
  popper: {
    filter: 'drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.25));',
  },
  tooltip: {
    fontSize: 14,
    fontWeight: 700,
    padding: '8px 12px',
    background: theme.circleIn.palette.tooltipBackground,
  },
  arrow: {
    left: 'auto !important',
    right: 4,
    color: theme.circleIn.palette.tooltipBackground,
  }
});

type Props = {
  className: string,
  classes: Object,
  headerText: string,
  shareLink: string,
  isLoading: boolean,
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
          <img src={IconLink} className={classes.img} />
          <Typography className={classes.link} variant="body2">
            {shareLink}
          </Typography>
          <CopyToClipboard text={shareLink} onCopy={handleCopied}>
            <Tooltip
              placement="top-end"
              title="Link Copied!"
              arrow={true}
              open={isTooltipShown}
              classes={{ popper: classes.popper, tooltip: classes.tooltip, arrow: classes.arrow }}
            >
              <img src={IconClip} className={cx(classes.img, classes.imgCopy)} />
            </Tooltip>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(ShareLinkWidget);
