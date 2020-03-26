import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import queryString from 'query-string'
import withRoot from '../../withRoot';
import Table from './table'
import LoadImg from '../LoadImg'
import shareNotes from '../../assets/svg/share_notes.svg';
import answerQuestions from '../../assets/svg/answer_questions.svg';
import studyVirtually from '../../assets/svg/study-virtually.svg';
import powerHour from '../../assets/svg/power_hour.svg';

const styles = theme => ({
  dialogTitle: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    margin: '32px auto 40px auto', 
    paddingBottom: 20,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 16,
    fontFamily: 'Nunito',
  },
  header: {
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '17px 32px 11px 32px',
  },
  tab: {
    fontSize: 20,
    color: theme.circleIn.palette.primaryText2,
    cursor: 'pointer',
    fontWeight: 700,
  },
  selected: {
    fontSize: 20,
    padding: '8px 16px 8px 16px',
    color: theme.circleIn.palette.normalButtonText1,
    borderRadius: 40,
    lineHeight: 1,
    fontWeight: 700,
    backgroundColor: theme.circleIn.palette.textOffwhite,
    cursor: 'pointer',
  },
  days: {
    fontSize: 20,
    color: theme.circleIn.palette.primaryText1,
  },
  count: {
    fontSize: 20,
    color: theme.circleIn.palette.success,
    textAlign: 'center',
    padding: 8,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 8,
  },
  divider: {
    borderLeft: `1px ${theme.circleIn.palette.modalBackground} solid`,
    height: 32,
  },
  rewardContainer: {
    display: 'flex',
    padding: '29px 32px',
  },
  img: {
    gridRow: '1/3'
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginLeft: 10,
    marginBottom: 10,
    color: theme.circleIn.palette.primaryText1,
  },
  filled: {
    backgroundColor: theme.circleIn.palette.appBar,
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
  },
  button: {
    width: 150,
    marginLeft: 10, 
  },
  dialogText: {
    color: theme.circleIn.palette.primaryText1
  },
  imgDialogContainer: {
    textAlign: 'center',
    width: '100%'
  },
  scoreContainer: {
    paddingLeft: 32,
    marginTop: 20,
    marginBottom: 40,
  },
  infoButton: {
    borderRadius: 8,
    color: theme.circleIn.palette.brand,
    borderColor: theme.circleIn.palette.brand,
    width: 75, 
  },
  highlight: {
    color: '#fec04f',
    fontSize: 14,
  },
  label: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  labelSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.4,
  },
  footnote: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 12,
  },
  dialogFootnote: {
    ...styles.footnote,
    textAlign: 'center',
    margin: '24px 0px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 2,
    margin: '0px 10px',
  },
  mvpActions: {
    display: 'flex', 
    justifyContent: 'space-around',
    marginTop: 30, 
  },
  mvpAction: {
    textAlign: 'center', 
    width: 160,
  },
  dialogTable: {
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: 15,
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
  leaderboard,
  userId,
  updateTuesdayLeaderboard,
  updateLeaderboardGrandInfo,
  width,
  sectionId,
  pushTo,
  updateGrandLeaderboards
}) => {
  const [selectedTab, setSelectedTab] = useState('tuesday')
  const [tuesdayBoardName, setTuesdayBoardName] = useState('')
  const [grandBoardName, setGrandBoardName] = useState('')
  const [time, setTime] = useState('')
  const [timeLabel, setTimeLabel] = useState('')
  const [scoreLabel, setScoreLabel] = useState('')
  const [students, setStudents] = useState([])
  const [prizeText, setPrizeText] = useState('')
  const [prizeImgs, setPrizeImgs] = useState([])
  const [rewardButtonText, setRewardButtonText] = useState('')
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogDescription, setDialogDescription] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const { amount, eligibility, numberOfWinners, text } = leaderboard.data.grandDialog;

  useEffect(() => {
    updateTuesdayLeaderboard(sectionId)
    updateGrandLeaderboards(sectionId)
    updateLeaderboardGrandInfo()
  }, [sectionId, updateGrandLeaderboards, updateTuesdayLeaderboard, updateLeaderboardGrandInfo])

  useEffect(() => {
    try {
      const { data } = leaderboard
      const selected = data[selectedTab]
      const generalSelected = data.general[selectedTab]
      const { timeLeft: { time: remainingTime, label } } = generalSelected
      setTime(remainingTime)
      setTimeLabel(label)
      setTuesdayBoardName(data.tuesday.boardName)
      setGrandBoardName(data.grand.boardName)
      setScoreLabel(selected.scoreLabel)
      setStudents(selected.students)
        
      setDialogTitle(data.grandDialog.text)
      setDialogDescription(data.grandDialog.description)
      if (selectedTab === 'grand') {
        setPrizeText(generalSelected.text)
        setPrizeImgs([generalSelected.logo])
        setRewardButtonText('Grand Prize Info')
      }
      else {
        setPrizeText('Gifts You Selected to Earn')
        const images = generalSelected.slots.map(s => s.thumbnail)
        setRewardButtonText('Rewards Store')
        setPrizeImgs(images)
      }
    } catch(e) {
      // console.log(e)
    }
  }, [leaderboard, selectedTab])

  const renderPrizes = () => {
    const imgStyle = {
      width: 75,
      height: 75,
      marginRight: 5,
    }

    const containerStyle = {
      display: 'flex'
    }

    const placeholder = {
      height: 74,
      width: 75,
      paddingTop: 2,
      marginRight: 8,
      border: '1px dashed gray',
      borderRadius: 16,
    }

    if (window.innerWidth > 400)
      return (
        <div style={containerStyle}>
          {prizeImgs.map(img => (
            <LoadImg key={img} url={img} style={imgStyle} />
          ))}
          {selectedTab === 'tuesday' && [...Array(3-prizeImgs.length)].map(() => <div key={uuidv4()} style={placeholder} />)}
        </div>
      )
    return null
  }

  const navigateToStore = () => { window.location.pathname = '/store' }

  const handleCloseDialog = () => setOpenDialog(false)
  const handleOpenDialog = () => setOpenDialog(true)

  const me = students.find(s => s.userId === Number(userId));

  const imgStyle = {
    width: 75,
    height: 75,
    marginRight: 5,
  }
   
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Dialog onClose={handleCloseDialog} open={openDialog} maxWidth="md">
          <DialogTitle disableTypography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText 
              variant="h4"
              paragraph
              className={classes.dialogTitle}>
              {dialogTitle}
            </DialogContentText>
            <DialogContentText className={classes.dialogText}>
              For students who positively impact their classmates’ academic success through collaboration on CircleIn.
            </DialogContentText>
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
                    {eligibility}
                  </div>
                </div>
              </div>
              <div className={classes.dialogFootnote}>
                Keep in mind that 7 MVP’s is the minimum qualifier. <br />
                Strive to earn more than 7 because it will increase your overall chances of winning a scholarship.
              </div>
              <DialogContentText
                variant="h6"
                paragraph
                className={classes.dialogTitle}>
                Best Practices to Earn MVPs:
              </DialogContentText>
              <div className={classes.mvpActions}>
                {
                  mvpActions.map(action => (
                    <div className={classes.mvpAction}>
                      <LoadImg key={action.imageUlrl} url={action.imageUrl} style={imgStyle} />
                      <div style={{ marginTop: 8 }}><b>{action.title}</b></div>
                      <div style={{ marginTop: 8 }}>{action.text}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Grid
          container
          direction='row'
          alignItems='center'
          spacing={2}
          justify='space-between'
        >
          <Grid item xs={6} md={4}>
            <Button
              onClick={() => setSelectedTab('tuesday')} 
              className={`${selectedTab === 'tuesday' ? classes.selected : classes.tab} tour-onboarding-leaderboard-tuesday`}>
              {tuesdayBoardName || <CircularProgress size={20} />}
            </Button>
          </Grid>
          <div className={classes.divider} />
          <Grid item xs={6} md={4}>
            <Button
              onClick={() => setSelectedTab('grand')} 
              className={`${selectedTab === 'grand' ? classes.selected : classes.tab } tour-onboarding-leaderboard-grand`}>
              {grandBoardName}
            </Button>
          </Grid>
        </Grid>
      </div>
      {
        selectedTab === 'grand' &&
        <div className={classes.scoreContainer}>
            <div className={classes.days}>{timeLabel}:
              <span className={classes.count}>{time}</span>
            </div>
            <div className={classes.days}>MVPs earned:
              <span className={classes.count}>{me.score}</span>
            </div>
            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 12 }}>
                    <LoadImg key={prizeImgs[0]} url={prizeImgs[0]} style={imgStyle} />
                  </div>
                  <div>
                    <Button
                      className={classes.infoButton}
                      onClick={handleOpenDialog}
                      variant="outlined"
                    >
                      <Typography variant="h7">Info</Typography>
                    </Button>
                  </div>
                </div>
                <div style={{ marginLeft: 16}}>
                  <div style={{ marginBottom: 2 }}>
                    <Typography variant="h5">{text}</Typography>
                  </div>
                  <div style={{ display: 'flex', marginBottom: 15 }}>
                    <div style={{ marginRight: 25 }}>
                      <div className={classes.highlight}>Amount</div>
                      <div className={classes.label}>{amount}</div>
                    </div>
                    <div style={{ marginRight: 25, whiteSpace: 'nowrap' }}>
                      <div className={classes.highlight}>Number of Winners</div>
                      <div className={classes.label}>{numberOfWinners}</div>
                    </div>
                    <div style={{ maxWidth: 250 }}>
                      <div className={classes.highlight}>Eligibility Requirements*</div>
                      <div className={classes.labelSmall}>
                        {eligibility}
                      </div>
                    </div>
                  </div>
                  <div className={classes.footnote}>
                    *Learn more about how to qualify by clicking Info
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
      {
        selectedTab !== 'grand' &&
        <div className={classes.rewardContainer}>
          {renderPrizes()}
          <div>
            <div className={classes.rewardTitle}>{prizeText}</div>
            <Button
              variant="outlined"
              color="primary"
              onClick={selectedTab === 'grand' ? handleOpenDialog : navigateToStore}
              className={classes.button}
            >
              {rewardButtonText}
            </Button>
          </div>
        </div>
      }
      <div className={classes.filterContainer}>
        <Typography variant="h4">
          Current Leaders
        </Typography>
        {/* <Select */}
        {/* variant='filled' */}
        {/* classes={{ */}
        {/* select: classes.filled */}
        {/* }} */}
        {/* > */}
        {/* <MenuItem value={10}>Ten</MenuItem> */}
        {/* <MenuItem value={20}>Twenty</MenuItem> */}
        {/* <MenuItem value={30}>Thirty</MenuItem> */}
        {/* </Select> */}
      </div>
      <Table
        userId={Number(userId)} 
        scoreLabel={scoreLabel}
        pushTo={pushTo}
        students={students}
      />
    </div>
  )
}

export default withRoot(withStyles(styles)(withWidth()(LeaderBoardTabs)))
