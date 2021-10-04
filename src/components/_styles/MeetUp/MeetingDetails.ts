export const styles = theme => ({
  meetingDetails: {
    position: 'absolute',
    bottom: 120,
    left: theme.spacing(3),
    maxWidth: 300,
    borderRadius: 20,
    zIndex: 10
  },
  detailContent: {
    width: '100%',
    padding: theme.spacing(2)
  },
  header: {
    color: theme.circleIn.palette.white
  },
  description: {
    color: theme.circleIn.palette.white,
    marginTop: theme.spacing()
  },
  inviteMembers: {
    backgroundColor: theme.circleIn.palette.greenInvite,
    border: `1px solid ${theme.circleIn.palette.greenInvite}`,
    boxSizing: 'border-box',
    borderRadius: 10,
    color: theme.circleIn.palette.white,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.greenInvite,
      color: theme.circleIn.palette.white
    }
  },
  meetingUri: {
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(),
    border: '1px solid #ced4da',
    fontSize: 12,
    borderRadius: 10,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '& input': {
      padding: theme.spacing(1, 1.5),
      color: theme.circleIn.palette.appBar
    }
  }
});