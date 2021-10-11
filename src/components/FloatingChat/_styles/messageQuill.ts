export default (theme) => ({
  messageQuill: {
    width: '100%',
    padding: 0
  },
  files: {
    width: '100%',
    padding: theme.spacing(1),
    background: theme.circleIn.palette.hoverMenu,
    borderRadius: theme.spacing(0, 0, 2.5, 2.5),
    display: 'flex',
    flexWrap: 'wrap'
  },
  editWithFile: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .ql-toolbar.ql-snow': {
      border: 'none',
      padding: theme.spacing(1, 0)
    },
    '& .ql-editor': {
      maxHeight: 500,
      background: theme.circleIn.palette.hoverMenu,
      color: theme.palette.common.white,
      borderRadius: theme.spacing(2.5, 2.5, 0, 0),
      '& > p': {
        '& > img': {
          maxWidth: `120px !important`
        }
      }
    }
  },
  editor: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .ql-toolbar.ql-snow': {
      border: 'none',
      padding: theme.spacing(1, 0)
    },
    '& .ql-editor': {
      maxHeight: 500,
      background: theme.circleIn.palette.hoverMenu,
      color: theme.palette.common.white,
      borderRadius: 20,
      '& > p': {
        '& > img': {
          maxWidth: `120px !important`
        }
      }
    }
  },
  innerContainerEditor: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    maxHeight: '100%',
    position: 'relative',
    '& .quill': {
      flex: 1,
      '& .ql-container.ql-snow': {
        border: 'none'
      }
    }
  },
  editorToolbar: {
    '& .ql-container.ql-snow': {
      border: 'none',
      bottom: 0,
      right: 0
    },
    width: '100%',
    position: 'relative',
    zIndex: 1,
    bottom: 0
  },
  postMessage: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundImage: `linear-gradient(107.98deg, #5dc8fd -09.19%, #0074b5 122.45%)`
  },
  disablePostMessage: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    background:
      'linear-gradient(107.98deg, rgba(93, 203, 253, 0.6) -9.19%, rgba(0, 116, 181, 0.6) 122.45%)',
    color: `${theme.circleIn.palette.primaryText1} !important`,
    opacity: 0.6
  },
  postMessageAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  nonError: {
    display: 'none'
  },
  error: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 2, 1)
  },
  errorMessage: {
    fontSize: 12,
    color: theme.circleIn.palette.danger
  },
  loader: {
    position: 'absolute',
    zIndex: 1200,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  sendMessageIcon: {
    fontSize: 16,
    marginLeft: theme.spacing(0.5)
  }
});
