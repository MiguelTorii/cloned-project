// @flow
import React, { useRef, useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';

import * as userActions from 'actions/user'
import Dialog, { dialogStyle } from 'components/Dialog';
import { Anouncement } from 'types/models';
import Gifts from './Gifts';

const styles = theme => ({
  body: {
    alignItems: 'center',
    background: '#e9ecef',
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0px',
    position: 'relative',
    width: '100%',
  },
  button: {
    padding: 0,
  },
  buttonLabel: {
    color: theme.circleIn.palette.action,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4,
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
    height: '100%',
    left: 16,
    maxHeight: 56
  },
  text: {
    alignItems: 'center',
    color: 'black',
    display: 'flex',
    fontSize: 14,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

type Props = {
  announcement: Anouncement,
  bannerHeight: number,
  setBannerHeight: Function,
  classes: Object,
  getAnnouncement: Function,
  location: { pathname: string },
  onLoaded: Function
};

const Banner = ({
  announcement,
  classes,
  getAnnouncement,
  bannerHeight,
  setBannerHeight,
  location: { pathname },
  onLoaded,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(60 - new Date().getMinutes());
  const bannerRef = useRef(null)

  useEffect(() => {
    getAnnouncement({ announcementId: 1, campaignId: 7 });

    const intervalId = setInterval(() => {
      const currentMinute = new Date().getMinutes();
      setMinutesRemaining(60 - currentMinute);

      if (currentMinute === 1) {
        getAnnouncement({ announcementId: 1, campaignId: 7 });
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getAnnouncement]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (
        announcement &&
        bannerRef.current &&
        bannerRef.current.clientHeight !== bannerHeight
      ) {
        setTimeout(() => setBannerHeight({
          bannerHeight: bannerRef.current.clientHeight
        }), 100)
      }
    }
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [announcement, bannerHeight, setBannerHeight])

  useEffect(() => {
    if (announcement) onLoaded();
  }, [announcement, onLoaded])

  if (!announcement || pathname === '/chat') return null;

  const isActive = (new Date().getHours() >= 8) && (new Date().getHours() < 20);

  const {
    hourlyReward,
    imageUrl,
    popupTitle,
    subtitle,
    title,
  } = announcement;

  const text = subtitle && subtitle.replace("{{time_left}}", minutesRemaining);

  return (
    <div ref={bannerRef} className={classes.body}>
      <div className={classes.image}>
        {isActive && <img src={imageUrl} alt="gift" style={{ maxHeight: 56 }} />}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>
          {isActive && title}
        </div>
        <div className={classes.text}>
          {isActive ? text : "Today's Hourly Giveaway has ended! Come back tomorrow for more prizes."}
        </div>
      </div>
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

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      getAnnouncement: userActions.getAnnouncement,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Banner)));
