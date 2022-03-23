import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import { REDIRECT_URI } from 'constants/app';

import { getLMSSchools } from 'api/lms';
import FederatedIdentities from 'components/FederatedIdentities/FederatedIdentities';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import type { SelectType } from 'types/models';

// const REDIRECT_URI = 'http://localhost:2000/oauth';
const styles = () => ({});

type Props = {
  classes: Record<string, any>;
};
type State = {
  school:
    | (SelectType & {
        uri: string;
        authUri: string;
        lmsTypeId: number;
      })
    | null
    | undefined;
  error: boolean;
};

class FederatedLogin extends React.Component<Props, State> {
  state = {
    school: null,
    error: false
  };

  handleChange = (value) => {
    this.setState({
      school: value
    });

    if (!value) {
      this.setState({
        error: true
      });
    } else {
      this.setState({
        error: false
      });
    }
  };

  handleLoadOptions = async () => {
    const schools = await getLMSSchools();
    const options = schools.map((school) => ({
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

  handleSubmit = () => {
    const { school } = this.state;

    if (school) {
      const responseType = 'code';
      const obj = {
        uri: school.uri,
        lms_type_id: school.lmsTypeId,
        response_type: responseType,
        client_id: school.value,
        redirect_uri: REDIRECT_URI
      };
      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');
      let uri = `${school.authUri}?client_id=${school.value}&response_type=${responseType}&redirect_uri=${REDIRECT_URI}&state=${buff}`;

      if (school.lmsTypeId === 1) {
        uri = `${uri}&scope=url:GET|/api/v1/courses`;
      }

      window.location.replace(uri);
    }
  };

  render() {
    const { classes } = this.props;
    const { school, error } = this.state;
    return (
      <main className={classes.main}>
        <ErrorBoundary>
          <FederatedIdentities
            school={school}
            error={error}
            onChange={this.handleChange}
            onLoad={this.handleLoadOptions}
            onSubmit={this.handleSubmit}
          />
        </ErrorBoundary>
      </main>
    );
  }
}

export default withStyles(styles as any)(FederatedLogin);
