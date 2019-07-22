// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import QuestItem from './QuestItem';

const styles = () => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative'
  },
  button: {
    zIndex: 1000
  },
  slider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 156,
    width: 250,
    minWidth: 250
  },
  first: {
    justifyContent: 'flex-end'
  },
  last: {
    justifyContent: 'flex-start'
  }
});

type Props = {
  classes: Object,
  quests: Array<Object>
};

type State = {
  currentSlide: number
};

class Quests extends React.PureComponent<Props, State> {
  static defaultProps = {};

  state = {
    currentSlide: 0
  };

  handlePrevious = () => {
    this.setState(prevState => ({ currentSlide: prevState.currentSlide - 1 }));
  };

  handleNext = () => {
    this.setState(prevState => ({ currentSlide: prevState.currentSlide + 1 }));
  };

  render() {
    const { classes, quests } = this.props;
    const { currentSlide } = this.state;

    return (
      <div className={classes.root}>
        <IconButton
          disabled={currentSlide === 0}
          onClick={this.handlePrevious}
          className={classes.button}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <div
          className={cx(
            classes.slider,
            currentSlide === 0 && classes.first,
            currentSlide === quests.length - 1 && classes.last
          )}
        >
          {quests.map((item, index) => (
            <QuestItem
              key={item.key}
              title={item.title}
              body={item.body}
              isHidden={
                index !== currentSlide - 1 &&
                index !== currentSlide &&
                index !== currentSlide + 1
              }
              isCurrent={currentSlide === index}
            />
          ))}
        </div>
        <IconButton
          disabled={currentSlide === quests.length - 1}
          onClick={this.handleNext}
          className={classes.button}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(Quests);
