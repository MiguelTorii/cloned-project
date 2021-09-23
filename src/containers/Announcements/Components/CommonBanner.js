// @flow
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import momentTz from 'moment-timezone';
import moment from 'moment';
import pluralize from 'pluralize';
import Tooltip from 'containers/Tooltip/Tooltip';
import LoadImg from '../../../components/LoadImg/LoadImg';
import expandSvg from '../../../assets/svg/expand.svg';
import minimizeSvg from '../../../assets/svg/minimize.svg';
import Dialog from '../../../components/Dialog/Dialog';
import type { Announcement } from '../../../types/models';
import { setIntervalWithFirstCall } from '../../../utils/helpers';
import { DURATION_REPLACE_TEXT, INTERVAL, TIME_ZONE } from '../../../constants/app';
import DialogContent from './DialogContent';

const useStyles = makeStyles((theme) => ({
  body: {
    alignItems: 'center',
    backgroundImage: 'linear-gradient(135deg, #94daf9, #1e88e5)',
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0px',
    position: 'relative',
    width: '100%'
  },
  image: {
    height: '100%',
    left: 16,
    maxHeight: 56,
    paddingRight: 40
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 800,
    textAlign: 'center'
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
  dialogContent: {
    padding: theme.spacing(0, 3)
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.circleIn.palette.primaryText1,
    fontSize: 28,
    fontStretch: 'normal',
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textAlign: 'center'
  },
  timer: {
    marginLeft: theme.spacing(1.5)
  },
  buttons: {
    position: 'absolute',
    right: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'relative',
      marginLeft: theme.spacing(1)
    }
  },
  button: {
    padding: 0
  },
  buttonLabel: {
    color: theme.circleIn.palette.secondaryText,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4
  }
}));

type Props = {
  announcement: Announcement
};

const CommonBanner = ({ announcement }: Props) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [durationText, setDurationText] = useState(null);
  const [timeOver, setTimeOver] = useState(false);

  useEffect(() => {
    const intervalID = setIntervalWithFirstCall(() => {
      const currentDateTime = momentTz().tz(TIME_ZONE);
      const endDateTime = momentTz(announcement.endDate).tz(TIME_ZONE);
      const duration = moment.duration(endDateTime.diff(currentDateTime));

      if (duration.asMinutes() <= 0) {
        setTimeOver(true);
      } else {
        setDurationText(
          [
            [duration.days(), 'day'],
            [duration.hours(), 'hour'],
            [duration.minutes(), 'minute']
          ]
            .map((item) => pluralize(item[1], item[0], true))
            .join(', ')
        );
      }
    }, 30 * INTERVAL.SECOND);

    return () => clearInterval(intervalID);
  }, [announcement.endDate]);

  const replaceDuration = (text) => text.replace(DURATION_REPLACE_TEXT, durationText);

  if (timeOver) {
    return null;
  }

  return (
    <div className={classes.body}>
      <div className={classes.image}>
        {isExpanded && announcement.imageUrl && (
          <LoadImg url={announcement.imageUrl} style={{ maxHeight: 64 }} />
        )}
      </div>
      <div className={classes.content}>
        {isExpanded ? (
          <>
            <div className={classes.title}>{announcement.title}</div>
            <div className={classes.text}>
              <span role="img" aria-label="timer">
                {replaceDuration(announcement.subtitle)}
              </span>
            </div>
          </>
        ) : (
          <div className={classes.text}>
            <span role="img" aria-label="title" className={classes.title}>
              {announcement.title}
            </span>
          </div>
        )}
      </div>
      <div className={classes.buttons}>
        <Button
          classes={{
            root: classes.button,
            label: classes.buttonLabel
          }}
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          <Tooltip
            id={9088}
            placement="top-end"
            text="We’ve given out over $100,000 to students and every week we have a new give away. Check it out. "
            okButton="Yay! 🎉"
          >
            <u> Learn More </u>
          </Tooltip>
        </Button>
        {isExpanded ? (
          <Button onClick={() => setIsExpanded(false)}>
            <LoadImg url={minimizeSvg} style={{ maxHeight: 10 }} />
          </Button>
        ) : (
          <Button onClick={() => setIsExpanded(true)}>
            <LoadImg url={expandSvg} style={{ maxHeight: 10 }} />
          </Button>
        )}
      </div>
      <Dialog
        onCancel={() => setDialogOpen(false)}
        open={dialogOpen}
        contentClassName={classes.dialogContent}
        maxWidth="sm"
        className={classes.dialog}
        title={
          <div className={classes.dialogTitle}>
            {announcement.popupTitleImage && (
              <LoadImg
                url={announcement.popupTitleImage}
                style={{ marginRight: 10, maxHeight: 44, marginTop: 10 }}
              />
            )}
            {announcement.popupTitle}
          </div>
        }
      >
        <DialogContent content={announcement.popupContent} />
      </Dialog>
    </div>
  );
};

export default CommonBanner;
