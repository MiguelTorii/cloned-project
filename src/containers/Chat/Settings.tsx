import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import EditGroupDetailsDialog from "containers/Chat/EditGroupDetailsDialog";
import RemoveStudentDialog from "components/RemoveStudentDialog/RemoveStudentDialog";
import { PERMISSIONS } from "constants/common";
const useStyles = makeStyles(theme => ({
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
  settingsIcon: {
    cursor: 'pointer'
  },
  selectOption: {
    width: 250,
    padding: theme.spacing(1.5, 2),
    background: theme.circleIn.palette.feedBackground,
    cursor: 'pointer',
    '&:hover': {
      background: theme.circleIn.palette.modalBackground
    }
  },
  reportIssue: {
    color: theme.circleIn.palette.danger
  }
}));
type Props = {
  channel: Record<string, any>;
  localChannel: Record<string, any>;
  permission: Record<string, any>;
  updateGroupName: (...args: Array<any>) => any;
  currentUserName: string;
};

const Settings = ({
  channel,
  groupName,
  permission,
  updateGroupName,
  localChannel,
  currentUserName
}: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editGroupDetailsOpen, setEditGroupDetailsOpen] = useState(false);
  const [removeStudentsModalOpen, setRemoveStudentsModalOpen] = useState(false);
  const handleEditGroupDetailsClose = useCallback(() => setEditGroupDetailsOpen(false), []);
  const handleEditGroupDetailsOpen = useCallback(() => setEditGroupDetailsOpen(true), []);
  const handleRemoveStudents = useCallback(() => setRemoveStudentsModalOpen(true), []);
  const handleRemoveStudentModalClose = useCallback(() => setRemoveStudentsModalOpen(false), []);
  const handleSettingsOpen = useCallback(event => {
    const {
      currentTarget
    } = event;
    setAnchorEl(currentTarget);
  }, [setAnchorEl]);
  const handleSettingsClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);
  useEffect(() => {
    setAnchorEl(null);
  }, [editGroupDetailsOpen, setAnchorEl]);
  const isShow = permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) && permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS);
  const deletePermission = permission.includes(PERMISSIONS.REMOVE_USER_GROUP_CHAT_ACCESS);
  return <>
      {isShow && <SettingsIcon onClick={handleSettingsOpen} className={classes.settingsIcon} />}
      <Popover id="settings-option-popper" open={isShow && Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleSettingsClose} anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }} transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}>
        {isShow && channel.members._c.size !== 2 && <>
            <ListItem className={classes.selectOption} onClick={handleEditGroupDetailsOpen}>
              <ListItemText>Edit Group Details</ListItemText>
            </ListItem>
            {deletePermission && <ListItem className={classes.selectOption} onClick={handleRemoveStudents}>
                <ListItemText>Remove Students</ListItemText>
              </ListItem>}
          </>}
        {
        /* <ListItem className={cx(classes.selectOption, classes.reportIssue)}>
         <ListItemText>
           Report Issue
         </ListItemText>
        </ListItem> */
      }
      </Popover>
      <RemoveStudentDialog open={removeStudentsModalOpen} channel={channel} onClose={handleRemoveStudentModalClose} currentUserName={currentUserName} members={localChannel?.members} />
      <EditGroupDetailsDialog title="Edit Group Details" channel={channel} localChannel={localChannel} open={editGroupDetailsOpen} updateGroupName={updateGroupName} onClose={handleEditGroupDetailsClose} />
    </>;
};

export default Settings;