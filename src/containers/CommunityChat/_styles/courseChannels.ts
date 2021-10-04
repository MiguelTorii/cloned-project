import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  courseLogo: {
    position: 'relative'
  },
  courseBanner: {
    width: '100%',
    minHeight: 100,
    maxHeight: 120
  },
  courseNameWithLogo: {
    width: '100%',
    minHeight: 60
  },
  courseName: {
    width: '100%',
    minHeight: 60,
    backgroundColor: theme.circleIn.palette.modalBackground
  },
  name: {
    color: 'white',
    padding: theme.spacing(0.5, 2),
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  }
}));
export default useStyles;