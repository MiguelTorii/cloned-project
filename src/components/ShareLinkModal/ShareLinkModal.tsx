import React, { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import IconLink from 'assets/svg/link.svg';
import withRoot from 'withRoot';

import GradientButton from '../Basic/Buttons/GradientButton';
import Dialog from '../Dialog/Dialog';
import LoadImg from '../LoadImg/LoadImg';

import useStyles from './styles';

type Props = {
  open: boolean;
  link: string;
  title: any;
  onClose: (...args: Array<any>) => any;
};

const ShareLinkModal = ({ open, link, title, onClose }: Props) => {
  const classes: any = useStyles();
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const handleCopied = () => {
    setIsTooltipShown(true);
    setTimeout(() => {
      setIsTooltipShown(false);
    }, 3000);
  };

  const ShareButton = React.forwardRef<any, any>((props, ref) => (
    <div {...props} ref={ref}>
      <GradientButton compact>Copy Link</GradientButton>
    </div>
  ));
  return (
    <Dialog open={open} onCancel={onClose} title="Share Link">
      <div className={classes.root}>
        {title}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          className={classes.linkContainer}
        >
          <Box display="flex">
            <Box mr={2}>
              <LoadImg url={IconLink} />
            </Box>
            <Typography>{link}</Typography>
          </Box>
          <CopyToClipboard text={link} onCopy={handleCopied}>
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
              <ShareButton />
            </Tooltip>
          </CopyToClipboard>
        </Box>
      </div>
    </Dialog>
  );
};

export default withRoot(ShareLinkModal);
