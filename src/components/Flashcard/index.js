// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import ReactCardFlip from 'react-card-flip';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    width: 200,
    height: 200,
    display: 'flex',
    flexDirection: 'column'
  },
  big: {
    width: 400,
    height: 400
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  cardText: {
    width: '100%',
    height: 60,
    overflowY: 'auto'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

type Props = {
  classes: Object,
  index: number,
  question: string,
  answer: string,
  studyMode?: boolean
};

type State = {
  isFlipped: boolean
};

class Flashcard extends React.PureComponent<Props, State> {
  static defaultProps = {
    studyMode: false
  };

  state = {
    isFlipped: false
  };

  handleFlip = () => {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  };

  renderContent = isQuestion => {
    const { classes, index, question, answer, studyMode } = this.props;
    return (
      <Card
        className={cx(classes.root, studyMode && classes.big)}
        key={isQuestion ? 'front' : 'back'}
      >
        <CardHeader title={`Flashcard #${index}`} />
        <CardContent className={classes.content}>
          <Typography variant="subtitle1">
            {isQuestion ? 'Question:' : 'Answer:'}
          </Typography>
          <Typography className={classes.cardText}>
            {isQuestion ? question : answer}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            onClick={this.handleFlip}
            size="small"
            color="default"
            variant="outlined"
          >
            {isQuestion ? 'View Answer' : 'View Question'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  render() {
    const { isFlipped } = this.state;

    return (
      <Fragment>
        <ReactCardFlip isFlipped={isFlipped}>
          {this.renderContent(true)}
          {this.renderContent(false)}
        </ReactCardFlip>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Flashcard);
