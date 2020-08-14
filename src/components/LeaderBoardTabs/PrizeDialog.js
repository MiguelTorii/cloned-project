import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import Dialog, { dialogStyle } from '../Dialog';
import LoadImg from '../LoadImg'
import shareNotes from '../../assets/svg/share_notes.svg';
import answerQuestions from '../../assets/svg/answer_questions.svg';
import studyVirtually from '../../assets/svg/study-virtually.svg';
import powerHour from '../../assets/svg/power_hour.svg';

const styles = theme => ({
  highlight: {
    color: '#fec04f',
    fontSize: 14,
  },
  label: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  subtitle: {
    fontSize: 16
  },
  footnote: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 12,
  },
  dialogFootnote: {
    ...styles.footnote,
    textAlign: 'center',
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 1,
    margin: 10,
  },
  mvpActions: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  mvpAction: {
    textAlign: 'center',
    width: 160
  },
  dialogTable: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dialog: {
    ...dialogStyle,
    height: 680
  }
})

const mvpActions = [
  {
    imageUrl: shareNotes,
    title: 'Share your notes often.',
    text: 'As often as you take them. Notes are the easiest way to earn points.'
  },
  {
    imageUrl: answerQuestions,
    title: 'Answer Questions.',
    text: 'All answers get points. The best answer gets the most points.'
  },
  {
    imageUrl: studyVirtually,
    title: 'Study virtually.',
    text: 'Connect over video with classmates or project groups.'
  },
  {
    imageUrl: powerHour,
    title: 'Utilize Power Hour!',
    text: 'Posts and answers earn double the points during Power Hour.'
  },
];

const LeaderBoardTabs = ({
  classes,
  handleCloseDialog,
  openDialog,
  eligibilitySubtitleDialog,
  amount,
  numberOfWinners,
  dialogTitle,
  eligibilityDialog
}) => {
  const imgStyle = {
    width: 75,
    height: 75,
    marginRight: 5,
  }

  const subtitle = eligibilitySubtitleDialog && eligibilitySubtitleDialog.split('.')

  return (
    <Dialog
      className={classes.dialog}
      onCancel={handleCloseDialog}
      open={openDialog}
      title={dialogTitle}
    >
      <div className={classes.subtitle}>
        For students who positively impact their classmates’ academic success through collaboration on CircleIn.
      </div>
      <hr className={classes.hr} />
      <div style={{ padding: 20 }}>
        <div className={classes.dialogTable}>
          <div style={{ marginRight: 25 }}>
            <div className={classes.highlight}>Amount</div>
            <div className={classes.label}>{amount}</div>
          </div>
          <div style={{ marginRight: 25, whiteSpace: 'nowrap' }}>
            <div className={classes.highlight}>Number of Winners</div>
            <div className={classes.label}>{numberOfWinners}</div>
          </div>
          <div style={{ maxWidth: 250 }}>
            <div className={classes.highlight}>Eligibility Requirements</div>
            <div className={classes.label}>
              {eligibilityDialog}
            </div>
          </div>
        </div>
        {subtitle && subtitle.map(l => l && <div key={l} className={classes.dialogFootnote}>{l}.</div>)}
        <div
          className={classes.title}>
            Best Practices to Earn MVPs:
        </div>
        <div className={classes.mvpActions}>
          {
            mvpActions.map(action => (
              <div key={action.title} className={classes.mvpAction}>
                <LoadImg key={action.imageUlrl} url={action.imageUrl} style={imgStyle} />
                <div style={{ marginTop: 8 }}><b>{action.title}</b></div>
                <div style={{ marginTop: 8 }}>{action.text}</div>
              </div>
            ))
          }
        </div>
      </div>
    </Dialog>
  )
}

export default withRoot(withStyles(styles)(withWidth()(LeaderBoardTabs)))
