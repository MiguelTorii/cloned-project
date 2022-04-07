import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  chip: {
    backgroundColor: theme.circleIn.palette.floatChatTextAreaBackground,
    border: '1px solid transparent',
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    paddingLeft: theme.spacing(1),
    '&:hover, &:focus': {
      backgroundColor: theme.circleIn.palette.floatChatTextAreaBackground
    },
    '&:hover': {
      border: '1px solid #5F6165'
    },
    '&.reacted': {
      backgroundColor: theme.circleIn.palette.primaryii222
    }
  },
  addChip: {
    width: 32,
    height: 32,
    marginLeft: 0,
    backgroundColor: theme.circleIn.palette.floatChatTextAreaBackground
  },
  addChipIcon: {
    paddingLeft: 14,
    paddingTop: 4
  }
}));
