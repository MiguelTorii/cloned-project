import React, { useEffect, useState } from 'react';

import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import * as authActions from 'actions/auth';
import { logEventLocally } from 'api/analytics';
import { getReferralCodeInfo } from 'api/referral';
import { searchSchools } from 'api/sign-in';
import loginBackground from 'assets/img/login-background.png';

import type { State as StoreState } from 'types/state';

const styles = () => ({
  main: {
    backgroundImage: `url(${loginBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0',
    '-ms-background-size': 'cover',
    '-o-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-webkit-background-size': 'cover',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  }
});

type Props = {
  classes: Record<string, any>;
  push: (...args: Array<any>) => any;
  match: {
    params: {
      code: string;
    };
  };
  updateReferralData: (...args: Array<any>) => any;
  updateSchool: (...args: Array<any>) => any;
};

const Referral = ({
  classes,
  push,
  match: {
    params: { code }
  },
  updateReferralData,
  updateSchool
}: Props) => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const init = async () => {
      logEventLocally({
        category: 'Referral',
        objectId: code,
        type: 'Opened'
      });
      const referralData = await getReferralCodeInfo(code);

      if (referralData) {
        const schools = await searchSchools({
          query: referralData.school
        });

        if (schools && schools[0]) {
          updateSchool({
            school: schools[0]
          });
          updateReferralData({
            referralData: {
              code,
              name: referralData.name,
              school: referralData.school,
              schoolId: referralData.schoolId
            }
          });
          push('/signup');
        } else {
          setMessage('Invalid schoool name.');
        }
      } else {
        setMessage('Invalid referral code.');
      }
    };

    init();
  });
  return (
    <div className={classes.main}>
      <Typography variant="h5">{message}</Typography>
    </div>
  );
};

const mapStateToProps = ({ auth }: StoreState): {} => ({
  auth
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      updateReferralData: authActions.updateReferralData,
      updateSchool: authActions.updateSchool,
      push: routerPush
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles as any)(Referral)));
