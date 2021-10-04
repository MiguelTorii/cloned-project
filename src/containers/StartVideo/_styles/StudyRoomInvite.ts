import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  dialog: {},
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2)
  },
  headToRoom: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.greenInvite,
    borderRadius: theme.spacing(2)
  },
  disabled: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.disabled,
    borderRadius: theme.spacing(2)
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    width: 330,
    alignItems: 'center',
    margin: 'auto',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(18)
  },
  img: {
    width: 120
  },
  text1: {
    color: theme.circleIn.palette.darkTextColor,
    fontWeight: 800,
    fontSize: 24,
    lineHeight: '33px',
    textAlign: 'center'
  },
  text2: {
    color: theme.circleIn.palette.darkTextColor,
    fontWeight: 400,
    fontSize: 20,
    lineHeight: '27px',
    textAlign: 'center'
  }
}));
export default useStyles;