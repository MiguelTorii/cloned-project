import React, { useMemo, useCallback, useState, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import ClassCard from './ClassCard';
import { leaveUserClass } from '../../api/user';
import AddRemoveClasses from '../../components/AddRemoveClasses/AddRemoveClasses';
import FiltersBar from '../../components/FiltersBar/FiltersBar';
import Empty from './Empty';
import EmptyState from '../../components/FeedList/EmptyState';
import { cypher } from '../../utils/crypto';
import EmptyClass from '../../assets/svg/empty-class.svg';
import withRoot from '../../withRoot';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as userActions from '../../actions/user';
import * as feedActions from '../../actions/feed';

const Filters = {
  current: {
    text: 'Current Classes'
  },
  past: {
    text: 'Past Classes'
  }
};

const styles = (theme) => ({
  item: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(4),
    fontWeight: 'bold'
  },
  container: {
    marginTop: theme.spacing()
  },
  wrapper: {
    padding: theme.spacing(5)
  },
  pastNote: {
    maxWidth: 564,
    marginTop: theme.spacing(2)
  },
  emptyTitle: {
    color: theme.circleIn.palette.darkTextColor,
    fontWeight: 600,
    fontSize: 24,
    lineHeight: '33px',
    textAlign: 'center'
  },
  emptyBody: {
    maxWidth: 370,
    color: theme.circleIn.palette.darkTextColor,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '22px',
    textAlign: 'center'
  },
  progress: {
    margin: 'auto',
    marginTop: theme.spacing(4)
  }
});

type Props = {
  classes?: Record<string, any>;
  fetchClasses?: (...args: Array<any>) => any;
  user?: UserState;
  pushTo?: (...args: Array<any>) => any;
  clearFeeds?: (...args: Array<any>) => any;
};

