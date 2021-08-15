/* eslint-disable react/jsx-props-no-spreading */
// @flow

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';
import { getCommunityTemplates, batchMessage } from 'api/community';
import { PERMISSIONS } from 'constants/common';
import { getChannelName } from 'utils/chat';
import * as chatActions from 'actions/chat';
import { enqueueSnackbar } from 'actions/notifications';
import { ReactComponent as ClassIcon } from 'assets/svg/class-book-icon.svg';
import { ReactComponent as HashTag } from 'assets/svg/hashtag-icon.svg';
import type { UserState } from 'reducers/user';
import type { ChatState } from 'reducers/chat';
import styles from 'components/_styles/CreateCommunityChatChannelInput/sendClass';
import MessageQuill from './MessageQuill';

type Props = {
  classes: Object,
  user: UserState,
  onClosePopover: Function,
  setCurrentCourse: Function,
  setCurrentCommunityChannel: Function,
  selectCurrentCommunity: Function,
  enqueueSnackbarAction: Function,
  chat: ChatState
};

const CreateChatChannelInput = ({
  classes,
  chat,
  user,
  onClosePopover,
  selectCurrentCommunity,
  enqueueSnackbarAction,
  setCurrentCourse
}: Props) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectChannel, setSelectedChannel] = useState('');
  const [templateChannels, setTemplateChannels] = useState([]);
  const [chatIds, setChatIds] = useState([]);
  const [channels, setChannels] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    data: { communityChannels, communities, local }
  } = chat;

  const {
    data: { userId }
  } = user;

  useEffect(() => {
    const getTemplateChannels = async () => {
      const channels = await getCommunityTemplates();
      if (channels.length) setTemplateChannels(channels);
    };
    getTemplateChannels();
  }, []);

  useEffect(() => {
    const selectedChannelIs = [];
    const selectedChannels = [];

    selectedClasses.forEach((selectedClass) => {
      const communityChannel = communityChannels.filter(
        (communityChanel) =>
          communityChanel.courseId === selectedClass.community.id
      );

      const { channels } = communityChannel[0];
      channels.forEach((channel) => {
        const { channels } = channel;

        channels.forEach((channel) => {
          if (getChannelName(channel.chat_name) === selectChannel) {
            selectedChannelIs.push(channel.chat_id);
            selectedChannels.push(channel);
          }
        });
      });
    });

    setChatIds(selectedChannelIs);
    setChannels(selectedChannels);
  }, [selectChannel, selectedClasses, communityChannels]);

  const currentCommunities = useMemo(
    () =>
      communities.filter(
        (community) =>
          community.permissions.indexOf(PERMISSIONS.ONE_TOUCH_SEND_CHAT) > -1
      ),
    []
  );

  const handleSelectedClasses = useCallback((e, options) => {
    setSelectedClasses(options);
  }, []);

  const handleSelectedChannel = useCallback((e, option) => {
    setSelectedChannel(option);
  }, []);

  const handleRTEChange = useCallback((updatedValue) => {
    if (
      updatedValue.trim() === '<p><br></p>' ||
      updatedValue.trim() === '<p>\n</p>'
    ) {
      setValue('');
    } else {
      const currentValue = updatedValue
        .replaceAll('<p><br></p>', '')
        .replaceAll('<p>\n</p>', '');
      setValue(currentValue);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await batchMessage({
        message: value,
        chatIds
      });
      setCurrentCourse(
        selectedClasses[selectedClasses.length - 1]?.community?.id
      );
      selectCurrentCommunity(channels[channels.length - 1]);
      setShowError(false);
      onClosePopover();
      setLoading(false);
      enqueueSnackbarAction({
        notification: {
          message: `You successfully sent a message to ${
            selectedClasses[selectedClasses.length - 1]?.community.name
          }: ${selectChannel}`,
          options: {
            variant: 'info',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 3000,
            ContentProps: {
              classes: {
                root: classes.snackbarStyle
              }
            }
          }
        }
      });
    } catch (e) {
      setShowError(true);
      setLoading(false);
      enqueueSnackbarAction({
        notification: {
          message: `There was an error sending your message to ${
            selectedClasses[selectedClasses.length - 1]?.community.name
          }: ${selectChannel}`,
          options: {
            variant: 'default',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 3000,
            ContentProps: {
              classes: {
                root: classes.snackbarStyle
              }
            }
          }
        }
      });
    }
  }, [
    value,
    local,
    channels,
    chatIds,
    onClosePopover,
    selectedClasses,
    setCurrentCourse,
    selectCurrentCommunity,
    enqueueSnackbarAction
  ]);

  const handleRetry = useCallback(() => {
    setShowError(false);
  }, []);

  return (
    <>
      <Typography className={classes.shortDescription}>
        Send a message to multiple classes in one-touch.
      </Typography>

      <Autocomplete
        multiple
        id="select-classes"
        options={currentCommunities}
        getOptionLabel={(option) => option.community.name}
        defaultValue={selectedClasses}
        noOptionsText="No Class"
        filterSelectedOptions
        classes={{
          root: classes.autoComplete,
          inputRoot: classes.inputRoot,
          noOptions: classes.noOptions
        }}
        onChange={handleSelectedClasses}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              classes={{
                root: classes.chip
              }}
              label={option.community.name}
              size="small"
              deleteIcon={<CloseIcon />}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <>
            <ClassIcon className={classes.classIcon} />
            <TextField
              {...params}
              className={
                selectedClasses.length
                  ? classes.selectClass
                  : classes.emptySelectedClass
              }
              variant="outlined"
              label={
                selectedClasses.length
                  ? 'Class'
                  : 'Select one or multiple classes'
              }
            />
          </>
        )}
      />
      <Autocomplete
        id="select-channel"
        options={templateChannels.map((option) => option.chat_name)}
        noOptionsText="No Channel"
        classes={{
          root: classes.autoComplete,
          inputRoot: classes.inputRoot,
          noOptions: classes.noOptions
        }}
        onChange={handleSelectedChannel}
        renderInput={(params) => (
          <>
            <HashTag className={classes.hashIcon} />
            <TextField
              {...params}
              className={cx(
                selectChannel ? classes.selectClass : classes.emptySelectedClass
              )}
              variant="outlined"
              label={selectChannel ? 'Channel' : 'Select a channel'}
            />
          </>
        )}
      />
      <MessageQuill
        onChange={handleRTEChange}
        setValue={setValue}
        userId={userId}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        width={1}
      >
        <div className={cx(showError ? classes.error : classes.nonError)}>
          <Typography
            component="p"
            variant="subtitle1"
            className={classes.errorMessage}
          >
            There was an error sending your message.
          </Typography>
        </div>
        <Button
          className={classes.cancelBtn}
          color="primary"
          onClick={onClosePopover}
        >
          Cancel
        </Button>
        {loading ? (
          <Button
            className={classes.createDM}
            classes={{
              disabled: classes.loadingDisable
            }}
            disabled={loading}
            variant="contained"
            startIcon={
              <CircularProgress className={classes.loading} color="secondary" />
            }
            color="primary"
          >
            Sending
          </Button>
        ) : (
          <Button
            className={cx(showError ? classes.disabled : classes.createDM)}
            classes={{
              disabled: classes.disabled
            }}
            disabled={!chatIds.length || value === ''}
            variant="contained"
            onClick={showError ? handleRetry : handleSubmit}
            startIcon={showError && <ReplayIcon />}
            color="primary"
          >
            {showError ? 'Retry' : 'Send Message'}
          </Button>
        )}
      </Box>
    </>
  );
};

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      closeNewChannel: chatActions.closeNewChannel,
      setCurrentCourse: chatActions.setCurrentCourse,
      setCurrentCommunityChannel: chatActions.setCurrentCommunityChannel,
      selectCurrentCommunity: chatActions.selectCurrentCommunity,
      enqueueSnackbarAction: enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateChatChannelInput));
