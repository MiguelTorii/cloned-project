import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import LoadImg from "components/LoadImg/LoadImg";
import { StudyRoomOnboardingStepData } from "../../types/models";
import withRoot from "../../withRoot";
import Ellipses from "./Ellipses";
import TransparentButton from "./TransparentButton";
import ActionButton from "./ActionButton";
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
      padding: theme.spacing(3)
    },
    [theme.breakpoints.up('md')]: {
      height: 268
    }
  },
  textContainer: {
    display: 'grid',
    color: theme.circleIn.palette.secondaryText,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      gridTemplateRows: '60px auto',
      height: 'auto'
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '280px auto',
      height: 140
    }
  },
  title1: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 240,
    '& > h3': {
      // Title
      margin: 0,
      fontSize: 24,
      fontWeight: 400,
      lineHeight: '125%'
    },
    '& > h4': {
      // Alarm text
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      background: '-webkit-linear-gradient(-90deg, #94DAF9 0%, #1E88E5 100%)',
      '-webkit-background-clip': 'text',
      textFillColor: 'transparent'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
      alignItems: 'center',
      '& > h3': {
        fontSize: 28
      },
      '& > h4': {
        fontSize: 16,
        display: 'none'
      }
    }
  },
  text: {
    '& > p': {
      margin: 0,
      fontSize: 14,
      lineHeight: '19px'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2)
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
      marginTop: theme.spacing(2),
      fontSize: 14
    }
  },
  ellipseContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  img: {
    maxWidth: 563,
    width: '100%'
  }
}));
type Props = {
  data: StudyRoomOnboardingStepData;
  step: number;
  totalSteps: number;
  onAction: (...args: Array<any>) => any;
  onBackAction: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
};

const OnboardingStep = ({
  data,
  step,
  totalSteps,
  onAction,
  onBackAction,
  onClose
}: Props) => {
  const classes = useStyles();
  const handleBack = useCallback(() => {
    if (step === 1) {
      onClose();
    }

    onBackAction();
  }, [step, onClose, onBackAction]);
  return <div className={classes.root}>
      <CloseIcon className={classes.closeIcon} onClick={onClose} />
      <div className={classes.imageContainer}>
        <LoadImg url={data.imageUrl} className={classes.img} />
      </div>
      <div className={classes.mainContainer}>
        <div className={classes.ellipseContainer}>
          <Ellipses step={step} totalSteps={totalSteps} />
        </div>
        <div className={classes.textContainer}>
          <div className={classes.title}>
            <Typography component="h4">{data.title1}</Typography>
            <Typography component="h3" style={{
            fontSize: step === 1 && 40
          }}>
              {data.title}
            </Typography>
          </div>
          <div className={classes.text}>
            <Typography component="p">{data.text}</Typography>
          </div>
        </div>
        <div className={classes.actionContainer}>
          <TransparentButton onClick={() => handleBack()}>{data.backText}</TransparentButton>
          <ActionButton onClick={() => onAction()}>{data.actionText}</ActionButton>
        </div>
      </div>
    </div>;
};

export default withRoot(OnboardingStep);