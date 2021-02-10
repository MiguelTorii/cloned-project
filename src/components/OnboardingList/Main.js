// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';

import type {
  OnboardingList as OnboardingListType,
  OnboardingListItem as OnboardingListItemType
} from 'types/models';
import * as onboardingActions from 'actions/onboarding';

import checkmarkSvg from 'assets/svg/checkmark.svg';
import checkmarkEmptySvg from 'assets/svg/checkmark_empty.svg';

const text = {
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 1,
}

const ID_TO_URL = {
  1: '/reminders',
  2: '/chat',
  3: '/store',
  4: '/create/flashcards'
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: theme.spacing(),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  icon: {
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: isNarrow => isNarrow ? 'column' : 'row',
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    marginRight: theme.spacing(4),
    marginBottom: isNarrow => isNarrow ? theme.spacing(2) : 0,
  },
  listItemText: {
    ...text,
    color: '#6d7884',
  },
  listItemTextCompleted: text,
  listItemCheckBox: {
    height: 26,
    paddingRight: theme.spacing(2),
  },
  progress: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: isNarrow => isNarrow ? 'column' : 'row',
    marginTop: theme.spacing(3),
  },
  progressBar: {
    backgroundColor: theme.circleIn.palette.success,
  },
  progressColorPrimary: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  progressLabel: {
    ...text,
    marginLeft: isNarrow => isNarrow ? 0 : theme.spacing(2),
    marginTop: isNarrow => isNarrow ? theme.spacing(2) : 0,
    whiteSpace: 'nowrap',
  },
  progressRoot: {
    height: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: theme.spacing(),
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: theme.spacing(2),
  }
}));

type Props = {
  finishOnboardingList: Function,
  getOnboardingList: Function,
  isNarrowBox: boolean,
  onboardingList: OnboardingListType,
  viewedOnboarding: boolean,
  width: string
};

const OnboardingList = ({
  finishOnboardingList,
  getOnboardingList,
  isNarrowBox = false,
  onboardingList,
  viewedOnboarding,
  width
}: Props) => {
  const isNarrow = isNarrowBox || ['xs', 'sm'].includes(width);
  const classes = useStyles(isNarrow);

  useEffect(() => {
    getOnboardingList();
  }, [getOnboardingList]);

  if (
    !viewedOnboarding ||
    onboardingList?.checklist?.length < 1 ||
    !onboardingList.visible
  )
    return null;

  const LinearProgressWithLabel = ({ value }: { value: number }) => (
    <Box className={classes.progress}>
      <Box width='100%'>
        <LinearProgress
          classes={{
            bar: classes.progressBar,
            colorPrimary: classes.progressColorPrimary,
            root: classes.progressRoot
          }}
          value={value}
          variant='determinate'
        />
      </Box>
      <Box>
        <Typography className={classes.progressLabel}>
          {`${Math.round(value)}% Complete`}
        </Typography>
      </Box>
    </Box>
  )

  const ItemLink = React.forwardRef(({ completed, href, ...props }, ref) =>
    <RouterLink
      style={{
        color: 'inherit',
        cursor: completed ? 'auto' : 'pointer',
        textDecoration: 'none'
      }}
      to={completed ? '' : href} {...props} ref={ref}
    />);

  const OnboardingListItem = ({ item }: { item: OnboardingListItemType }) => (
    <Link completed={item.completed} href={ID_TO_URL[item.id]} component={ItemLink}>
      <div className={classes.listItem}>
        <div className={classes.listItemCheckBox}>
          {
            item.completed
              ? <img src={checkmarkSvg} alt='checkmark' />
              : <img src={checkmarkEmptySvg} alt='checkmark' />
          }
        </div>
        <div
          className={item.completed ? classes.listItemText: classes.listItemTextCompleted}
        >
          {item.text}
        </div>
      </div>
    </Link>
  );

  const completedItems = onboardingList.checklist.filter(i => i.completed);
  const completionPercentage = (completedItems.length / onboardingList.checklist.length) * 100;
  const isCompleted = completedItems.length === onboardingList.checklist.length;

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        {
          isCompleted &&
          <CloseIcon className={classes.icon} onClick={finishOnboardingList} />
        }
        <div className={classes.title}>
          {isCompleted
            ? `You're ready to use CircleIn to the fullest!`
            : `Get Started on CircleIn`}
        </div>
      </div>
      <div className={classes.list}>
        {
          onboardingList.checklist.map(item => (
            <OnboardingListItem item={item} />
          ))
        }
      </div>
      <LinearProgressWithLabel value={completionPercentage} />
    </div>
  )
}

const mapStateToProps = ({ user: { syncData: { viewedOnboarding } }, onboarding }): {} => ({
  onboardingList: onboarding.onboardingList,
  viewedOnboarding
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      finishOnboardingList: onboardingActions.finishOnboardingList,
      getOnboardingList: onboardingActions.getOnboardingList,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(OnboardingList));
