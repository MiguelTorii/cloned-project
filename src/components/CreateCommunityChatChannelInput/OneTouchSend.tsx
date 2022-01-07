import React, { useCallback } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiTabs from '../Tabs/TabPanel';
import styles from '../_styles/CreateCommunityChatChannelInput/oneTouchSend';
import SendStudent from './SendStudent';
import SendClass from './SendClass';

type Props = {
  classes?: Record<string, any>;
  onClosePopover?: (...args: Array<any>) => any;
  onOpenChannel?: (...args: Array<any>) => any;
  setIsOpen?: (...args: Array<any>) => any;
  createMessage?: Record<string, any>;
  handleClearCreateMessage?: (...args: Array<any>) => any;
  permission?: Array<any>;
  handleUpdateGroupName?: (...args: Array<any>) => any;
};

const CreateChatChannelInput = ({
  classes,
  onClosePopover,
  onOpenChannel,
  setIsOpen,
  permission,
  createMessage,
  handleClearCreateMessage,
  handleUpdateGroupName
}: Props) => {
  const sendStudent = useCallback(
    () => (
      <SendStudent
        onOpenChannel={onOpenChannel}
        setIsOpen={setIsOpen}
        permission={permission}
        createMessage={createMessage}
        handleClearCreateMessage={handleClearCreateMessage}
        handleUpdateGroupName={handleUpdateGroupName}
        onClosePopover={onClosePopover}
      />
    ),
    [onOpenChannel, setIsOpen]
  );
  const oneTouchSend = useCallback(() => <SendClass onClosePopover={onClosePopover} />, []);
  return (
    <>
      <div className={classes.header}>
        <Typography className={classes.typography} variant="h6">
          Select Students or Classes
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClosePopover} />
      </div>

      <MuiTabs firstTab={() => sendStudent()} secondTab={() => oneTouchSend()} />
    </>
  );
};

export default withStyles(styles as any)(CreateChatChannelInput);
