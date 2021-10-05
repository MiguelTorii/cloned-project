import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CreateChatChannelDialog from '../../components/CreateChatChannelDialog/CreateChatChannelDialog';
import { searchUsers } from '../../api/user';
import { addGroupMembers } from '../../api/chat';
import AddUserIcon from '../../assets/svg/add-user.svg';
import { getInitials } from '../../utils/chat';

const useStyles = makeStyles((theme) => ({
  addLabel: {
    color: theme.circleIn.palette.textNormalButton,
    fontSize: 14,
    fontWeight: 700
  },
  addButton: {
    minWidth: 164,
    background: 'linear-gradient(180deg, #94DAF9 17.71%, #1E88E5 90.44%)',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
    borderRadius: 100,
    border: `1px solid ${theme.circleIn.palette.brand}`
  },
  addMembers: {
    marginBottom: theme.spacing(1.5)
  }
}));

const AddMembers = ({ userId, schoolId, channel, members }) => {
  const classes: any = useStyles();
  const [channelType, setChannelType] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleCreateChannelClose = useCallback(() => setChannelType(null), []);
  const handleCreateChannelOpen = useCallback(() => setChannelType('group'), []);
  const handleLoadOptions = useCallback(
    async ({ query, from }) => {
      if (query.trim() === '' || query.trim().length < 3) {
        return {
          options: [],
          hasMore: false
        };
      }

      const users = await searchUsers({
        userId,
        query,
        schoolId: from === 'school' ? Number(schoolId) : undefined
      });
      const memberIds = members.map((m) => Number(m.id));
      const options = users
        .map((user) => {
          const name = `${user.firstName} ${user.lastName}`;
          const initials = getInitials(name);
          return {
            value: user.userId,
            label: name,
            school: user.school,
            grade: user.grade,
            avatar: user.profileImageUrl,
            initials,
            userId: String(user.userId),
            firstName: user.firstName,
            lastName: user.lastName,
            relationship: user.relationship
          };
        })
        .filter((o) => !memberIds.includes(o.value));
      return {
        options,
        hasMore: false
      };
    },
    [userId, schoolId, members]
  );
  const onSubmit = useCallback(
    async ({ selectedUsers }) => {
      setLoading(true);

      try {
        await addGroupMembers({
          chatId: channel.sid,
          users: selectedUsers.map((user) => Number(user.userId))
        });
      } finally {
        setLoading(false);
        handleCreateChannelClose();
      }
    },
    [channel, handleCreateChannelClose]
  );
  return (
    <Grid
      container
      justifyContent="center"
      classes={{
        root: classes.addMembers
      }}
    >
      <Button
        onClick={handleCreateChannelOpen}
        variant="outlined"
        startIcon={<img src={AddUserIcon} alt="Add user" />}
        classes={{
          label: classes.addLabel,
          root: classes.addButton
        }}
      >
        Add a classmate
      </Button>
      <CreateChatChannelDialog
        title="Add Members"
        chatType={channelType}
        onClose={handleCreateChannelClose}
        onLoadOptions={handleLoadOptions}
        onSubmit={onSubmit}
        isLoading={loading}
        okLabel="Add"
      />
    </Grid>
  );
};

export default AddMembers;
