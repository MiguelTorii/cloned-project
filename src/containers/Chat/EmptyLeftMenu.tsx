import React from "react"; // useState

import EmptyLeftChat from "assets/svg/empty_left_chat.svg";
// import InviteDialog from 'components/InviteDialog'
// import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LoadImg from "components/LoadImg/LoadImg";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inviteButton: {
    zIndex: 1000,
    position: 'fixed',
    fontWeight: 'bold',
    backgroundColor: '#539f56',
    width: '23%',
    bottom: 10,
    [theme.breakpoints.down('xs')]: {
      width: '40%',
      bottom: 68
    }
  },
  messageContainer: {
    position: 'absolute',
    bottom: '25%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  message: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
}));

const EmptyLeftMenu = ({
  isLoading,
  emptyChannels
}) => {
  // const [inviteDialog, setInviteDialog] = useState(false)
  // const handleInviteClose = () => setInviteDialog(false)
  // const handleInviteOpen = () => setInviteDialog(true)
  const classes = useStyles();
  return <div className={classes.container}>
      {
      /* <InviteDialog */
    }
      {
      /* handleClose={handleInviteClose} */
    }
      {
      /* open={inviteDialog} */
    }
      {
      /* /> */
    }
      {emptyChannels && <div className={classes.messageContainer}>
          <LoadImg url={EmptyLeftChat} alt="emptychat" style={{
        margin: 'auto',
        display: 'flex'
      }} />
          <Typography classes={{
        root: classes.message
      }}>
            Once you send a message about class or a problem, all of your messages will be here
          </Typography>
          {isLoading && <div className={classes.loading}>
              <CircularProgress />
            </div>}
        </div>}
      {
      /* <Button */
    }
      {
      /* variant='contained' */
    }
      {
      /* onClick={handleInviteOpen} */
    }
      {
      /* classes={{ */
    }
      {
      /* root: classes.inviteButton */
    }
      {
      /* }} */
    }
      {
      /* > */
    }
      {
      /* Invite Classmates */
    }
      {
      /* </Button> */
    }
    </div>;
};

export default EmptyLeftMenu;