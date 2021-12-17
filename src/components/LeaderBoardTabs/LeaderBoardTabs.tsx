import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import withWidth from '@material-ui/core/withWidth';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import withRoot from '../../withRoot';
import Table from './table';
import LoadImg from '../LoadImg/LoadImg';
import { styles } from '../_styles/LeaderBoardTabs';
import { SCHOLARSHIP_HELP_URL } from '../../constants/app';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography component="div" role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={1}>{children}</Box>}
    </Typography>
  );
}

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
  // On this page, scholarship tracker is called `grand board`.
  const showScholarshipTracker = useSelector(
    (state) => (state as any).campaign.showScholarshipTracker
  );
  const [selectedTab, setSelectedTab] = useState('tuesday');
  const [tuesdayBoardName, setTuesdayBoardName] = useState('');
  const [grandBoardName, setGrandBoardName] = useState('');
  const [time, setTime] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  const [scoreLabel, setScoreLabel] = useState('');
  const [students, setStudents] = useState([]);
  const [prizeText, setPrizeText] = useState('');
  const [prizeImgs, setPrizeImgs] = useState([]);
  const [rewardButtonText, setRewardButtonText] = useState('');
  const [tuesdayPoints, setTuesdayPoints] = useState('');
  const dispatch = useDispatch();
  const { amount, numberOfWinners, text } = leaderboard.data.grandDialog;
  useEffect(() => {
    updateTuesdayLeaderboard(sectionId);
    updateGrandLeaderboards(sectionId);
    updateLeaderboardGrandInfo();
  }, [sectionId, updateGrandLeaderboards, updateTuesdayLeaderboard, updateLeaderboardGrandInfo]);
  useEffect(() => {
    try {
      const { data } = leaderboard;
      const selected = data[selectedTab];
      const generalSelected = data.general[selectedTab];
      const {
        timeLeft: { time: remainingTime, label }
      } = generalSelected;
      setTime(remainingTime);
      setTimeLabel(label);
      setTuesdayBoardName(data.tuesday.boardName);
      setGrandBoardName(data.grand.boardName);
      setScoreLabel(selected.scoreLabel);
      setStudents(selected.students);

      if (selectedTab === 'grand') {
        setPrizeText(generalSelected.text);
        setPrizeImgs([generalSelected.logo]);
        setRewardButtonText('Grand Prize Info');
      } else {
        setPrizeText('Gifts You Selected to Earn');
        const images = generalSelected.slots.map((s) => s.thumbnail);
        setRewardButtonText('Rewards Store');
        setTuesdayPoints(generalSelected.currentMonthPointsDisplayName);
        setPrizeImgs(images);
      }
    } catch (e) {
      // console.log(e)
    }
  }, [leaderboard, selectedTab]);

  const renderPrizes = () => {
    const imgStyle = {
      width: 75,
      height: 75,
      marginRight: 5
    };
    const containerStyle = {
      display: 'flex'
    };
    const placeholder = {
      height: 74,
      width: 75,
      paddingTop: 2,
      marginRight: 8,
      border: '1px dashed gray',
      borderRadius: 16
    };

    if (window.innerWidth > 400) {
      return (
        <div style={containerStyle}>
          {prizeImgs.map((img) => (
            <LoadImg key={img} url={img} style={imgStyle} />
          ))}
          {selectedTab === 'tuesday' &&
            [...Array(3 - prizeImgs.length)].map(() => <div key={uuidv4()} style={placeholder} />)}
        </div>
      );
    }

    return null;
  };

  const navigateToStore = () => {
    dispatch(push('/store'));
  };

  const handleClickInfo = () => {
    window.open(SCHOLARSHIP_HELP_URL);
  };

  const me = students.find((s) => s.userId === Number(userId)) || {};
  const imgStyle = {
    width: 75,
    height: 75,
    marginRight: 5
  };
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Tabs
          variant="fullWidth"
          value={selectedTab}
          classes={{
            root: classes.fullWidth
          }}
          onChange={(e, n) => setSelectedTab(n)}
        >
          <Tab
            className="tour-onboarding-leaderboard-tuesday"
            classes={{
              wrapper: classes.tabs
            }}
            label={tuesdayBoardName}
            value="tuesday"
          />
          {showScholarshipTracker && (
            <Tab
              className="tour-onboarding-leaderboard-grand"
              classes={{
                wrapper: classes.tabs
              }}
              label={grandBoardName}
              value="grand"
            />
          )}
        </Tabs>
      </div>
      <TabPanel value={selectedTab} index="grand">
        <div className={classes.scoreContainer}>
          <div className={classes.days}>
            MVPs earned:
            <span className={classes.count}>{leaderboard.data.general.grand.mvpCount}</span>
          </div>
          <div
            style={{
              marginTop: 24
            }}
          >
            <div
              style={{
                display: 'flex'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    marginBottom: 12
                  }}
                >
                  <LoadImg key={prizeImgs[0]} url={prizeImgs[0]} style={imgStyle} />
                </div>
                <div>
                  <Button
                    className={classes.infoButton}
                    onClick={handleClickInfo}
                    variant="outlined"
                  >
                    <Typography>Info</Typography>
                  </Button>
                </div>
              </div>
              <div
                style={{
                  marginLeft: 16
                }}
              >
                <div
                  style={{
                    marginBottom: 2
                  }}
                >
                  <Typography variant="h5">{text}</Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 15
                  }}
                >
                  <div
                    style={{
                      marginRight: 25
                    }}
                  >
                    <div className={classes.highlight}>Amount</div>
                    <div className={classes.label}>{amount}</div>
                  </div>
                  <div
                    style={{
                      marginRight: 25,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div className={classes.highlight}>Number of Winners</div>
                    <div className={classes.label}>{numberOfWinners}</div>
                  </div>
                  <div
                    style={{
                      maxWidth: 250
                    }}
                  >
                    <div className={classes.highlight}>Eligibility Requirements*</div>
                    <div className={classes.labelSmall}>
                      {leaderboard.data.general.grand.eligibility || ''}
                    </div>
                  </div>
                </div>
                <div className={classes.footnote}>
                  {leaderboard.data.general.grand.eligibilitySubtitle || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={selectedTab} index="tuesday">
        <div className={classes.scoreContainer}>
          <div className={classes.days}>
            {timeLabel}:<span className={classes.count}>{time}</span>
          </div>
          <div className={classes.days}>
            Points:
            <span className={classes.count}>{tuesdayPoints}</span>
          </div>
          <div className={classes.footnote}>
            {leaderboard.data.general.tuesday.eligibility || ''}
          </div>
        </div>
        <div className={classes.rewardContainer}>
          {renderPrizes()}
          <div>
            <div className={classes.rewardTitle}>{prizeText}</div>
            <Button
              variant="outlined"
              color="primary"
              onClick={selectedTab === 'grand' ? handleClickInfo : navigateToStore}
              className={classes.button}
            >
              {rewardButtonText}
            </Button>
          </div>
        </div>
      </TabPanel>
      <div className={classes.filterContainer}>
        <Typography variant="h4">Current Leaders</Typography>
      </div>
      <Table
        userId={Number(userId)}
        scoreLabel={scoreLabel}
        pushTo={pushTo}
        students={students}
        sectionId={sectionId}
        selectedTab={selectedTab}
      />
    </div>
  );
};

export default withRoot(withStyles(styles as any)(withWidth()(LeaderBoardTabs)));