const Classes = ({ pushTo, fetchClasses, classes, user }: Props) => {
  const [classList, setClassList] = useState([]);
  const [canAddClasses, setCanAddClasses] = useState(false);
  const [openAddClasses, setOpenAddClasses] = useState(false);
  const [emptyLogo, setEmptyLogo] = useState('');
  const [emptyVisibility, setEmptyVisibility] = useState(false);
  const [emptyBody, setEmptyBody] = useState('');
  const [currentFilter, setCurrentFilter] = useState('current');
  const [loading, setLoading] = useState(false);
  const arrFilters = useMemo(
    () =>
      Object.keys(Filters).map((key) => ({
        value: key,
        text: Filters[key].text
      })),
    []
  );
  const handleLeaveClass = useCallback(
    async ({ sectionId, classId, userId }) => {
      await leaveUserClass({
        sectionId,
        classId,
        userId
      });
      fetchClasses(true);
    },
    [fetchClasses]
  );
  useEffect(() => {
    const init = async () => {
      fetchClasses(true);
    };

    init();
  }, [fetchClasses]);
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        const {
          userClasses: { classList, canAddClasses, emptyState, pastClasses }
        } = user;

        if (emptyState && emptyState.visibility) {
          const { visibility, logo, body } = emptyState;
          setEmptyLogo(logo);
          setEmptyBody(body);
          setEmptyVisibility(visibility);
        }

        const classListArr = currentFilter === 'current' ? classList : pastClasses;

        if (classListArr) {
          setClassList(
            classListArr.map((cl) => {
              const classesInter = cl.section.map((s) => ({
                sectionDisplayName: s.sectionDisplayName,
                instructorDisplayName: s.instructorDisplayName,
                sectionId: s.sectionId,
                classId: cl.classId,
                courseDisplayName: cl.courseDisplayName,
                bgColor: cl.bgColor,
                isCurrent: cl.isCurrent,
                handleLeaveClass: () =>
                  handleLeaveClass({
                    sectionId: s.sectionId,
                    classId: cl.classId,
                    userId: String(user.data.userId)
                  }),
                canLeave: cl.permissions.canLeave
              }));

              if (classesInter.length > 0) {
                return classesInter[0];
              }

              return null;
            })
          );
          setCanAddClasses(canAddClasses);
        } // eslint-disable-next-line no-empty
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [handleLeaveClass, user, currentFilter]);
  const navigate = useCallback(
    ({ courseDisplayName, sectionId, classId, isCurrent }) => {
      document.title = courseDisplayName;
      pushTo(`/feed?class=${cypher(`${classId}:${sectionId}`)}&pastFilter=${!isCurrent}`);
    },
    [pushTo]
  );

  const getFilteredList = () => {
    if (!classList) {
      return [];
    }

    if (currentFilter === 'current') {
      return classList.filter((cl) => cl.isCurrent);
    }

    if (currentFilter === 'past') {
      return classList.filter((cl) => !cl.isCurrent);
    }

    return [];
  };

  const handleSelectFilter = useCallback((item) => {
    setCurrentFilter(item);
  }, []);
  return (
    <div className={classes.wrapper}>
      <Grid item>
        <Typography variant="h5">My Classes</Typography>
      </Grid>
      <Grid item className={classes.pastNote}>
        {currentFilter === 'current' ? (
          <Typography variant="body1">
            Hey!&nbsp;
            <span role="img" aria-label="Clap">
              👋
            </span>
            These are the current classes you are enrolled in on CircleIn. Click on the classes
            below to see the Class Feed where you can connect with your classmates, ask questions
            and share study materials!
          </Typography>
        ) : (
          <Typography variant="body1">
            You can access the materials from past classes, but keep in mind this is read-only, you
            cannot post new comments, or share posts on this feed.
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Box mt={4}>
          <FiltersBar
            data={arrFilters}
            activeValue={currentFilter}
            onSelectItem={handleSelectFilter}
          />
        </Box>
      </Grid>

      <Grid
        justifyContent={classList?.length ? 'flex-start' : 'center'}
        className={classes.container}
        container
        spacing={2}
      >
        <AddRemoveClasses open={openAddClasses} onClose={() => setOpenAddClasses(false)} />
        {classList.map(
          (cl) =>
            cl && (
              <Grid key={cl.sectionId} item xs={12} md={6} lg={4} xl={3} className={classes.item}>
                <ClassCard
                  sectionDisplayName={cl.sectionDisplayName}
                  instructorDisplayName={cl.instructorDisplayName}
                  courseDisplayName={cl.courseDisplayName}
                  bgColor={cl.bgColor}
                  canLeave={cl.canLeave}
                  handleLeaveClass={cl.handleLeaveClass}
                  isCurrent={cl.isCurrent}
                  navigate={() => navigate({ ...cl })}
                />
              </Grid>
            )
        )}
        {!classList?.length && (
          <EmptyState imageUrl={EmptyClass}>
            <div className={classes.emptyTitle}>
              {currentFilter === 'current' ? 'No classes yet.' : 'No past classes yet.'}
            </div>
            <div className={classes.emptyBody}>
              {currentFilter === 'current'
                ? 'You haven’t been added to any classes yet. If you’re currently enrolled in classes, please contact us at support@circleinapp.com.'
                : 'When you complete a class, they will show up here!'}
            </div>
          </EmptyState>
        )}
        {loading && (
          <div className={classes.progress}>
            <CircularProgress size={40} />
          </div>
        )}
        {canAddClasses && (
          <Grid item xs={12} className={classes.item}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setOpenAddClasses(true)}
              color="primary"
            >
              + Add More Classes
            </Button>
          </Grid>
        )}
        {emptyVisibility && (
          <Grid container justifyContent="center" item xs={12}>
            <Grid item xs={12} md={9}>
              <Empty logo={emptyLogo} body={emptyBody} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  campaign,
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      fetchClasses: userActions.fetchClasses,
      pushTo: push
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles as any)(withWidth()(Classes))));
