// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import chatImg from 'assets/img/chat_img.png';
import { confirmTooltip as confirmTooltipAction } from 'actions/user';
import Dialog from '../Dialog';
import { styles } from '../_styles/Announcements';

type Props = {
  classes: Object,
  confirmTooltip: Function,
  schoolId: number,
  viewedOnboarding: boolean,
  viewedTooltips: Array<number>
};

const Announcements = ({
  classes,
  confirmTooltip,
  schoolId,
  viewedOnboarding,
  viewedTooltips
}: Props) => {
  const ID = 6423;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      ![16, 52, 57].includes(schoolId) || // School not on this list
      !viewedOnboarding || // Onboarding not completed
      viewedTooltips === null || // Data still loading
      viewedTooltips.includes(ID) // Tooltip already dismissed by user
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [schoolId, viewedOnboarding, viewedTooltips]);

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
      title={
        <div className={classes.title}>
          Have Class Discussions in <b>Every Class</b>
        </div>
      }
    >
      <div>
        <p className={classes.row}>
          CircleIn now automatically places you and all your classmates into a
          Class Chat for each course. You can collaborate with the entire class
          here, ask questions directly to tutors, and discuss classwork
          together.
        </p>
        <div className={classes.imageContainer}>
          <img className={classes.image} src={chatImg} alt="chat" />
        </div>
      </div>
    </Dialog>
  );
};

const mapStateToProps = ({
  user: {
    syncData: { viewedOnboarding, viewedTooltips },
    data: { schoolId }
  }
}): {} => ({
  schoolId: Number(schoolId),
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
