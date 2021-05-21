import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {

  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
  headToRoom: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.greenInvite,
    borderRadius: theme.spacing(2),
  },
  disabled: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.disabled,
    borderRadius: theme.spacing(2),
  }
}))

export default useStyles
