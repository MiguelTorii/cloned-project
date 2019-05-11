// @flow

import React from 'react';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: theme.spacing.unit * 2
  },
  hide: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  hide: boolean,
  onTypeChange: Function
};

class TypeSelect extends React.PureComponent<Props> {
  handleClick = type => () => {
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

export default withStyles(styles)(TypeSelect);
