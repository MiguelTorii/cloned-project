import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  newClass: {
    color: theme.circleIn.palette.action
  },
  dialog: {
    borderRadius: 20,
    width: 600,
    minHeight: 440,
    overflow: 'visible',
    '& .MuiDialogContent-root': {
      overflowY: 'visible'
    }
  },
  dialogImg: {
    height: 'inherit'
  },
  title: {
    fontSize: 20
  },
  emptyOption: {
    height: theme.spacing(4)
  },
  richText: {
    paddingBottom: '24px !important',
    '& .ql-image': {
      display: 'none !important'
    },
    '& div div': {
      padding: 0
    },
    '& .ql-container': {
      padding: theme.spacing()
    }
  },
  selectForm: {
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 10
    }
  }
}));
