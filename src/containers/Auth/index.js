// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import type { UserState } from '../../reducers/user';
import ErrorBoundary from '../ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import logo from '../../assets/svg/circlein_logo_beta.svg';
import AuthSearchSchool from '../../components/AuthSearchSchool';
import { getLMSSchools } from '../../api/lms';

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
  user: UserState
};

type State = {
  school: ?(SelectType & { uri: string, authUri: string, lmsTypeId: number }),
  error: boolean
};

class Auth extends React.Component<Props, State> {
  state = {
    school: null,
    error: false
  };

  handleChange = value => {
    this.setState({ school: value });
    if (!value) this.setState({ error: true });
    else this.setState({ error: false });
  };

  handleLoadOptions = async () => {
    const schools = await getLMSSchools();
    const options = schools.map(school => ({
      value: school.clientId,
      label: school.school,
      uri: school.uri,
      authUri: school.authUri,
      lmsTypeId: school.lmsTypeId
    }));
    return {
      options,
      hasMore: false
    };
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { school, error } = this.state;

    if (userId !== '') return <Redirect to="/" />;

    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={12} lg={6} className={classes.grid}>
            <img src={logo} alt="Logo" className={classes.logo} />
            <ErrorBoundary>
              <AuthSearchSchool
                school={school}
                error={error}
                onChange={this.handleChange}
                onLoad={this.handleLoadOptions}
              />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </main>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Auth));
