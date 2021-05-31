export const styles = theme => ({
  dropLabel: {
    width: '100%'
  },
  addIcon: {
    fontSize: theme.spacing(4)
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    border: 'none !important',
  },
  uploadFileForm: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.circleIn.palette.appBar} !important`
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F5C264'
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#F5C264'
    }
  },
  uploadFileLabel: {
    color: '#F5C264',
    fontWeight: 'bold',
    fontSize: 18
  },
  rootUploadFile: {
    borderRadius: theme.spacing(1),
  },
  uploadFileInput: {
    padding: '12px 14px',
    '&::placeholder': {
      color: theme.circleIn.palette.textOffwhite,
      fontSize: 16
    },
    fontSize: 12
  },
  notchedOutline: {
    borderColor: '#F5C264'
  },
  uploadIconSize: {
    width: 51,
    height: 51,
    color: '#909090'
  },
  thumbnails: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dragContainer: {
    position: 'relative',
    margin: theme.spacing(2)
  },
  drag: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: theme.spacing()
  },
  button: {
    padding: 4,
    backgroundColor: theme.circleIn.customBackground.iconButton
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  }
});