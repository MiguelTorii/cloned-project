import React from 'react';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AutoComplete from '../AutoComplete/AutoComplete';
import type { SelectType } from '../../types/models';
import { styles } from '../_styles/FederatedIdentities';

type Props = {
  classes: Record<string, any>;
  school: SelectType | null | undefined;
  error: boolean;
  onChange: (...args: Array<any>) => any;
  onLoad: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
};

class FederatedIdentities extends React.PureComponent<Props> {
  render() {
    const { classes, school, error, onChange, onLoad, onSubmit } = this.props;
    return (
      <main className={classes.main}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log in with your LMS
          </Typography>
          <div className={cx(classes.options, classes.show)}>
            <AutoComplete
              values={school}
              inputValue=""
              label=""
              placeholder="Search your school/college"
              error={error}
              errorText="You must select an option"
              onChange={onChange}
              onLoadOptions={onLoad}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={!school}
              onClick={onSubmit}
            >
              Log In
            </Button>
          </div>
        </div>
      </main>
    );
  }
}

export default withStyles(styles as any)(FederatedIdentities);
