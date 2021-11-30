import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { ButtonBase } from '@material-ui/core';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import QuestionMark from '../../assets/svg/question-mark.svg';
import MessageMark from '../../assets/svg/message-mark.svg';
import ResourceMark from '../../assets/svg/resource-mark.svg';
import FlashcardMark from '../../assets/svg/flashcard-mark.svg';
import NoteMark from '../../assets/svg/note-mark.svg';
import WorkflowMark from '../../assets/svg/workflow-mark.svg';
import BookMark from '../../assets/svg/bookmark.svg';
import Question from '../../assets/svg/question.svg';
import Group from '../../assets/svg/group.svg';
import Exam from '../../assets/svg/exam.svg';
import Organization from '../../assets/svg/organization.svg';
import useStyles from './styles';

type Props = {
  user?: UserState;
};

const StudyCircleIn = ({ user }: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    data: { userId }
  } = user;

  const scrollMove = (id: string) => {
    const element = document.getElementById(id);
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const goToFeed = () => {
    history.push('/feed');
  };

  const goToChat = () => {
    history.push('/chat');
  };

  const goToProfile = () => {
    history.push(`/profile/${userId}`);
  };

  const goToWorkflow = () => {
    history.push('/workflow');
  };

  const goToFlashcard = () => {
    history.push('/flashcards');
  };

  const createNewPost = (tabId: number) => {
    history.push(`/create_post?tab=${tabId}`);
  };

  return (
    <Box>
      <Box>
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Study Tips
        </Typography>
        <Typography className={classes.body} variant="body1" paragraph>
          We get it. Studying can be hard and overwhelming. Sometimes you don’t know where to start.
          But don’t fret! This guide will help you find the best studying method that works best for
          you!
        </Typography>
      </Box>
      <Box mt={5}>
        <Typography variant="h6" paragraph>
          What do you need help with today?
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <ButtonBase className={classes.helpItem} onClick={() => scrollMove('study-tools')}>
              <img src={Question} alt="homework-help" />
              <Typography variant="body1" paragraph>
                Homework Help
              </Typography>
            </ButtonBase>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <ButtonBase className={classes.helpItem} onClick={() => scrollMove('group-project')}>
              <img src={Group} alt="group" />
              <Typography variant="body1" paragraph>
                Group Projects and Studying
              </Typography>
            </ButtonBase>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <ButtonBase className={classes.helpItem} onClick={() => scrollMove('prepare-exam')}>
              <img src={Exam} alt="exam" />
              <Typography variant="body1" paragraph>
                Prepare for an Exam
              </Typography>
            </ButtonBase>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <ButtonBase className={classes.helpItem} onClick={() => scrollMove('organization')}>
              <img src={Organization} alt="organization" />
              <Typography variant="body1" paragraph>
                Organization
              </Typography>
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5}>
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Homework Help
        </Typography>
        <Typography className={classes.body} variant="body1" paragraph>
          It feels terrible to struggle and not have immediate help. Post a question, your
          classmates get notified, and when you vote a student with “Best Answer”, they get 25,000
          points for helping you out.
        </Typography>
      </Box>
      <Box mt={5} id="study-tools">
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Study Tools for Homework Help
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={goToFeed}>
              <img src={QuestionMark} alt="question-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Ask a Question
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              If you’re ever stuck on a homework question or maybe missed class because you were
              sick, ask a question on your Class Feed. One of your classmates may have the answer!
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} id="group-project">
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Group Projects and Studying
        </Typography>
        <Typography className={classes.body} variant="body1" paragraph>
          CircleIn makes group projects and studying so much easier. Don’t worry if someone is down
          the hall or across the country.
        </Typography>
      </Box>
      <Box mt={5}>
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Study Tools for Group Projects and Studying
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={goToChat}>
              <img src={MessageMark} alt="message-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Send a Message
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Study Rooms are a great way to get quick answers on your questions! You can join a
              study room with multiple classmates to share screens and walkthrough difficult
              problems.
            </Typography>
          </Grid>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={() => createNewPost(3)}>
              <img src={ResourceMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Share a Resource
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Sharing resources is a great way to share knowledge and valuable articles in order to
              get your team to be successful. You can share useful resources on your Class Feeds.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} id="prepare-exam">
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Prepare for an Exam
        </Typography>
        <Typography className={classes.body} variant="body1" paragraph>
          CircleIn is great for preparing for your next midterm or final exam.
        </Typography>
      </Box>
      <Box mt={5}>
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Study Tools for Exam Preparation
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={goToFlashcard}>
              <img src={FlashcardMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Create Flashcards
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Creating flashcards is a great way to solidify your understanding of new terms and
              concepts. After you have created your flashcards, check out the following Flashcard
              Modes to review or test your knowledge!
            </Typography>
            <Link href="#" onClick={goToFlashcard}>
              <Typography variant="h6" paragraph className={classes.flashcardLink}>
                Review Time
              </Typography>
            </Link>
            <Link href="#" onClick={goToFlashcard}>
              <Typography variant="h6" paragraph className={classes.flashcardLink}>
                Quiz Yourself
              </Typography>
            </Link>
            <Link href="#" onClick={goToFlashcard}>
              <Typography variant="h6" paragraph className={classes.flashcardLink}>
                Match Magic
              </Typography>
            </Link>
          </Grid>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={() => createNewPost(2)}>
              <img src={NoteMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Upload your Notes
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Writing notes is an effective way to solidy your understanding of new topics and
              concepts. In the future, you can use these notes to review for any upcoming exams!
            </Typography>
            <ButtonBase className={classes.studyAction} onClick={goToWorkflow}>
              <img src={WorkflowMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Add a task to Workflow
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Writing notes is an effective way to solidy your understanding of new topics and
              concepts. In the future, you can use these notes to review for any upcoming exams!
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} id="organization">
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Organization
        </Typography>
        <Typography className={classes.body} variant="body1" paragraph>
          To make life easier, we all need reminders. Setup tasks and reminders to study, to review
          flashcards and to review notes your classmates posted
        </Typography>
      </Box>
      <Box mt={5}>
        <Typography className={classes.pageTitle} variant="h5" paragraph>
          Study Tools for Organization
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={goToWorkflow}>
              <img src={WorkflowMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                Add a task to Workflow
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              Create tasks on Workflow to set up reminders for due dates on projects, essays, and
              any important meetings! These tasks will give you a visual for what you need to
              accomplish and the progress you are making.
            </Typography>
          </Grid>
          <Grid item lg={6} md={12}>
            <ButtonBase className={classes.studyAction} onClick={goToProfile}>
              <img src={BookMark} alt="resource-mark" />
              <Typography variant="h6" paragraph className={classes.studyActionText}>
                View my Bookmarks
              </Typography>
            </ButtonBase>
            <Typography variant="body1" paragraph>
              While browsing your Class Feeds, you may come across posts that you find to be helpful
              or useful. Make sure to Bookmark these posts so you easily access them in the future.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <ScrollToTop />
    </Box>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(StudyCircleIn);
