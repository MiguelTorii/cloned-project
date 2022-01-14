import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import Box from '@material-ui/core/Box';

import withRoot from '../../withRoot';
import Dialog from '../Dialog/Dialog';
import LoadImg from '../LoadImg/LoadImg';
import shareNotes from '../../assets/svg/share_notes.svg';
import answerQuestions from '../../assets/svg/answer_questions.svg';
import studyVirtually from '../../assets/svg/study-virtually.svg';

import { styles } from '../_styles/LeaderBoardTabs/PrizeDialog';

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
  }
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
}) => (
  <Dialog
    className={classes.dialog}
    onCancel={handleCloseDialog}
    open={openDialog}
    title={dialogTitle}
  >
    <Box className={classes.subtitle}>
      For students who positively impact their classmates’ academic success through collaboration on
      CircleIn.
    </Box>
    <hr className={classes.hr} />
    <Box padding={20}>
      <Box className={classes.dialogTable}>
        <Box mr={3}>
          <Box className={classes.highlight}>Amount</Box>
          <Box className={classes.label}>{amount}</Box>
        </Box>
        <Box mr={3} whiteSpace="nowrap">
          <Box className={classes.highlight}>Number of Winners</Box>
          <Box className={classes.label}>{numberOfWinners}</Box>
        </Box>
        <Box maxWidth={250}>
          <Box className={classes.highlight}>Eligibility Requirements</Box>
          <Box className={classes.label}>{eligibilityDialog}</Box>
        </Box>
      </Box>
      <Box className={classes.dialogFootnote}>{eligibilitySubtitleDialog}</Box>
      <Box className={classes.title}>Best Practices to Earn MVPs:</Box>
      <Box className={classes.mvpActions}>
        {mvpActions.map((action) => (
          <Box key={action.title} className={classes.mvpAction}>
            <LoadImg
              key={action.imageUrl}
              url={action.imageUrl}
              style={{
                width: 75,
                height: 75,
                marginRight: 5
              }}
            />
            <Box mt={0}>
              <b>{action.title}</b>
            </Box>
            <Box mt={1}>{action.text}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Dialog>
);

export default withRoot(withStyles(styles as any)(withWidth()(LeaderBoardTabs)));
