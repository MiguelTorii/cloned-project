import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  modal: {
    width: 500,
    backgroundColor: theme.circleIn.palette.appBar,
    '& hr': {
      marginBottom: 0
    }
  },
  modalContent: {
    padding: 0
  },
  emojiSidebar: {
    backgroundColor: '#2E2F32',
    padding: theme.spacing(2),
    minWidth: 50
  },
  userListContainer: {
    padding: theme.spacing(2)
  },
  emojiChip: {
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    border: 'solid 1px transparent',
    '&, &:focus': {
      backgroundColor: '#2E2F32'
    },
    '&:hover, &.selected': {
      backgroundColor: 'rgba(95, 97, 101, 0.5)',
      border: 'solid 1px #5F6165'
    },
    fontSize: 16,
    color: 'white',
    fontWeight: 600
  },
  removeEmojiButton: {
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
    color: theme.circleIn.palette.textSubtitleBody,
    fontSize: 16
  }
}));
