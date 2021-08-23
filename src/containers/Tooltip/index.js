// @flow

import React, {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useState
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MuiTooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Zoom from '@material-ui/core/Fade';
import { withRouter } from 'react-router';
import cx from 'clsx';
import cryptoRandomString from 'crypto-random-string';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user';

const styles = (theme) => ({
  primaryTooltip: {
    background: '#7572f7',
    borderRadius: 8,
    padding: '8px 12px',
    pointerEvents: 'initial',
    width: 255
  },
  secondaryTooltip: {
    background: theme.circleIn.palette.brand,
    borderRadius: 8,
    padding: '8px 12px',
    pointerEvents: 'initial',
    width: 255
  },
  text: {
    fontSize: 18,
    lineHeight: 1.4
  },
  primaryArrow: {
    color: '#7572f7',
    fontSize: 12,
    marginTop: 0
  },
  secondaryArrow: {
    color: theme.circleIn.palette.brand,
    fontSize: 24,
    marginTop: 0
  },
  button: {
    borderColor: theme.circleIn.palette.primaryText1,
    color: theme.circleIn.palette.primaryText1,
    marginTop: theme.spacing(),
    marginLeft: 'auto',
    marginBottom: 2
  },
  close: {
    marginRight: -4,
    marginTop: -2,
    textAlign: 'right'
  },
  overDialog: {
    zIndex: 1500
  }
});

type Props = {
  children: Object | Array<Object>,
  classes: Object,
  confirmTooltip: Function,
  dialogVisible: boolean,
  delay: ?number,
  id: number,
  hidden: ?boolean,
  location: { pathname: string },
  placement: string,
  text: string,
  okButton: ?string,
  viewedOnboarding: boolean,
  viewedTooltips: Array<number>,
  totalSteps: ?number,
  variant: ?string,
  completedSteps: ?number
};

const CHAT = 3292;
const LEADERBOARD = 6938;
const BOOKMARKS = 9043;
const THANKS = 2197;
const FLASHCARDS = 1194;
const NEW_POST = 5792;
const FLASHCARD_BOTTOM = 4212;
const FLASHCARD_TOP = 5436;
const STUDENT_BLOG = 3181;

const NOTES_QUICKNOTE = 2341;
const NOTES_GET_STARTED = 5909;
const NOTES_CLASS_FOLDER = 9002;
const NOTES_FULLSCREEN = 1204;
const QUICKNOTES_SAVED = 3499;

const EXPERT_BUTTON = 9044;
const EXPERT_FEED = 9045;
const EXPERT_CLASS_SELECT = 9046;
const EXPERT_FEED_FILTERS = 9047;
const EXPERT_BATCH_CHAT_BUTTON = 9048;
const EXPERT_BATCH_CHAT_SELECT_CLASSES = 9049;
const EXPERT_POST_SELECT_CLASSES = 9050;
const EXPERT_MULTIPLE_CLASS_SELECT = 9051;

const NEW_FEED_CLASSES = 9054;
const STUDENT_FEED_CLASSES = 9055;
const STUDENT_CLASS_LEADERBOARD = 9056;
const STUDENT_CLASSMATES = 9057;

const VIDEO_CHAT = 9059;

const VIDEO_CHAT_INVITE = 9061;
const VIDEO_CHAT_PARTICIPANTS = 9062;
const VIDEO_CHAT_SCREEN = 9063;
const VIDEO_CHAT_SETTINGS = 9064;

// not an actual tooltip
// eslint-disable-next-line
const GET_APP_POPUP = 4432;
// eslint-disable-next-line
const ONBOARDING_EXPERT = 9052;
// eslint-disable-next-line
const ONBOARDING_NOTES = 8453;

const GO_CHAT = 9087;
const GIVEAWAY_BANNER = 9088;
const CREATE_NEW_POST = 9090;
// const GO_HOME = 9086;
// const COMMENT_FEED = 9091;

const TRANSITION_TIME = 750;

const TooltipStep = ({ completed }) => (
  <div
    style={{
      borderRadius: '50%',
      margin: 4,
      width: 12,
      height: 12,
      backgroundColor: completed ? '#FFFFFF' : 'transparent',
      border: '1px solid #FFFFFF'
    }}
  />
);

const Tooltip = ({
  children,
  classes,
  confirmTooltip,
  delay = 2000,
  dialogVisible,
  id,
  hidden = false,
  location: { pathname },
  placement,
  text,
  okButton = 'Got it',
  viewedOnboarding,
  viewedTooltips,
  variant = 'primary',
  totalSteps,
  completedSteps
}: Props) => {
  const [open, setOpen] = useState(false);

  const timer = useRef();

  const isOpen = useCallback(() => {
    let result = true;
    clearTimeout(timer.current);

    if (
      hidden ||
      id === LEADERBOARD ||
      // eslint-disable-next-line
      (dialogVisible && ![FLASHCARD_BOTTOM, FLASHCARD_TOP].includes(id)) ||
      !viewedOnboarding || // Onboarding not completed
      viewedTooltips === null || // Data still loading
      viewedTooltips.includes(id) // Tooltip already dismissed by user
    ) {
      result = false;
    } else {
      switch (id) {
        case STUDENT_CLASSMATES:
          result = viewedTooltips.includes(STUDENT_CLASS_LEADERBOARD);
          break;
        case STUDENT_CLASS_LEADERBOARD:
          result = viewedTooltips.includes(STUDENT_FEED_CLASSES);
          break;
        case STUDENT_FEED_CLASSES:
          result = viewedTooltips.includes(NEW_FEED_CLASSES);
          break;
        case NEW_FEED_CLASSES:
          result = viewedTooltips.includes(NEW_POST);
          break;
        case EXPERT_MULTIPLE_CLASS_SELECT:
          result = viewedTooltips.includes(EXPERT_POST_SELECT_CLASSES);
          break;
        case EXPERT_POST_SELECT_CLASSES:
          result = viewedTooltips.includes(EXPERT_BUTTON);
          break;
        case EXPERT_BATCH_CHAT_BUTTON:
          result = true;
          break;
        case EXPERT_FEED_FILTERS:
          result = viewedTooltips.includes(EXPERT_CLASS_SELECT);
          break;
        case EXPERT_CLASS_SELECT:
          result = viewedTooltips.includes(EXPERT_FEED);
          break;
        case EXPERT_FEED:
          result = viewedTooltips.includes(EXPERT_BUTTON);
          break;
        case EXPERT_BUTTON:
          result = viewedTooltips.includes(NEW_POST);
          break;
        case NOTES_QUICKNOTE:
          result = viewedTooltips.includes(CHAT);
          break;
        case NOTES_GET_STARTED:
          result = true;
          break;
        case NOTES_CLASS_FOLDER:
          result = viewedTooltips.includes(CHAT);
          break;
        case NOTES_FULLSCREEN:
          result = true;
          break;
        case VIDEO_CHAT:
          result = true;
          break;
        case CHAT:
          result = viewedTooltips.includes(VIDEO_CHAT);
          break;
        case STUDENT_BLOG:
          result = true;
          break;
        case FLASHCARDS:
          result = viewedTooltips.includes(CHAT);
          break;
        case NEW_POST:
          result =
            viewedTooltips.includes(CHAT) && pathname.indexOf('/feed') === 0;
          break;
        case BOOKMARKS:
          result = viewedTooltips.includes(CHAT);
          break;
        case THANKS:
          result =
            viewedTooltips.includes(CHAT) && viewedTooltips.includes(BOOKMARKS);
          break;
        case FLASHCARD_BOTTOM:
          result = viewedTooltips.includes(FLASHCARD_TOP);
          break;
        case VIDEO_CHAT_INVITE:
          result = true;
          break;
        case VIDEO_CHAT_PARTICIPANTS:
          result = viewedTooltips.includes(VIDEO_CHAT_INVITE);
          break;
        case VIDEO_CHAT_SETTINGS:
          result = viewedTooltips.includes(VIDEO_CHAT_PARTICIPANTS);
          break;
        case VIDEO_CHAT_SCREEN:
          result = viewedTooltips.includes(VIDEO_CHAT_SETTINGS);
          break;
        case GO_CHAT:
          result = viewedTooltips.includes(GIVEAWAY_BANNER);
          break;
        case CREATE_NEW_POST:
          result = viewedTooltips.includes(GIVEAWAY_BANNER);
          break;
        default:
          result = true;
      }
    }

    if (result) {
      timer.current = setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(false);
    }
  }, [
    id,
    delay,
    dialogVisible,
    hidden,
    pathname,
    viewedTooltips,
    viewedOnboarding
  ]);

  const onClick = (e) => {
    e.stopPropagation();
    confirmTooltip(id);
  };

  useEffect(() => {
    isOpen();
  }, [isOpen]);

  const overDialog = useMemo(
    () =>
      cx(
        [
          FLASHCARD_TOP,
          FLASHCARD_BOTTOM,
          QUICKNOTES_SAVED,
          EXPERT_MULTIPLE_CLASS_SELECT,
          EXPERT_BATCH_CHAT_SELECT_CLASSES
        ].includes(id) && classes.overDialog
      ),
    [classes.overDialog, id]
  );

  return (
    <MuiTooltip
      arrow
      classes={{
        popper: overDialog,
        arrow:
          variant === 'secondary'
            ? classes.secondaryArrow
            : classes.primaryArrow,
        tooltip:
          variant === 'secondary'
            ? classes.secondaryTooltip
            : classes.primaryTooltip
      }}
      PopperProps={{ disablePortal: true }}
      open={open}
      placement={placement}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: TRANSITION_TIME }}
      title={
        <div className={classes.tooltipContent}>
          <div className={classes.close}>
            <CloseIcon
              fontSize="small"
              onClick={(e) => onClick(e)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div>
            <Typography variant="subtitle1" className={classes.text}>
              {text}
            </Typography>
            <Box display="flex">
              {totalSteps > 0 && (
                <Box
                  display="flex"
                  position="absolute"
                  right="45%"
                  bottom="8px"
                >
                  <TooltipStep completed />
                  {[...Array(completedSteps)].map(() => (
                    <TooltipStep
                      key={cryptoRandomString({ length: 10, type: 'base64' })}
                      completed
                    />
                  ))}
                  {[...Array(totalSteps - completedSteps)].map(() => (
                    <TooltipStep
                      key={cryptoRandomString({ length: 10, type: 'base64' })}
                    />
                  ))}
                </Box>
              )}
              <Button
                className={classes.button}
                variant="outlined"
                onClick={(e) => onClick(e)}
              >
                {okButton}
              </Button>
            </Box>
          </div>
        </div>
      }
    >
      <div>{children}</div>
    </MuiTooltip>
  );
};

const mapStateToProps = ({
  user: {
    syncData: { viewedOnboarding, viewedTooltips }
  },
  dialog: { visible }
}): {} => ({
  dialogVisible: visible,
  viewedOnboarding,
  viewedTooltips
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Tooltip)));
