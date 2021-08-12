/* eslint-disable react/jsx-props-no-spreading */
// @flow

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import { getCommunityTemplates } from 'api/community';
import { PERMISSIONS } from 'constants/common';
import * as chatActions from 'actions/chat';
import { ReactComponent as ClassIcon } from 'assets/svg/class-book-icon.svg';
import { ReactComponent as HashTag } from 'assets/svg/hashtag-icon.svg';
import type { UserState } from 'reducers/user';
import type { ChatState } from 'reducers/chat';
import MessageQuill from './MessageQuill';

const styles = (theme) => ({
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  autoComplete: {
    marginBottom: theme.spacing(2),
    position: 'relative'
  },
  inputRoot: {
    paddingLeft: `${theme.spacing(4)}px !important`
  },
  chip: {
    backgroundColor: 'rgb(196, 89, 96)',
    color: 'white',
    margin: theme.spacing(0, 0.5)
  },
  classIcon: {
    position: 'absolute',
    zIndex: 99,
    top: theme.spacing(2),
    left: theme.spacing()
  },
  hashIcon: {
    top: theme.spacing(2.5),
    left: theme.spacing(1.5),
    position: 'absolute',
    zIndex: 99
  },
  selectClass: {
    backgroundColor: '#2B2C2C',
    borderRadius: theme.spacing()
  },
  emptySelectedClass: {
    backgroundColor: '#2B2C2C',
    borderRadius: theme.spacing(),
    '& > label': {
      paddingLeft: theme.spacing(4)
    },
    '& .Mui-focused': {
      paddingLeft: 0
    }
  },
  shortDescription: {
    fontSize: 16,
    margin: theme.spacing(2)
  },
  noOptions: {
    color: 'white'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  onClosePopover: Function,
  onOpenChannel: Function,
  setIsOpen: Function,
  createMessage: Object,
  handleClearCreateMessage: Function,
  chat: ChatState,
  permission: Array,
  handleUpdateGroupName: Function
};

const CreateChatChannelInput = ({ classes, chat, user }: Props) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectChannel, setSelectedChannel] = useState('');
  const [templateChannels, setTemplateChannels] = useState([]);
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);

  const {
    data: { communityChannels, communities }
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
  // ONE_TOUCH_SEND_CHAT

  const currentCommunities = useMemo(
    () =>
      communities.filter(
        (community) =>
          community.permissions.indexOf(PERMISSIONS.REWARD_STORE_ACCESS) > -1
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
        filterSelectedOptions
        classes={{
          root: classes.autoComplete,
          inputRoot: classes.inputRoot
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
        freeSolo={!!templateChannels.length}
        options={templateChannels.map((option) => option.added)}
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
              className={
                selectChannel ? classes.selectClass : classes.emptySelectedClass
              }
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
        showError={showError}
      />
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
      closeNewChannel: chatActions.closeNewChannel
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateChatChannelInput));
