import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withRoot from '../../withRoot';
import Table from './table'
import LoadImg from '../LoadImg'

const styles = theme => ({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '17px 39px 11px 39px',
  },
  tab: {
    fontSize: 20,
    color: theme.circleIn.palette.primaryText2,
    cursor: 'pointer',
    fontWeight: 700,
  },
  selected: {
    fontSize: 20,
    padding: '9px 7px 11px 9px',
    color: theme.circleIn.palette.normalButtonText1,
    borderRadius: 8,
    fontWeight: 700,
    backgroundColor: theme.circleIn.palette.textOffwhite,
    cursor: 'pointer',
  },
  days: {
    fontSize: 24,
    color: theme.circleIn.palette.primaryText1,
  },
  count: {
    fontSize: 20,
    color: theme.circleIn.palette.success,
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
    padding: '29px 39px',
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
    padding: '0 39px',
  },
  button: {
    width: 150,
    marginLeft: 10, 
  },
})

const LeaderBoardTabs = ({ 
  classes,
  leaderboard,
  updateTuesdayLeaderboard,
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

  useEffect(() => {
    updateTuesdayLeaderboard()
    updateGrandLeaderboards()
  }, [updateGrandLeaderboards, updateTuesdayLeaderboard])

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
      if (selectedTab === 'grand') {
        setPrizeText(generalSelected.text)
        setPrizeImgs([generalSelected.logo])
        setRewardButtonText('Grand Prize Info')
      }
      else {
        setPrizeText('Your Top Picked Rewards')
        const images = generalSelected.slots.map(s => s.thumbnail)
        setRewardButtonText('Rewards Store')
        setPrizeImgs(images)
      }
    } catch(e) {
      console.log(e)
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

    if (window.innerWidth > 400)
      return (
        <div style={containerStyle}>
          {prizeImgs.map(img => (
            <LoadImg key={img} url={img} style={imgStyle} />
          ))}
        </div>
      )
    return null
  }

  const navigateToStore = () => { window.location.pathname = '/store' }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button 
          onClick={() => setSelectedTab('tuesday')} 
          className={selectedTab === 'tuesday' ? classes.selected : classes.tab }>
          {tuesdayBoardName || <CircularProgress size={20} />}        
        </Button>
        <Button 
          onClick={() => setSelectedTab('grand')} 
          className={selectedTab === 'grand' ? classes.selected : classes.tab }>
          {grandBoardName}
        </Button>
        <div className={classes.divider} />
        <div className={classes.days}>{timeLabel}: <span className={classes.count}>{time}</span></div>
      </div>
      <div className={classes.rewardContainer}>
        {renderPrizes()} 
        <div>
          <div className={classes.rewardTitle}>{prizeText}</div>
          <Button variant="outlined" color="primary" onClick={navigateToStore} className={classes.button}>{rewardButtonText}</Button>
        </div>
      </div>
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
        scoreLabel={scoreLabel}
        students={students}
      />
    </div>
  )
}

export default withRoot(withStyles(styles)(LeaderBoardTabs))
