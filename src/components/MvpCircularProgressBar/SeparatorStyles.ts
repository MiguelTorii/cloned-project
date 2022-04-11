import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  bar: {
    background: theme.circleIn.palette.primaryBackground,
    width: '6px',
    height: `18%`
  }
}));

export default useStyles;
