// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { confirmTooltip as confirmTooltipAction } from 'actions/user';
import Dialog, { dialogStyle } from '../Dialog';

const styles = () => ({
  dialog: {
    ...dialogStyle,
    maxWidth: 700,
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24
  },
  row: {
    fontSize: 16,
  }
});

type Props = {
  classes: Object,
  confirmTooltip: Function,
  viewedOnboarding: boolean,
  viewedTooltips: Array<number>
};

const Announcements = ({
  classes,
  confirmTooltip,
  viewedOnboarding,
  viewedTooltips
}: Props) => {
  const ID = 6423;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      !viewedOnboarding // Onboarding not completed
      || viewedTooltips === null // Data still loading
      || viewedTooltips.includes(ID) // Tooltip already dismissed by user
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [viewedOnboarding, viewedTooltips]);

  const handleConfirmation = () => {
    confirmTooltip(ID);
  };

  return (
    <Dialog
      ariaDescribedBy="circlein-announcements"
      className={classes.dialog}
      okTitle="Ok!"
      onCancel={handleConfirmation}
      onOk={handleConfirmation}
      open={open}
      showActions
      title="Leaderboard has been reset"
    >
      <div>
        <p className={classes.row}>
          As one journey ends, another begins. April has ended and we all know what this means
        </p>
        <p className={classes.row}>
          First Tuesday Awards!!!!
        </p>
        <p className={classes.row}>
          Winners will be announced next week. The leaderboard has been reset and everyone’s points have been reset to zero. At the end of May, we’ll announce more winners.
        </p>
        <p className={classes.row}>
          To view the total points that you have earned so far this semester, go to your Profile
        </p>
        <div className={classes.image}>
          <img src="https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif" alt="so excited" />
        </div>
      </div>
    </Dialog>
  );
}

const mapStateToProps = (
  { user: { syncData: { viewedOnboarding, viewedTooltips } } }): {} => ({
  viewedOnboarding,
  viewedTooltips
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Announcements));
