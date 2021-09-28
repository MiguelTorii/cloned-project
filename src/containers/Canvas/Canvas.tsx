import React from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { State as StoreState } from '../../types/state';
import { checkLMSUser } from '../../api/lms';
import * as signInActions from '../../actions/sign-in';

const styles = () => ({
  main: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes?: Record<string, any>;
  nonce: string;
  updateUser?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
};

class Canvas extends React.Component<Props> {
  componentDidMount = async () => {
    const { nonce, updateUser, pushTo } = this.props;

    try {
      const user = await checkLMSUser({
        nonce
      });
      updateUser({
        user
      });
      pushTo('/');
    } catch (err) {
      console.log(err);
      pushTo('/', {
        error: true
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CircularProgress />
      </main>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      updateUser: signInActions.updateUser,
      pushTo: push
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(Canvas));
