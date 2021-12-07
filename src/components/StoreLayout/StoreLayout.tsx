import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { styles } from '../_styles/StoreLayout';
import { CampaignState } from '../../reducers/campaign';

type Props = {
  classes: Record<string, any>;
  children: React.ReactNode;
};

const StoreLayout = ({ classes, children }: Props) => {
  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  return (
    <Paper className={isHud ? classes.hudRoot : classes.root} elevation={0}>
      {!isHud && (
        <>
          <Typography variant="h3" paragraph>
            Welcome to the Rewards Store
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Whenever you share something useful on CircleIn or help a classmate, you’ll earn points.
            As your points add up, at the end of every month, you’ll have a chance to win our
            monthly reward. Select three rewards below and if you’re selected as a winner, we’ll
            send you an e-giftcard for one of your choices!
          </Typography>
        </>
      )}
      <Typography variant="subtitle1" paragraph>
        Monthly Rewards Selections
      </Typography>
      {children}
    </Paper>
  );
};

export default withStyles(styles as any)(StoreLayout);
