// @flow
import React from 'react'
import cx from 'classnames'
import { withStyles } from '@material-ui/core/styles'

import LoadImg from 'components/LoadImg'

import book from 'assets/svg/book.svg'
import flashcards from 'assets/svg/flashcards.svg'
import appIcon from 'assets/svg/app_icon.svg'
import trophy from 'assets/svg/trophy_gift.svg'
import barcodeImg from 'assets/img/barcode.png'

const styles = theme => ({
  body: {
    margin: theme.spacing(0, 3),
    fontWeight: 800,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 1),
    }
  },
  action: {
    alignItems: 'center',
    display: 'flex',
  },
  actionSpacing: {
    margin: theme.spacing(1, 0)
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '16px 0px'
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8
  },
  barcodeImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    color: theme.circleIn.palette.action,
    textDecoration: 'none',
    wordBreak: 'break-all'
  },
  row: {
    margin: '16px 0px'
  },
  subtitle: {
    marginBottom: theme.spacing(1),
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16
  },
  newPost: {
    background: theme.circleIn.palette.brand,
    borderRadius: 10,
    color: 'black',
    display: 'inline-block',
    fontSize: 18,
    fontWeight: 'bold',
    margin: '0px 2px',
    padding: '0px 8px'
  }
})

type Props = {
  classes: Object
};

const Gifts = ({ classes }: Props) => {
  const imgStyle = {
    width: 30
  }

  return (
    <div className={classes.body}>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          How do I win?
        </div>
        <div className={classes.text}>
          In order for you to be entered into the drawing to win an Apple  <br/ > AirPod, you must complete all 3 steps by March 19th:
        </div>
      </div>
      <div className={classes.actions}>
        <div>
          <div className={classes.action}>
            <LoadImg url={book} style={{ ...imgStyle, marginTop: 10 }} />
            <div className={classes.actionText}>
              Take 7 sets of notes on CircleIn's Notes tool
            </div>
          </div>
          <div className={classes.action}>
            <LoadImg url={flashcards} style={{ ...imgStyle, marginTop: 10 }} />
            <div className={classes.actionText}>
              Create 25 flashcards on CircleIn (1 deck)
            </div>
          </div>
          <div className={cx(classes.action, classes.actionSpacing)}>
            <LoadImg url={appIcon} style={{ ...imgStyle, height: 35 }} />
            <div className={classes.actionText}>
              Get the CircleIn mobile app (scan the QR code below for easy <br />
              downloading), or ask a question or send a chat to a classmate!
            </div>
          </div>
          <div className={cx(classes.action, classes.actionSpacing)}>
            <LoadImg url={trophy} style={{ ...imgStyle, height: 35 }} />
            <div className={classes.actionText}>
              Engage with 10 unique posts (Share, thank, bookmark, <br />
              comment, answer a question etc.)
            </div>
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          BONUS ENTRIES!
        </div>
        <div className={classes.text}>
          1.) Ask your classmates to join CircleIn by sharing this link: <br /> <a className={classes.link} rel='noopener noreferrer' target='_blank' href='https://students.circleinapp.com/JoinNow'>
          https://students.circleinapp.com/JoinNow </a> on your school's LMS <br/>
          (Canvas, Blackboard, D2L, Moodle etc.)
        </div>
        <div className={classes.text}>
          2.) Let your classmates know what you love about CircleIn and <br />
          why they should join!
        </div>
        <div className={classes.text}>
          3.) Take a screenshot and send it to: <a className={classes.link} rel='noopener noreferrer' target='_blank' href='mailto:jennifer@circleinapp.com'>
          jennifer@circleinapp.com </a>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.subtitle}>
          Winners announced March 22nd!
        </div>
      </div>
      <div className={cx(classes.row, classes.barcodeImg)}>
        <a className={classes.link} rel='noopener noreferrer' target='_blank' href='https://students.circleinapp.com/JoinNow'>
          <LoadImg url={barcodeImg}  style={{ width: 80 }}/>
        </a>
      </div>
    </div>
  )
}

export default withStyles(styles)(Gifts)
