// @flow
import React, { useMemo, memo, useRef, useEffect, useState, useCallback } from 'react'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';

import Dialog, { dialogStyle } from 'components/Dialog'
import LoadImg from 'components/LoadImg'
import airPods from 'assets/svg/airpods.svg'
import expandSvg from 'assets/svg/expand.svg'
import minimizeSvg from 'assets/svg/minimize.svg'
import airPodsBox from 'assets/svg/airpods_box.svg'

import * as userActions from 'actions/user'
import { Anouncement } from 'types/models'
import Gifts from './Gifts'
import HourlyGifts from './HourlyGifts'

const styles = theme => ({
  body: {
    alignItems: 'center',
    backgroundImage: 'linear-gradient(135deg, #94daf9, #1e88e5)',
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0px',
    position: 'relative',
    width: '100%'
  },
  hourlyBody: {
    alignItems: 'center',
    background: '#e9ecef',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '4px 0px',
    position: 'relative',
  },
  dialogContent: {
    padding: theme.spacing(0, 3)
  },
  buttons: {
    position: 'absolute',
    right: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'relative',
      marginLeft: theme.spacing(1),
    },
  },
  button: {
    padding: 0,
  },
  buttonLabel: {
    color: theme.circleIn.palette.secondaryText,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4,
  },
  hourlyButtonLabel: {
    color: theme.circleIn.palette.action,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4
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
    maxWidth: 750,
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
    fontSize: 14,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
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
  expertMode,
  announcement,
  classes,
  getAnnouncement,
  bannerHeight,
  setBannerHeight,
  location: { pathname },
  onLoaded,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [minutesRemaining, setMinutesRemaining] = useState(60 - new Date().getMinutes())
  const [durationTimer, setDurationTimer] = useState('')
  const [endDate, setEndDate] = useState('')
  const [noGift, setNoGift] = useState(false)
  const [isExpand, setIsExpand] = useState(true)
  const bannerRef = useRef(null)
  const [hourlyReward, setHourlyReward] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [popupTitle, setPopupTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [text, setText] = useState('')
  const [isActive, setIsActive] = useState(false)

  const getDuration = useCallback(() => {
    const currentDateTime = momentTz().tz("America/New_York")
    const endDateTime = momentTz(endDate).tz("America/New_York")

    const duration = moment.duration(endDateTime.diff(currentDateTime))

    const days = duration.days()
    const hours = duration.hours()
    const minutes = duration.minutes()
    if (!duration._isValid) return

    if (days <= 0 && hours <= 0 && minutes <= 0) {
      setNoGift(true)
    }

    const durationTimer = `${days} ${days > 1 ? 'days' : 'day'},
      ${hours} ${hours > 1 ? 'hours' : 'hour'},
      ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}
      `
    setDurationTimer(durationTimer)
  }, [endDate])

  const initialTimer = useCallback(() => {
    const currentMinute = new Date().getMinutes();
    setMinutesRemaining(60 - currentMinute)
    setIsActive((new Date().getHours() >= 8) && (new Date().getHours() < 20))
    if (currentMinute === 1) {
      getAnnouncement({ announcementId: 1, campaignId: 7 })
    }
  }, [getAnnouncement])

  useEffect(() => {
    if (!bannerRef.current) {
      setBannerHeight({ bannerHeight: 0 })
    }

    if (
      !expertMode &&
      announcement &&
      bannerRef.current &&
      bannerRef.current.clientHeight !== bannerHeight
    ) {
      setBannerHeight({
        bannerHeight: bannerRef.current.clientHeight
      })
    }
  }, [announcement, bannerHeight, expertMode, isExpand, setBannerHeight])

  useEffect(() => {
    if(!announcement) getAnnouncement({ announcementId: 1, campaignId: 7 })
    initialTimer()
    const intervalId = setInterval(() => {
      initialTimer()
    }, 60000);

    return () => clearInterval(intervalId);
  }, [announcement, getAnnouncement, initialTimer]);

  useEffect(() => {
    getDuration()

    const timer = setInterval(() => {
      getDuration()
    }, 30000);

    return () => clearInterval(timer)
  }, [getDuration])

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
    if (announcement) {
      onLoaded();
      setHourlyReward(announcement.announcement.hourlyReward)
      setImageUrl(announcement.announcement.imageUrl)
      setTitle(announcement.announcement.title)
      setPopupTitle(announcement.announcement.popupTitle)
      setSubtitle(announcement.announcement.subtitle)
      setEndDate(announcement.endDate)
      setText(announcement.announcement.subtitle && announcement.announcement.subtitle.replace("{{time_left}}", minutesRemaining))
    }
  }, [announcement, minutesRemaining, onLoaded, subtitle])

  const AirpodsGift = useMemo(() => {
    return (
      <div ref={bannerRef} className={classes.body}>
        <div className={classes.image}>
          {isExpand && <LoadImg url={airPods} style={{ maxHeight: 64 }} />}
        </div>
        <div className={classes.content}>
          {!isExpand
            ? <>
              <div className={classes.text}>
                <span role="img" aria-label="title" className={classes.title}>
                Apple AirPods Giveaway 🎉
                </span>
                <span role="img" aria-label="timer" className={classes.timer}>
                  {durationTimer
                    ? `${durationTimer} left! 🔥`
                    : '...'
                  }
                </span>
              </div>
            </>
            : <>
              <div className={classes.title}>
              Apple AirPods Giveaway
              </div>
              <div className={classes.text}>
                <span role="img" aria-label="timer">
                  {durationTimer ? `🎉 ${durationTimer} left in the giveaway. Time to hustle! 🔥` : '...'}
                </span>
              </div>
            </>}
        </div>
        <div className={classes.buttons}>
          <Button
            classes={{
              root: classes.button,
              label: classes.buttonLabel,
            }}
            color='primary'
            onClick={() => setDialogOpen(true)}
          >
            <u> Learn More </u>
          </Button>
          {!isExpand
            ? <Button onClick={() => setIsExpand(true)}>
              <LoadImg url={expandSvg} style={{ maxHeight: 10 }} />
            </Button>
            : <Button onClick={() => setIsExpand(false)}>
              <LoadImg url={minimizeSvg} style={{ maxHeight: 10 }} />
            </Button>}
        </div>
        <Dialog
          onCancel={() => setDialogOpen(false)}
          open={dialogOpen}
          contentClassName={classes.dialogContent}
          maxWidth="sm"
          className={classes.dialog}
          title={(
            <div className={classes.dialogTitle}>
              <LoadImg url={airPodsBox} style={{ marginRight: 10, maxHeight: 44, marginTop: 10 }} />
            Apple AirPods Giveaway!?
            </div>
          )}
        >
          <Gifts />
        </Dialog>
      </div>
    )
  }, [classes.body, classes.button, classes.buttonLabel, classes.buttons, classes.content, classes.dialog, classes.dialogContent, classes.dialogTitle, classes.image, classes.text, classes.timer, classes.title, dialogOpen, durationTimer, isExpand])

  const HourlyGift = useMemo(() => {
    return (
      <div ref={bannerRef} className={classes.hourlyBody}>
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
            label: classes.hourlyButtonLabel,
          }}
          color='primary'
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
          title={popupTitle}
        >
          <HourlyGifts hourlyReward={hourlyReward} />
        </Dialog>
      </div>
    )
  }, [classes.button, classes.content, classes.dialog, classes.dialogContent, classes.hourlyBody, classes.hourlyButtonLabel, classes.image, classes.text, classes.title, dialogOpen, hourlyReward, imageUrl, isActive, popupTitle, text, title])

  if (!announcement || pathname === '/chat') return null;

  if (expertMode) return null

  return !noGift ? AirpodsGift: HourlyGift
}

const mapStateToProps = ({ user: { announcementData, expertMode } }): {} => ({
  announcement: announcementData,
  expertMode
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      getAnnouncement: userActions.getAnnouncement,
    },
    dispatch
  );

// Banner.whyDidYouRender= true
export default memo(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Banner))))
