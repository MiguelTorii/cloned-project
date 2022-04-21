import React, { useMemo, useCallback, useState, useEffect } from 'react';

import { push } from 'connected-react-router';
import capitalize from 'lodash/capitalize';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Link } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import { CLASS_PAGE_FILTERS } from 'constants/enums';
import { cypherClass } from 'utils/crypto';
import { openSupportWidget } from 'utils/helpers';

import * as userActions from 'actions/user';
import { leaveUserClass } from 'api/user';
import AddRemoveClasses from 'components/AddRemoveClasses/AddRemoveClasses';
import FiltersBar from 'components/FiltersBar/FiltersBar';
import withRoot from 'withRoot';

import ClassCard from './ClassCard';

import type { UserState } from 'reducers/user';
import type { AppState } from 'redux/store';
import type { User } from 'types/models';
import type { State as StoreState } from 'types/state';

const Filters = {
  current: {
    display: CLASS_PAGE_FILTERS.CURRENT,
    text: "Here are the classes that you're enrolled in currently on CircleIn."
  },
  past: {
    display: CLASS_PAGE_FILTERS.PAST,
    text: 'Classes that have concluded will appear here.'
  },
  upcoming: {
    display: CLASS_PAGE_FILTERS.UPCOMING,
    text: 'Classes that start within 2 weeks will appear here!'
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
  const [currentFilter, setCurrentFilter] = useState(CLASS_PAGE_FILTERS.CURRENT);
  const [loading, setLoading] = useState(false);

  const profile = useSelector<AppState, User>((state) => state.user.data);

  const arrFilters = useMemo(
    () =>
      Object.keys(Filters).map((key) => ({
        value: key,
        text: capitalize(Filters[key].display)
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
          userClasses: { classList, canAddClasses, pastClasses, upcomingClasses }
        } = user;

        const classSet = () => {
          switch (currentFilter) {
            case CLASS_PAGE_FILTERS.CURRENT:
              return classList;

            case CLASS_PAGE_FILTERS.PAST:
              return pastClasses;

            case CLASS_PAGE_FILTERS.UPCOMING:
              return upcomingClasses;

            default:
              break;
          }
        };

        const classListArr = classSet();

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
                startDate: cl.startDate,
                handleLeaveClass: () =>
                  handleLeaveClass({
                    sectionId: s.sectionId,
                    classId: cl.classId,
                    userId: user.data.userId
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
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [handleLeaveClass, user, currentFilter]);
  const navigate = useCallback(
    ({ courseDisplayName, sectionId, classId, isCurrent }) => {
      if (currentFilter !== CLASS_PAGE_FILTERS.UPCOMING) {
        document.title = courseDisplayName;
        pushTo(`/feed?class=${cypherClass({ classId, sectionId })}&pastFilter=${!isCurrent}`);
      }
    },
    [pushTo, currentFilter]
  );

  const handleSelectFilter = useCallback((item) => {
    setCurrentFilter(item);
  }, []);

  const handleOpenSupport = useCallback(() => {
    openSupportWidget(`${profile.firstName} ${profile.lastName}`, profile.email);
  }, [profile]);

  const emptyPageText = () => {
    switch (currentFilter) {
      case CLASS_PAGE_FILTERS.CURRENT:
        return (
          <Typography>
            If a class has already started and it isn’t here,&nbsp;
            <Link component="button" underline="none" onClick={handleOpenSupport}>
              <Typography>Contact CircleIn Support.</Typography>
            </Link>
          </Typography>
        );

      case CLASS_PAGE_FILTERS.PAST:
        return <Typography>When you complete a class, they will show up here!</Typography>;

      case CLASS_PAGE_FILTERS.UPCOMING:
        return <Typography>{Filters.upcoming.text}</Typography>;

      default:
        break;
    }
  };

  return (
    <div>
      <Grid item>
        <FiltersBar
          data={arrFilters}
          activeValue={currentFilter}
          onSelectItem={handleSelectFilter}
        />
      </Grid>
      {classList.length > 0 && (
        <Box display="flex" mt={1} mb={1}>
          <Typography>
            {Filters[currentFilter].text}
            {currentFilter === CLASS_PAGE_FILTERS.CURRENT && (
              <>
                &nbsp;
                <Link component="button" underline="none" onClick={handleOpenSupport}>
                  <Typography>Contact CircleIn Support</Typography>
                </Link>
                &nbsp;if you have any questions.
              </>
            )}
          </Typography>
        </Box>
      )}

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
                  startDate={cl.startDate}
                  bgColor={cl.bgColor}
                  canLeave={cl.canLeave}
                  handleLeaveClass={cl.handleLeaveClass}
                  isCurrent={cl.isCurrent}
                  navigate={() => navigate({ ...cl })}
                  isUpcoming={currentFilter === CLASS_PAGE_FILTERS.UPCOMING}
                />
              </Grid>
            )
        )}
        {!classList?.length && (
          <Box mt={15} display="flex" justifyContent="center">
            {emptyPageText()}
          </Box>
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
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
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
