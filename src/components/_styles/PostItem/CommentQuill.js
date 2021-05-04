export const styles = theme => ({
  commentQuill: {
    width: '100%',
  },
  editor: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 2, 1),
    '& .ql-toolbar.ql-snow': {
      border: 'none'
    },
    '& .ql-editor': {
      maxHeight: 500,
      background: theme.circleIn.palette.hoverMenu,
      color: theme.palette.common.white,
      borderRadius: 20,
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
  postComment: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundImage: `linear-gradient(107.98deg, #5dc8fd -09.19%, #0074b5 122.45%)`
  },
  disablePostComment: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.disableButtonColor,
    color: `${theme.circleIn.palette.white} !important`
  },
  postCommentAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  postCommentIcon: {
    fontSize: 16,
    marginLeft: theme.spacing(0.5)
  },
  nonError: {
    display: 'none'
  },
  error: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 2, 1),
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
  }
})