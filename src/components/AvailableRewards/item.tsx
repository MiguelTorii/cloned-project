import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { styles } from '../_styles/AvailableRewards';

type Props = {
  classes: Record<string, any>;
  rewardId: number;
  bgColor: string;
  imageUrl: string;
  displayName: string;
  isSelected: boolean;
  rewardCount: number;
  onClick: (...args: Array<any>) => any;
};
type State = {
  hover: boolean;
};

class AvailableRewardsItem extends React.PureComponent<Props, State> {
  state = {
    hover: false
  };

  handleMouseEnter = () => {
    this.setState({
      hover: true
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hover: false
    });
  };

  handleClick = (slot) => () => {
    const { rewardId, onClick } = this.props;
    onClick({
      slot,
      rewardId
    });
  };

  render() {
    const { classes, rewardId, bgColor, imageUrl, displayName, isSelected, rewardCount } =
      this.props;
    const { hover } = this.state;
    return (
      <Paper
        key={rewardId}
        elevation={4}
        style={{
          backgroundColor: bgColor
        }} // classes={{ elevation24: classes.elevation }}
        className={cx(classes.item, isSelected && classes.selected)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <img src={imageUrl} alt={displayName} className={classes.image} />
        <div className={cx(classes.display, isSelected && classes.displaySelected)}>
          <Typography variant="subtitle2" color="textSecondary" noWrap>
            {displayName}
          </Typography>
        </div>
        {hover && (
          <div className={classes.overlay}>
            <Button color="primary" className={classes.button} onClick={this.handleClick(0)}>
              Move to first slot
            </Button>
            {rewardCount > 1 && (
              <Button color="primary" className={classes.button} onClick={this.handleClick(1)}>
                Move to second slot
              </Button>
            )}
            {rewardCount > 2 && (
              <Button color="primary" className={classes.button} onClick={this.handleClick(2)}>
                Move to third slot
              </Button>
            )}
          </div>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles as any)(AvailableRewardsItem);
