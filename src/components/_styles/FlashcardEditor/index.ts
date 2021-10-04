export const styles = theme => ({
  root: {
    margin: theme.spacing(),
    width: 200,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.primaryText1,
    color: theme.circleIn.palette.normalButtonText1
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText: {
    width: '100%',
    height: 60,
    fontWeight: 'bold',
    overflowY: 'auto'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing()
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  smallRichEditor: {
    '& div': {
      height: 'calc(100% - 62px)'
    }
  },
  bigRichEditor: {
    '& div': {
      height: 'calc(100% - 42px)'
    }
  },
  noFocus: {
    '& div': {
      height: '100%'
    },
    '& .ql-toolbar.ql-snow': {
      display: 'none'
    }
  },
  richEditor: {
    height: 170,
    width: '30vw',
    margin: theme.spacing(1, 0),
    border: `1px solid ${theme.circleIn.palette.borderColor}`,
    borderRadius: theme.spacing(),
    position: 'relative',
    '& .ql-snow .ql-picker.ql-expanded .ql-picker-options': {
      top: 'inherit',
      zIndex: 1,
      bottom: '100%'
    },
    '& div div': {
      height: '100%',
      padding: 0
    },
    '& .ql-formats': {
      height: 24
    },
    '& .ql-image': {
      position: 'absolute',
      right: theme.spacing()
    },
    '& .ql-editor': {
      position: 'absolute',
      width: '100%',
      padding: theme.spacing()
    },
    '& .ql-toolbar.ql-snow': {
      height: 42,
      zIndex: '1',
      width: '100%',
      border: 'none'
    },
    '& .ql-container.ql-snow': {
      width: '100%',
      border: 'none'
    },
    '& .quill': {
      height: '100%'
    },
    '& .ql-toolbar': {
      position: 'absolute',
      bottom: 0,
      transform: 'translateY(100%)'
    }
  },
  image: {
    position: 'absolute',
    borderRadius: theme.spacing(),
    top: theme.spacing(2),
    left: theme.spacing(),
    maxHeight: 100,
    maxWidth: 100,
    objectFit: 'scale-down'
  },
  imageEditor: {
    '& .ql-editor': {
      width: 'calc(100% - 116px)',
      left: 116
    }
  },
  dialog: {
    position: 'relative',
    '& #dialog-cancel-button': {
      position: 'absolute',
      bottom: theme.spacing() + 10,
      left: theme.spacing(3)
    }
  }
});