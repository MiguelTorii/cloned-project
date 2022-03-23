import React from 'react';

import cx from 'classnames';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { styles } from '../_styles/SignUpForm/TypeSelect';

type Props = {
  classes: Record<string, any>;
  hide: boolean;
  onTypeChange: (...args: Array<any>) => any;
};

class TypeSelect extends React.PureComponent<Props> {
  handleClick = (type) => () => {
    const { onTypeChange } = this.props;
    onTypeChange(type);
  };

  render() {
    const { classes, hide } = this.props;
    return (
      <div className={cx(classes.root, hide && classes.hide)}>
        <Button
          onClick={this.handleClick('K-12')}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          {"I'm a K-12 Student"}
        </Button>
        <Button
          onClick={this.handleClick('College')}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          {"I'm a College Student"}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles as any)(TypeSelect);
