import React, { useState } from 'react';
import Dialog from '../Dialog';
import useStyles from './styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconLink from 'assets/svg/link.svg';
import LoadImg from '../LoadImg';
import GradientButton from '../Basic/Buttons/GradientButton';
import Tooltip from '@material-ui/core/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import withRoot from '../../withRoot';

type Props = {
  open: boolean,
  link: string,
  title: any,
  onClose: Function
};

const ShareLinkModal = (
  {
    open,
    link,
    title,
    onClose
  }: Props
) => {
  const classes = useStyles();
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const handleCopied = () => {
    setIsTooltipShown(true);

    setTimeout(() => {
      setIsTooltipShown(false);
    }, 3000);
  };

  const ShareButton = React.forwardRef((props, ref) => (
    <div {...props} ref={ref}>
      <GradientButton compact>Copy Link</GradientButton>
    </div>
  ));

  return (
    <Dialog
      open={open}
      onCancel={onClose}
      title="Share Link"
    >
      <div className={classes.root}>
        { title }
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          className={classes.linkContainer}
        >
          <Box display="flex">
            <Box mr={2}>
              <LoadImg url={IconLink}/>
            </Box>
            <Typography>
              { link }
            </Typography>
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
