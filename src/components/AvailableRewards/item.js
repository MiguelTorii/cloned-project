// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  item: {
    margin: theme.spacing.unit * 2,
    borderRadius: 4,
    width: 180,
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  selected: {
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: theme.palette.primary.main
  },
  image: {
    width: 'auto',
    maxWidth: 120,
    height: 'auto',
    maxHeight: 50,
    marginTop: theme.spacing.unit
  },
  display: {
    width: 180,
    backgroundColor: 'white',
    height: 50,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  displaySelected: {
    borderLeftStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: theme.palette.primary.main,
    borderRightStyle: 'solid',
    borderRightWidth: 4,
    borderRightColor: theme.palette.primary.main
  },
  overlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  button: {
    margin: theme.spacing.unit / 2
  }
});

type Props = {
  classes: Object,
  rewardId: number,
  bgColor: string,
  imageUrl: string,
  displayName: string,
  isSelected: boolean,
  onClick: Function
};

type State = {
  hover: boolean
};

class AvailableRewardsItem extends React.PureComponent<Props, State> {
  state = {
    hover: false
  };

  handleMouseEnter = () => {
    this.setState({ hover: true });
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  handleClick = slot => () => {
    const { rewardId, onClick } = this.props;
    onClick({ slot, rewardId });
  };

  render() {
    const {
      classes,
      rewardId,
      bgColor,
      imageUrl,
      displayName,
      isSelected
    } = this.props;
    const { hover } = this.state;
    return (
      <Paper
        key={rewardId}
        style={{ backgroundColor: bgColor }}
        className={cx(classes.item, isSelected && classes.selected)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <img src={imageUrl} alt={displayName} className={classes.image} />
        <div
          className={cx(classes.display, isSelected && classes.displaySelected)}
        >
          <Typography variant="subtitle2" color="textSecondary" noWrap>
            {displayName}
          </Typography>
        </div>
        {hover && (
          <div className={classes.overlay}>
            <Button
              color="primary"
              className={classes.button}
              onClick={this.handleClick(0)}
            >
              Move to first slot
            </Button>
            <Button
              color="primary"
              className={classes.button}
              onClick={this.handleClick(1)}
            >
              Move to second slot
            </Button>
            <Button
              color="primary"
              className={classes.button}
              onClick={this.handleClick(2)}
            >
              Move to third slot
            </Button>
          </div>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(AvailableRewardsItem);
