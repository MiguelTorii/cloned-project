import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CardMedia from '@material-ui/core/CardMedia';
import { logEventLocally } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Dialog from '../../components/Dialog/Dialog';
import LoadImg from '../../components/LoadImg/LoadImg';
import classesImg from '../../assets/img/circleIn-fem-mascot.png';
import studentWin from '../../assets/video/student-winning.mp4';
import notes from '../../assets/gif/notes.gif';
import workflowDemo from '../../assets/gif/wf.gif';
import chatDemo from '../../assets/gif/chats.gif';
import StartPlay from '../../assets/svg/video_play.svg';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';
import styles from './_styles/boardingStyles';

type Props = {
  classes: Record<string, any>;
  open: boolean;
  userId: string;
  updateOnboarding: (...args: Array<any>) => any;
};

const Onboarding = ({ classes, open, userId, updateOnboarding }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef(null);
  useEffect(() => {
    if (open) {
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Started'
      });
    }
  }, [open, userId]);
  const handleClick = useCallback(() => {
    setIsPlaying(!isPlaying);

    if (!player.current) {
      return;
    }

    if (!isPlaying) {
      player.current.play();
    } else {
      player.current.pause();
    }
  }, [isPlaying]);

  const Intro = () => (
    <div className={classes.demoClass}>
      <div className={classes.femGirl}>
        <LoadImg
          url={classesImg}
          style={{
            width: '100%',
            marginBottom: -5
          }}
        />
      </div>
    </div>
  );

  const StudentWin = () => (
    <div className={classes.videoPlayer}>
      <CardMedia
        component="video"
        className={classes.demoGif}
        image={studentWin}
        controls={isPlaying}
        ref={player}
      />
      {!isPlaying && (
        <img
          aria-hidden="true"
          src={StartPlay}
          className={classes.startPlay}
          alt="Video Play Icon"
          onClick={handleClick}
        />
      )}
    </div>
  );

  const RenderNotes = () => (
    <div className={classes.domGifArea}>
      <img alt="notes demo" className={classes.notesGif} src={notes} />
    </div>
  );

  const WorkflowDemo = () => (
    <div className={classes.domGifArea}>
      <div className={classes.wfGifArea}>
        <img alt="workflow demo" className={classes.wfGif} src={workflowDemo} />
      </div>
    </div>
  );

  const ChatDemo = () => (
    <div className={classes.domGifArea}>
      <img alt="chat demo" className={classes.chatGif} src={chatDemo} />
    </div>
  );

  const STEPS = [
    {
      id: 'step-1',
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Tell me more...',
      demoComponent: Intro,
      textRows: [
        'We bring students together who help each other out during the ups and downs of a semester like when you can’t seem to solve a problem, need some guidance, when you don’t want to study alone, things like that.',
        'By the way, there are points, rewards and scholarships too...'
      ],
      title: 'Yay! You’re here! 🎉'
    },
    {
      id: 'step-2',
      actionComponent: null,
      buttonDisabled: false,
      buttonText: `I’m listening...`,
      demoComponent: StudentWin,
      textRows: [
        'Yes. For real! ',
        'The more you help your classmates, and the more you learn -- the more you earn points and receive daily chances to win gift cards. 🤑'
      ],
      title: 'Study with classmates & win gift cards? 😱'
    },
    {
      id: 'step-3',
      actionComponent: null,
      buttonDisabled: false,
      buttonText: `Got it...`,
      demoComponent: RenderNotes,
      textRows: [
        'When you post notes and resources (flashcards, links) for your classmates to check out, yep, you get points! 🔥'
      ],
      title: 'Points for: Taking & Sharing Notes! 📝'
    },
    {
      id: 'step-4',
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Interesting, next...',
      demoComponent: WorkflowDemo,
      textRows: [
        'College gets real chaotic, real fast. Students who are organized are less stressed and less likely to fail. Add your tasks, perform better and get points.'
      ],
      title: 'Points for: Managing tasks in CircleIn ✅'
    },
    {
      id: 'step-5',
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Let’s get started! 🚀',
      demoComponent: ChatDemo,
      textRows: [
        'We put all your classmates in a chat group so you can reach everyone on your phone or computer to help each other out. You get points too for chatting! Introduce yourself by sharing your name and major! 😊'
      ],
      title: 'Points for: Chatting with classmates 💬,'
    }
  ];

  const handleButtonClick = async () => {
    if (activeStep === STEPS.length - 1) {
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Ended'
      });
      updateOnboarding({
        viewedOnboarding: true
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const goBack = () => {
    setActiveStep(activeStep - 1);
  };

  const OnboardingStep = ({
    buttonDisabled,
    buttonText,
    ActionComponent = null,
    DemoComponent,
    textRows,
    title
  }) => (
    <div className={classes.step}>
      <div className={classes.actionPanel}>
        <AppLogo className={classes.logo} />
        <div className={classes.title}>{title}</div>
        <div className={classes.textRows}>
          {textRows.map((textRow) => (
            <div key={Math.random()} className={classes.textRow}>
              {textRow}
            </div>
          ))}
        </div>
        <div className={classes.actionPanelComponent}>{ActionComponent && <ActionComponent />}</div>
        <div>
          <Button
            color="primary"
            {...({ label: <span className={classes.buttonLabel} /> } as any)}
            disabled={buttonDisabled}
            className={classes.button}
            classes={{
              label: classes.buttonLabel
            }}
            onClick={handleButtonClick}
            variant="contained"
          >
            {buttonText}
          </Button>
        </div>
        <div className={classes.sildeButtons}>
          {activeStep > 0 && (
            <div className={classes.backButton}>
              <Button color="primary" onClick={goBack}>
                <ArrowBackIosIcon className={classes.backIcon} />
                <u>BACK</u>
              </Button>
            </div>
          )}
          {STEPS.map((step, index) => {
            const sharpClass = activeStep >= index ? classes.shape : '';
            return <div key={step.id} className={cx(sharpClass, classes.shapeCircle)} />;
          })}
        </div>
      </div>
      <div className={classes.demoPanel}>{DemoComponent && <DemoComponent />}</div>
    </div>
  );

  const currentStep = STEPS[activeStep];
  return (
    <ErrorBoundary>
      <Dialog
        ariaDescribedBy="onboarding-description"
        className={classes.dialog}
        contentClassName={classes.contentDialog}
        disableEscapeKeyDown
        open={open}
        showHeader={false}
      >
        <OnboardingStep
          ActionComponent={currentStep.actionComponent || null}
          buttonDisabled={currentStep.buttonDisabled}
          buttonText={currentStep.buttonText}
          DemoComponent={currentStep.demoComponent}
          textRows={currentStep.textRows}
          title={currentStep.title}
        />
      </Dialog>
    </ErrorBoundary>
  );
};

export default memo(withStyles(styles as any)(Onboarding));
