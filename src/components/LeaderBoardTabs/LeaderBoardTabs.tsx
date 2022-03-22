import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'query-string';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withWidth from '@material-ui/core/withWidth';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { useStyles as useHighlightedButtonStyles } from 'styles/HighlightedButton';

import { useMediaQuery } from 'hooks';
import withRoot from '../../withRoot';
import Table from './table';
import LoadImg from '../LoadImg/LoadImg';
import { styles } from '../_styles/LeaderBoardTabs';
import { SCHOLARSHIP_HELP_URL } from '../../constants/app';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import { REWARDS_STORE_AREA } from '../../hud/navigationState/hudNavigation';
import useCampaigns from 'hooks/useCampaigns';

const IMAGE_STYLE = {
  width: 75,
  height: 75,
  marginRight: 5
};

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
  const highlightedButtonClasses = useHighlightedButtonStyles();
  const { search } = useLocation();
  const { isMobileScreen } = useMediaQuery();
  const { isRewardsCampaignActive } = useCampaigns();

  const [selectedTab, setSelectedTab] = useState<string>(
    (qs.parse(search).tab as string) || 'tuesday'
  );
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

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  const isRewardsStoreHighlighted = (): boolean =>
    REWARDS_STORE_AREA === highlightedNavigation?.leafAreaId;

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
      console.error(e);
    }
  }, [leaderboard, selectedTab]);

  const renderPrizes = () => {
    if (window.innerWidth <= 400) {
      return null;
    }

    return (
      <Box display="flex">
        {prizeImgs.map((img) => (
          <LoadImg key={img} url={img} style={IMAGE_STYLE} />
        ))}
        {selectedTab === 'tuesday' &&
          [...Array(3 - prizeImgs.length)].map(() => (
            <Box
              key={uuidv4()}
              style={{
                ...IMAGE_STYLE,
                paddingTop: 2,
                marginRight: 8,
                border: '1px dashed gray',
                borderRadius: 16
              }}
            />
          ))}
      </Box>
    );
  };

  const navigateToStore = () => {
    dispatch(push('/store'));
  };

  const handleClickInfo = () => {
    window.open(SCHOLARSHIP_HELP_URL);
  };

  const EligibilitySection = (
    <>
      <Box className={classes.highlight}>Eligibility Requirements*</Box>
      <Box className={classes.labelSmall}>{leaderboard.data.general.grand.eligibility || ''}</Box>
    </>
  );

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Tabs
          variant="fullWidth"
          value={selectedTab}
          classes={{
            root: classes.fullWidth
          }}
          onChange={(e, n) => setSelectedTab(n)}
        >
          <Tab
            classes={{
              wrapper: classes.tabs
            }}
            label={tuesdayBoardName}
            value="tuesday"
          />
          {isRewardsCampaignActive && (
            <Tab
              classes={{
                wrapper: classes.tabs
              }}
              label={grandBoardName}
              value="grand"
            />
          )}
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index="grand">
        <Box className={classes.scoreContainer}>
          <Box className={classes.days}>
            MVPs earned:
            <span className={classes.count}>{leaderboard.data.general.grand.mvpCount}</span>
          </Box>
          <Box mt={3}>
            <Box display="flex">
              <Box display="flex" flexDirection="column">
                <Box mb={1.5}>
                  <LoadImg key={prizeImgs[0]} url={prizeImgs[0]} style={IMAGE_STYLE} />
                </Box>
                <Box>
                  <Button
                    className={classes.infoButton}
                    onClick={handleClickInfo}
                    variant="outlined"
                  >
                    <Typography>Info</Typography>
                  </Button>
                </Box>
              </Box>
              <Box ml={2}>
                <Box mb={0.5}>
                  <Typography variant="h5">{text}</Typography>
                </Box>
                <Box display="flex" mb={2}>
                  <Box mr={3}>
                    <Box className={classes.highlight}>Amount</Box>
                    <Box className={classes.label}>{amount}</Box>
                  </Box>
                  <Box mr={3} whiteSpace="nowrap">
                    <Box className={classes.highlight}>Number of Winners</Box>
                    <Box className={classes.label}>{numberOfWinners}</Box>
                  </Box>
                  <Box maxWidth={250} display={isMobileScreen ? 'none' : 'block'}>
                    {EligibilitySection}
                  </Box>
                </Box>
                <Box mb={0.5} maxWidth={250} display={isMobileScreen ? 'block' : 'none'}>
                  {EligibilitySection}
                </Box>
                <Box className={classes.footnote}>
                  {leaderboard.data.general.grand.eligibilitySubtitle || ''}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={selectedTab} index="tuesday">
        <Box className={classes.scoreContainer}>
          <Box className={classes.days}>
            {timeLabel}:<span className={classes.count}>{time}</span>
          </Box>
          <Box className={classes.days}>
            Points:
            <span className={classes.count}>{tuesdayPoints}</span>
          </Box>
          <Box className={classes.footnote}>
            {leaderboard.data.general.tuesday.eligibility || ''}
          </Box>
        </Box>
        <Box className={classes.rewardContainer}>
          {renderPrizes()}
          <Box>
            <Box className={classes.rewardTitle}>{prizeText}</Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={selectedTab === 'grand' ? handleClickInfo : navigateToStore}
              className={cx(
                classes.button,
                isRewardsStoreHighlighted() && highlightedButtonClasses.animated
              )}
            >
              {rewardButtonText}
            </Button>
          </Box>
        </Box>
      </TabPanel>
      <Box className={classes.filterContainer}>
        <Typography variant="h4">Current Leaders</Typography>
      </Box>
      <Table
        userId={Number(userId)}
        scoreLabel={scoreLabel}
        pushTo={pushTo}
        students={students}
        sectionId={sectionId}
        selectedTab={selectedTab}
      />
    </Box>
  );
};

export default withRoot(withStyles(styles as any)(withWidth()(LeaderBoardTabs)));
