import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import PrizeDialog from 'components/LeaderBoardTabs/PrizeDialog'
import withWidth from '@material-ui/core/withWidth';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import withRoot from '../../withRoot';
import Table from './table'
import LoadImg from '../LoadImg'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </Typography>
  );
}

const styles = theme => ({
  fullWidth: {
    width: '100%',
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
  },
  tabs: {
    borderRadius: '16px 16px 0 0',
    padding: '17px 32px 11px 32px',
    fontSize: 18,
    cursor: 'pointer',
    fontWeight: 700,
  },
  days: {
    fontSize: 20,
    paddingBottom: theme.spacing(),
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
  imgDialogContainer: {
    textAlign: 'center',
    width: '100%'
  },
  grayText: {
    color: theme.circleIn.palette.primaryText2,
  },
  scoreContainer: {
    paddingLeft: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(),
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
})

const LeaderBoardTabs = ({
  classes,
  leaderboard,
  userId,
  updateTuesdayLeaderboard,
  updateLeaderboardGrandInfo,
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
  const [openDialog, setOpenDialog] = useState(false)
  const [tuesdayPoints, setTuesdayPoints] = useState('')

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
      if (selectedTab === 'grand') {
        setPrizeText(generalSelected.text)
        setPrizeImgs([generalSelected.logo])
        setRewardButtonText('Grand Prize Info')
      }
      else {
        setPrizeText('Gifts You Selected to Earn')
        const images = generalSelected.slots.map(s => s.thumbnail)
        setRewardButtonText('Rewards Store')
        setTuesdayPoints(generalSelected.currentMonthPointsDisplayName)
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

  const me = students.find(s => s.userId === Number(userId)) || {};

  const imgStyle = {
    width: 75,
    height: 75,
    marginRight: 5,
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <PrizeDialog
          handleCloseDialog={handleCloseDialog}
          openDialog={openDialog}
          amount={amount}
          numberOfWinners={numberOfWinners}
          dialogTitle={dialogTitle}
          eligibility={eligibility}
        />
        <Tabs
          variant="fullWidth"
          value={selectedTab}
          classes={{
            root: classes.fullWidth,
          }}
          onChange={(e, n) => setSelectedTab(n)}
        >
          <Tab
            className='tour-onboarding-leaderboard-tuesday'
            classes={{
              wrapper: classes.tabs
            }}
            label={tuesdayBoardName}
            value="tuesday"
          />
          <Tab
            className='tour-onboarding-leaderboard-grand'
            classes={{
              wrapper: classes.tabs
            }}
            label={grandBoardName}
            value="grand"
          />
        </Tabs>
      </div>
      <TabPanel value={selectedTab} index="grand">
        <div className={classes.scoreContainer}>
          <div className={classes.days}>{timeLabel}:
            <span className={classes.count}>{time}</span>
          </div>
          <div className={classes.days}>MVPs earned:
            <span className={classes.count}>{me.score}</span>
          </div>
          <div style={{ marginTop: 24 }}>
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
                    <Typography>Info</Typography>
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
      </TabPanel>
      <TabPanel value={selectedTab} index='tuesday'>
        <div className={classes.scoreContainer}>
          <div className={classes.days}>{timeLabel}:
            <span className={classes.count}>{time}</span>
          </div>
          <div className={classes.days}>Points:
            <span className={classes.count}>{tuesdayPoints}</span>
          </div>
          <div className={classes.footnote}>
            *You must earn a minimum of 150,000 points to qualify for 1st Tuesday Rewards
          </div>
        </div>
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
      </TabPanel>
      <div className={classes.filterContainer}>
        <Typography variant="h4">
          Current Leaders
        </Typography>
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
