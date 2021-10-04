import React, { memo, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import LoadImg from "components/LoadImg/LoadImg";
import Tooltip from "@material-ui/core/Tooltip";
import more from "assets/svg/ic_moreinfo.svg";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "constants/app";
import auth0 from "auth0-js";
import store from "store";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "components/Dialog/Dialog";
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8)
  },
  options: {
    '& .MuiSelect-selectMenu': {
      display: 'flex',
      alignItems: 'center'
    },
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  more: {
    margin: theme.spacing(1, 1, 0, 1)
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: 400,
    backgroundColor: theme.circleIn.palette.darkActionBlue
  },
  tooltip: {
    backgroundColor: theme.circleIn.palette.darkActionBlue
  },
  popper: {
    width: 200,
    top: '-20px !important',
    left: '100px !important',
    zIndex: 1400,
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.darkActionBlue
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 4, 4, 4)
  },
  dialogText: {
    fontSize: 16,
    margin: theme.spacing(2, 0)
  },
  dialogCaption: {
    fontSize: 12
  },
  item: {
    fontSize: 16,
    marginLeft: theme.spacing(4)
  },
  gotItButton: {
    alignSelf: 'center',
    marginTop: 50,
    width: 200
  }
}));

const SelectRole = ({
  setScreen,
  role,
  school,
  updateError,
  updateRole
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const onChange = useCallback(value => {
    setLoading(true);

    if (!value || role === 'email') {
      setLoading(false);
      return false;
    }

    const {
      lmsTypeId,
      launchType,
      redirect_message: redirectMessage,
      connection
    } = value;

    if (launchType === 'lti') {
      updateError({
        title: '',
        body: redirectMessage
      });
      setLoading(false);
    } else if (lmsTypeId === 0) {
      /* NONE */
      setLoading(false);
    } else if (lmsTypeId === -1) {
      setLoading(false);
      window.location.replace('https://circleinapp.com/whitelist');
    } else if (launchType === 'saml') {
      const webAuth = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID
      });
      webAuth.authorize({
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        redirectUri: `${window.location.origin}/saml`,
        connection,
        responseType: 'token'
      });
      setLoading(false);
      return true;
    } else {
      const responseType = 'code';
      const origin = `${window.location.origin}/oauth`;
      const obj = {
        uri: value.uri,
        lms_type_id: value.lmsTypeId,
        response_type: responseType,
        client_id: value.clientId,
        redirect_uri: origin
      };
      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');
      let uri = `${value.authUri}?client_id=${value.clientId}&response_type=${responseType}&redirect_uri=${origin}&state=${buff}`;

      if (value.scope) {
        uri = `${uri}&scope=${value.scope}`;
      }

      setLoading(false);
      window.location.replace(uri);
      return true;
    }

    setLoading(false);
    return false;
  }, [role, updateError]);
  const onClick = useCallback(async () => {
    const redirect = await onChange(school);

    if (!redirect) {
      setScreen('login');
    }
  }, [onChange, school, setScreen]);
  const handleChange = useCallback(async e => {
    if (e?.target?.value) {
      const {
        value
      } = e.target;

      if (value === 'dk') {
        setOpen(true);
      } else {
        store.set('ROLE', value);
        updateRole({
          role: value
        });
      }
    }
  }, [updateRole]);
  return <div className={classes.container}>
      <Typography component="h1" variant="h5" align="center">
        I am a...
      </Typography>
      <div className={classes.options}>
        <Select id="role-select" className={classes.options} placeholder="Select Role" value={role} onChange={handleChange}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="faculty">Faculty, Administrator, or Director</MenuItem>
          <MenuItem value="tutor">Tutor, Mentor, Supplemental Instructor, or other</MenuItem>
          <MenuItem value="dk">I don’t see my role</MenuItem>
          <MenuItem value="email">
            I need to login through CircleIn
            <Tooltip title={<Typography className={classes.tooltipText}>
                  You may need to log onto the main application without going through your school’s
                  LMS. Choose this option to do so.
                </Typography>} classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}>
              <div>
                <LoadImg url={more} className={classes.more} />
              </div>
            </Tooltip>
          </MenuItem>
        </Select>
      </div>
      <Button disabled={!role} variant="contained" onClick={onClick} color="primary">
        {loading ? <CircularProgress size={20} color="secondary" /> : 'Select Role'}
      </Button>

      <Dialog onCancel={handleClose} title="Don’t see your role?" fullWidth maxWidth="md" open={open}>
        <div className={classes.content}>
          <Typography color="textPrimary" className={classes.dialogText}>
            If you’re trying to log into the main CircleIn application to support students, you’ll
            want to log in using the <b>Tutor, Mentor, Supplemental Instructor, or Other</b> role.
            An example of people who might fall into this role include (but or not limited to):
          </Typography>

          <li className={classes.item}>Peer mentors</li>
          <li className={classes.item}>Librarians</li>
          <li className={classes.item}>Peer tutors</li>
          <li className={classes.item}>Teaching Assistants</li>
          <li className={classes.item}>Graduate Assistants</li>
          <li className={classes.item}>Advisors</li>
          <li className={classes.item}>Counselors</li>

          <Typography color="textPrimary" className={classes.dialogText}>
            If you’re trying to access the Insights Dashboard, select the{' '}
            <b>Faculty, Administrator, or Director</b> role.
          </Typography>

          <Typography color="textPrimary" className={classes.dialogCaption}>
            If you need access to CircleIn but are not sure if you need access to the main
            application, Insights Dashboard, or both, please contact your institution or us at
            support@circleinapp.com for help.
          </Typography>
          <Button className={classes.gotItButton} onClick={handleClose} variant="contained" color="primary">
            Got it!
          </Button>
        </div>
      </Dialog>
    </div>;
};

export default memo(SelectRole);