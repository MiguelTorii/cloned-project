import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  title: {
    fontWeight: 700
  },
  tabs: {
    borderBottom: `solid 1px ${theme.circleIn.palette.modalBackground}`,
    '& .MuiTab-wrapper': {
      fontSize: 16,
      overflow: 'hidden',
      width: '66.6%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'inline'
    },
    '& .Mui-selected': {
      borderBottom: `solid 4px ${theme.circleIn.palette.darkActionBlue}`,
      fontWeight: 'bold'
    },
    '& .MuiTab-root': {
      width: '33.3%'
    }
  }
}));
