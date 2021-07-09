// @flow
import React, { useState, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import { StudyRoomOnboardingStepData } from '../../types/models';
import withRoot from '../../withRoot';
import ActionButton from './ActionButton';
import Ellipses from './Ellipses';
import TransparentButton from './TransparentButton';
import StartPlay from '../../assets/svg/video_play.svg';
// import LoadImg from '../../components/LoadImg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    display: 'flex',
    flexDirection: 'column'
  },
  closeIcon: {
    color: 'black',
    position: 'absolute',
    right: 25,
    top: 20,
    cursor: 'pointer'
  },
  imageContainer: {
    height: 365,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(-1),
    padding: theme.spacing(4, 4, 0, 4),
    '& > img': {
      zIndex: 10,
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  mainContainer: {
    backgroundColor: theme.circleIn.palette.gray1,
    padding: theme.spacing(4, 5, 3, 5),
    [theme.breakpoints.down('sm')]: {
      height: 353,
      paddingTop: theme.spacing(4)
    },
    [theme.breakpoints.up('md')]: {
      height: 268,
    }
  },
  textContainer: {
    display: 'grid',
    color: theme.circleIn.palette.secondaryText,
    [theme.breakpoints.down('sm')]: {
      gridTemplateRows: '60px auto',
      height: 230
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '280px auto',
      height: 140
    }
  },
  mediaContainer: {
    height: 365,
  },
  mediaPlayer: {
    position: 'relative',
    width: 750,
    height: 365,
  },
  startPlay: {
    position: 'absolute',
    top: 150,
    left: '50%',
    transform: 'translate(-40px, 0)',
    cursor: 'pointer'
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    '& > h3': { // Title
      margin: 0,
      color: theme.circleIn.palette.secondaryText,
      fontSize: 40,
      fontWeight: 700,
      lineHeight: '50px'
    },
    '& > h4': { // Alarm text
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      background: '-webkit-linear-gradient(-90deg, #94DAF9 0%, #1E88E5 100%)',
      '-webkit-background-clip': 'text',
      textFillColor: 'transparent'
    },
    '& > span': {
      fontSize: 14,
      padding: theme.spacing(2/8, 7/8),
      background: '#F7CD3A',
      color: theme.circleIn.palette.primaryBackground,
      borderRadius: 4,
      marginTop: theme.spacing(0.5),
      width: 54,
      textAlign: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      '& > h3': {
        fontSize: 30
      },
      '& > h4': {
        fontSize: 16
      }
    }
  },
  text: {
    '& > p': {
      maxWidth: 380,
      margin: 0,
      color: theme.circleIn.palette.secondaryText,
      fontSize: 16,
      lineHeight: '24px'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3)
    },
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      marginLeft: 0
    }
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2)
    }
  },
  ellipseContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(0, 0, 2, 0),
  },
  backButton: {
    marginRight: theme.spacing(3),
    lineHeight: '33px',
    cursor: 'pointer'
  }
}));

type Props = {
  data: StudyRoomOnboardingStepData,
  step: number,
  totalSteps: number,
  onAction: Function,
  onBackAction: Function,
  onClose: Function
};

const OnboardingStep = ({
  data,
  step,
  totalSteps,
  onAction,
  onBackAction,
  onClose
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef(null);
  const classes = useStyles();

  const handleBack = useCallback(() => {
    if (step === 1) {
      onClose()
    }

    onBackAction()
  }, [step, onClose, onBackAction])

  const handleClick = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!player.current) return;
    !isPlaying && player.current.play();
    isPlaying && player.current.pause();
  }, [isPlaying])

  return (
    <div className={classes.root} style={{ background: step === 1 && 'black' }}>
      { step !== 1 && (
        <CloseIcon
          className={classes.closeIcon}
          onClick={onClose}
        />
      )}
      { step === 1 && (
        <div className={classes.mediaContainer}>
          <CardMedia
            component='video'
            className={classes.mediaPlayer}
            image='https://media.circleinapp.com/img/onboarding/CircleIn_Flashcard_Onboarding.webm'
            controls={isPlaying}
            ref={player}
          />
          { !isPlaying && (
            <img
              src={StartPlay}
              className={classes.startPlay}
              alt="Video Play Icon"
              onClick={handleClick}
            />
          )}
        </div>
      )}
      { step !== 1 && (
        <div className={classes.imageContainer}>
          <img src={data.imageUrl} alt="Study Room Onboarding" />
        </div>
      )}
      <div className={classes.mainContainer}>
        <div className={classes.ellipseContainer}>
          <Ellipses step={step} totalSteps={totalSteps} />
        </div>
        <div className={classes.textContainer}>
          <div className={classes.title}>
            <Typography component="h4">
              { data.title }
            </Typography>
            <Typography component="h3">
              Flashcards
            </Typography>
            <span className="betaText">
              BETA
            </span>
          </div>
          <div className={classes.text}>
            <Typography component="p">
              { data.text }
            </Typography>
          </div>
        </div>
        <div className={classes.actionContainer}>
          <TransparentButton onClick={() => handleBack()}>
            { data.backText }
          </TransparentButton>
          <ActionButton onClick={() => onAction()}>
            { data.actionText }
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default withRoot(OnboardingStep);
