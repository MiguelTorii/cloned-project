// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import type { UserState } from '../../reducers/user';
import type { AuthState } from '../../reducers/auth';
import ErrorBoundary from '../ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import logo from '../../assets/svg/circlein_logo_beta.svg';
import AuthSearchSchool from '../../components/AuthSearchSchool';
import { searchSchools } from '../../api/sign-in';
import * as authActions from '../../actions/auth';
import { REDIRECT_URI } from '../../constants/app';

const styles = theme => ({
  main: {
    minHeight: '100vh',
    backgroundImage: `url(${loginBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0',
    '-ms-background-size': 'cover',
    '-o-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-webkit-background-size': 'cover',
    backgroundSize: 'cover'
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  logo: {
    marginTop: theme.spacing.unit * 8
  }
});

type Props = {
  classes: Object,
  user: UserState,
  auth: AuthState,
  updateSchool: Function
};

type State = {
  school: ?(SelectType & { uri: string, authUri: string, lmsTypeId: number }),
  error: boolean,
  lti: boolean
};

class Auth extends React.Component<Props, State> {
  state = {
    school: null,
    error: false,
    lti: false
  };

  handleChange = value => {
    if (!value) return;
    const { lmsTypeId, launchType } = value;
    if (launchType === 'lti') {
      this.setState({ lti: true });
    } else if (lmsTypeId === 0) {
      const { updateSchool } = this.props;
      const { label, value: selectValue, ...school } = value;
      updateSchool({ school });
    } else if (lmsTypeId === -1) {
      window.location.replace('https://circleinapp.com/whitelist');
    } else {
      const responseType = 'code';
      const obj = {
        uri: value.uri,
        lms_type_id: value.lmsTypeId,
        response_type: responseType,
        client_id: value.clientId,
        redirect_uri: REDIRECT_URI
      };

      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');

      let uri = `${value.authUri}?client_id=${
        value.clientId
      }&response_type=${responseType}&redirect_uri=${REDIRECT_URI}&state=${buff}`;

      if (value.scope) {
        uri = `${uri}&scope=${value.scope}`;
      }
      window.location.replace(uri);
    }
  };

  handleLoadOptions = async value => {
    if (value.trim().length > 1) {
      const schools = await searchSchools({ query: value });

      const options = schools.map(school => ({
        value: school.clientId,
        label: school.school,
        noAvatar: true,
        ...school
      }));

      return {
        options,
        hasMore: false
      };
    }
    return {
      options: [],
      hasMore: false
    };
  };

  handleClose = () => {
    this.setState({ lti: false });
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      },
      auth: { data }
    } = this.props;
    const { school, error, lti } = this.state;

    if (userId !== '') return <Redirect to="/" />;
    if (data.school) return <Redirect to="/login" />;
    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={12} lg={6}>
            <div className={classes.grid}>
              <img src={logo} alt="Logo" className={classes.logo} />
              <ErrorBoundary>
                <AuthSearchSchool
                  school={school}
                  error={error}
                  onChange={this.handleChange}
                  onLoad={this.handleLoadOptions}
                />
              </ErrorBoundary>
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={lti}
          onClose={this.handleClose}
          aria-labelledby="lti-title"
          aria-describedby="lti-description"
        >
          <DialogContent className={classes.content}>
            <DialogContentText color="textPrimary">
              Please open CircleIn from the Canvas mobile app or website.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Got It!
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    );
  }
}

const mapStateToProps = ({ user, auth }: StoreState): {} => ({
  user,
  auth
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateSchool: authActions.updateSchool
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Auth));
