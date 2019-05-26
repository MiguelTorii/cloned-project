// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import type { SelectType } from '../../types/models';
import FederatedIdentities from '../../components/FederatedIdentities';
import { getLMSSchools } from '../../api/lms';
import { REDIRECT_URI } from '../../constants/app';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {
  lms: string,
  school: ?(SelectType & { uri: string }),
  error: boolean
};

class FederatedLogin extends React.Component<Props, State> {
  state = {
    lms: '',
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
      uri: school.uri
    }));
    return {
      options,
      hasMore: false
    };
  };

  handleClick = name => {
    this.setState({ lms: name });
  };

  handleSubmit = () => {
    const { school } = this.state;

    if (school) {
      const responseType = 'code';
      const obj = {
        uri: school.uri,
        response_type: responseType,
        client_id: school.value,
        redirect_uri: REDIRECT_URI
      };

      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');

      const uri = `https://${school.uri}/login/oauth2/auth?client_id=${
        school.value
      }&response_type=${responseType}&redirect_uri=${REDIRECT_URI}&state=${buff}`;
      window.location.replace(uri);
    }
  };

  render() {
    const { classes } = this.props;
    const { lms, school, error } = this.state;
    return (
      <main className={classes.main}>
        <ErrorBoundary>
          <FederatedIdentities
            key={lms}
            lms={lms}
            school={school}
            error={error}
            onClick={this.handleClick}
            onChange={this.handleChange}
            onLoad={this.handleLoadOptions}
            onSubmit={this.handleSubmit}
          />
        </ErrorBoundary>
      </main>
    );
  }
}

export default withStyles(styles)(FederatedLogin);
