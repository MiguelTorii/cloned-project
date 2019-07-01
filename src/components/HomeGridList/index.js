// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import type { HomeCards } from '../../types/models';
import Countdown from './Countdown';
import OnboardingChecklist from './OnboardingChecklist';
import Referral from './Referral';

const styles = theme => ({
  root: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  userId: string,
  referralCode: string,
  cards: HomeCards,
  onOpenLeaderboard: Function
};

type State = {};

class HomeGridList extends React.PureComponent<Props, State> {
  renderCards = () => {
    const { userId, referralCode, cards, onOpenLeaderboard } = this.props;
    return cards.map(card => {
      const { cardId } = card;
      switch (cardId) {
        case 'countdown':
          return (
            <Countdown
              key={cardId}
              card={card}
              onOpenLeaderboard={onOpenLeaderboard}
            />
          );
        case 'onboarding_checklist':
          return (
            <OnboardingChecklist key={cardId} userId={userId} card={card} />
          );
        case 'referral':
          return (
            <Referral key={cardId} referralCode={referralCode} card={card} />
          );
        default:
          return null;
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container className={classes.root} spacing={16}>
          {this.renderCards()}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomeGridList);
