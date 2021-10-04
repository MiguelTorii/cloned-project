import makeStyles from "@material-ui/core/styles/makeStyles";
export default makeStyles(theme => ({
  modalContainer: {
    borderRadius: 0,
    backgroundColor: 'transparent'
  },
  modalContent: {
    borderRadius: 0
  },
  imageContainer: {
    height: '100%',
    cursor: 'pointer'
  },
  image: {
    maxWidth: '100%',
    maxHeight: 'calc(100vh - 30px)'
  },
  closeIcon: {
    position: 'absolute',
    color: 'black',
    cursor: 'pointer',
    top: 10,
    right: 10
  }
}));