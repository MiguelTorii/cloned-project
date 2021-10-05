export const styles = (theme) => ({
  addRm: {
    color: theme.circleIn.palette.action,
    width: '90%',
    wordBreak: 'break-word',
    cursor: 'pointer',
    whiteSpace: 'initial'
  },
  container: {
    marginLeft: 60
  },
  list: {
    overflowY: 'scroll',
    maxHeight: 100
  },
  item: {
    width: '80%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});
