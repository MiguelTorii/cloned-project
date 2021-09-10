import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import { setIntervalWithFirstCall } from 'utils/helpers';
import { INTERVAL } from 'constants/app';
import type { Announcement } from 'types/models';
import HourlyGiveawayPopup from './HourlyGiveawayPopup';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  hourlyBody: {
    alignItems: 'center',
    background: '#e9ecef',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '4px 0px',
    position: 'relative'
  },
  image: {
    height: '100%',
    left: 16,
    maxHeight: 56,
    paddingRight: 40
  },
  text: {
    alignItems: 'center',
    color: 'black',
    display: 'flex',
    fontSize: 14
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    padding: 0
  },
  hourlyButtonLabel: {
    color: theme.circleIn.palette.action,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4
  },
  dialogContent: {
    padding: theme.spacing(0, 3)
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 800,
    textAlign: 'center'
  },
  dialog: {
    ...dialogStyle,
    maxWidth: 750
  }
}));

type Props = {
  announcement: Announcement
};

const HourlyGiveawayBanner = ({ announcement }: Props) => {
  const classes = useStyles();
  const [isActive, setIsActive] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(
    60 - new Date().getMinutes()
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const intervalId = setIntervalWithFirstCall(() => {
      const now = new Date();
      setMinutesRemaining(60 - now.getMinutes());
      setIsActive(now.getHours() >= 8 && now.getHours() < 20);
    }, 1 * INTERVAL.MINUTE);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.hourlyBody}>
      <div className={classes.image}>
        {isActive && (
          <img
            src={announcement.imageUrl}
            alt="gift"
            style={{ maxHeight: 56 }}
          />
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>{isActive && announcement.title}</div>
        <div className={classes.text}>
          {isActive
            ? announcement.subtitle.replace('{{time_left}}', minutesRemaining)
            : "Today's Hourly Giveaway has ended! Come back tomorrow for more prizes."}
        </div>
      </div>
      <Button
        classes={{
          root: classes.button,
          label: classes.hourlyButtonLabel
        }}
        color="primary"
        onClick={() => setDialogOpen(true)}
      >
        Learn More
      </Button>
      <Dialog
        onCancel={() => setDialogOpen(false)}
        open={dialogOpen}
        contentClassName={classes.dialogContent}
        maxWidth="sm"
        className={classes.dialog}
        title={announcement.popupTitle}
      >
        <HourlyGiveawayPopup hourlyReward={announcement.hourlyReward} />
      </Dialog>
    </div>
  );
};

export default HourlyGiveawayBanner;
