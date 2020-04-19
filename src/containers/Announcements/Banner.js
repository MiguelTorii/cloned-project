// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import LoadImg from 'components/LoadImg';
import Dialog, { dialogStyle } from 'components/Dialog';
import { Anouncement } from 'types/models';
import Gifts from './Gifts';

const styles = theme => ({
  body: {
    alignItems: 'center',
    background: '#e9ecef',
    display: 'flex',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
    width: '100%',
  },
  buttonLabel: {
    color: theme.circleIn.palette.action,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 800,
    textAlign: 'center',
    width: '90%',
  },
  dialog: {
    ...dialogStyle,
    maxWidth: 750,
  },
  image: {
    left: 16,
    position: 'absolute',
  },
  text: {
    alignItems: 'center',
    color: 'black',
    display: 'flex',
    fontSize: 18,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

type Props = {
  announcement: Anouncement,
  classes: Object
};

const Banner = ({
  announcement,
  classes,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(60 - new Date().getMinutes());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinutesRemaining(60 - new Date().getMinutes());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [minutesRemaining]);

  if (!announcement) return null;

  const isActive = (new Date().getHours() >= 8) && (new Date().getHours() < 20);

  const {
    hourlyReward,
    imageUrl,
    popupTitle,
    subtitle,
    title,
  } = announcement;

  const text = subtitle.replace("{{time_left}}", minutesRemaining);

  return (
    <div className={classes.body}>
      <div className={classes.image}>
        {isActive && <LoadImg url={imageUrl} style={{ width: 100 }} />}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>
          {isActive && title}
        </div>
        <div className={classes.text}>
          {isActive ? text : "Today's Hourly Giveaway has ended! Come back tomorrow for more prizes."}
          <Button
            classes={{
              root: classes.button,
              label: classes.buttonLabel,
            }}
            color='primary'
            onClick={() => setDialogOpen(true)}
          >
            Learn More
          </Button>
        </div>
      </div>
      <Dialog
        onCancel={() => setDialogOpen(false)}
        open={dialogOpen}
        className={classes.dialog}
        title={popupTitle}
      >
        <Gifts hourlyReward={hourlyReward} />
      </Dialog>
    </div>
  );
}

const mapStateToProps = ({ user: { announcementData } }): {} => ({
  announcement: announcementData
});

export default connect(mapStateToProps)(withStyles(styles)(Banner));
