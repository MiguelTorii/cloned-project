import React from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import QuestItem from "./QuestItem";
import { styles } from "../_styles/QuestsCard/Quests";
type Props = {
  classes: Record<string, any>;
  userId: string;
  quests: Array<Record<string, any>>;
};
type State = {
  currentSlide: number;
};

class Quests extends React.PureComponent<Props, State> {
  static defaultProps = {};
  state = {
    currentSlide: 0
  };
  handlePrevious = () => {
    this.setState(prevState => ({
      currentSlide: prevState.currentSlide - 1
    }));
  };
  handleNext = () => {
    this.setState(prevState => ({
      currentSlide: prevState.currentSlide + 1
    }));
  };

  render() {
    const {
      classes,
      userId,
      quests
    } = this.props;
    const {
      currentSlide
    } = this.state;
    return <div className={classes.root}>
        <IconButton disabled={currentSlide === 0} onClick={this.handlePrevious} className={classes.button}>
          <KeyboardArrowLeftIcon fontSize="large" />
        </IconButton>
        <div className={cx(classes.slider, currentSlide === 0 && classes.first, currentSlide === quests.length - 1 && classes.last)}>
          {quests.map((item, index) => <QuestItem key={item.id} userId={userId} iconUrl={item.iconUrl} pointsAvailable={item.pointsAvailable} task={item.task} action={item.action} isHidden={index !== currentSlide - 1 && index !== currentSlide && index !== currentSlide + 1} isCurrent={currentSlide === index} status={item.status} />)}
        </div>
        <IconButton disabled={currentSlide === quests.length - 1} onClick={this.handleNext} className={classes.button}>
          <KeyboardArrowRightIcon fontSize="large" />
        </IconButton>
      </div>;
  }

}

export default withStyles(styles)(Quests);