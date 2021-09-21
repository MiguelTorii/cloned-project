// @flow
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';

import ClassMultiSelect from 'containers/ClassMultiSelect/ClassMultiSelect';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { cypher, decypherClass } from 'utils/crypto';
import { getPastClassIds } from 'utils/helpers';
import Tooltip from 'containers/Tooltip/Tooltip';
import cx from 'clsx';
import queryString from 'query-string';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  allClasses: {
    '& div': {
      fontSize: 30
    }
  },
  classTextField: {
    minWidth: 400,
    [theme.breakpoints.down('sm')]: {
      minWidth: 330
    }
  },
  links: {
    padding: theme.spacing(0, 1)
  },
  classSelector: {
    maxWidth: 400,
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 330
    }
  },
  currentPath: {
    color: theme.circleIn.palette.action,
    fontWeight: 900
  },
  pastClass: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(),
    padding: theme.spacing()
  },
  pastClassLabel: {
    opacity: 0.4,
    marginLeft: theme.spacing(3)
  }
}));

type Props = {
  updateFeed: Function,
  push: Function,
  search: string,
  pathname: string,
  state: Object,
  firstName: string,
  expertMode: boolean,
  classList: Array,
  selectedClasses: Array,
  setSelectedClasses: Function
};

const HeaderNavigation = ({
  selectedClasses,
  setSelectedClasses,
  openClassmatesDialog,
  classList,
  schoolId,
  push,
  search,
  pathname,
  firstName,
  expertMode,
  updateFeed,
  state
}: Props) => {
  const [prevFilters, setPrevFilters] = useState('');

  const isPastFilter = useMemo(() => {
    const query = queryString.parse(search);
    const pastClasses = getPastClassIds(classList);

    if (query?.class) {
      const { classId } = decypherClass(query?.class);
      return pastClasses.includes(Number(classId));
    }
    if (query?.pastFilter === 'true') {
      return true;
    }
    return false;
  }, [search, classList]);

  const options = useMemo(() => {
    const newClassList = {};
    let currentClassList = [];
    if (isPastFilter) {
      currentClassList = classList.filter((cl) => !cl.isCurrent);
    } else {
      currentClassList = classList.filter((cl) => cl.isCurrent);
    }
    currentClassList.forEach((cl) => {
      if (cl.section && cl.section.length > 0 && cl.className && cl.bgColor)
        cl.section.forEach((s) => {
          newClassList[s.sectionId] = cl;
        });
    });

    return Object.keys(newClassList).map((sectionId) => ({
      ...newClassList[sectionId],
      sectionId: Number(sectionId)
    }));
  }, [classList, isPastFilter]);

  const allSelected = useMemo(
    () => options.length === selectedClasses.length,
    [options.length, selectedClasses.length]
  );

  const allLabel = useMemo(
    () =>
      (isPastFilter ? `${firstName}'s Past Classes` : `${firstName}'s Classes`),
    [firstName, isPastFilter]
  );

  const classes = useStyles();

  const handleFilters = useCallback(
    (options) => {
      setSelectedClasses(options);
      const filters = options.map((o) =>
        JSON.stringify({
          classId: o.classId,
          sectionId: o.sectionId
        })
      );
      if (prevFilters !== String(filters)) {
        setPrevFilters(String(filters));
        updateFeed(filters);
      }
    },
    [prevFilters, setSelectedClasses, updateFeed]
  );

  useEffect(() => {
    const query = queryString.parse(search);

    if (state?.selectedClasses) {
      state.selectedClasses.forEach((sc) => {
        const id = options.findIndex(
          (o) => o.classId === sc.classId && o.sectionId === sc.sectionId
        );
        if (id === -1) {
          handleFilters(options);
        } else {
          handleFilters(state.selectedClasses);
        }
      });
    } else if (query.class) {
      const { classId } = decypherClass(query.class);
      const currentClass = classList.filter(
        (userClass) => userClass.classId === Number(classId)
      );
      const newClass = {};
      currentClass.forEach((cl) => {
        if (cl.section && cl.section.length > 0 && cl.className && cl.bgColor)
          cl.section.forEach((s) => {
            newClass[s.sectionId] = cl;
          });
      });

      const currentSelectedClass = Object.keys(newClass).map((sectionId) => ({
        ...newClass[sectionId],
        sectionId: Number(sectionId)
      }));
      handleFilters(currentSelectedClass);
    } else handleFilters(options);
  }, [classList, handleFilters, options, search, setSelectedClasses, state]);

  const onSelect = useCallback(
    (options) => {
      handleFilters(options);
      const parsedHash = queryString.parse(search);
      const { class: remove, 0: remove2, ...rest } = parsedHash;
      if (options.length === 1) {
        const newSearch = queryString.stringify({
          ...rest,
          class: cypher(`${options[0].classId}:${options[0].sectionId}`)
        });
        push({
          pathname,
          search: newSearch,
          state: { selectedClasses: options }
        });
      } else {
        const newSearch = queryString.stringify(rest);
        push({
          pathname,
          search: newSearch,
          state: { selectedClasses: options }
        });
      }
    },
    [handleFilters, pathname, push, search]
  );

  const navigate = useCallback(
    (path, extras) => () => {
      const parsedHash = queryString.parse(search);
      const { class: remove, 0: remove2, from: remove3, ...rest } = parsedHash;
      if (selectedClasses.length === 1) {
        const newSearch = queryString.stringify({
          ...rest,
          ...extras,
          class: cypher(
            `${selectedClasses[0].classId}:${selectedClasses[0].sectionId}`
          )
        });
        push({
          pathname: path,
          search: newSearch,
          state: { selectedClasses }
        });
      } else {
        const newSearch = queryString.stringify({
          ...rest,
          ...extras
        });
        push({
          pathname: path,
          search: newSearch,
          state: { selectedClasses }
        });
      }
    },
    [push, search, selectedClasses]
  );

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <ClassMultiSelect
          noEmpty
          variant="standard"
          allLabel={allLabel}
          containerStyle={classes.classSelector}
          textFieldStyle={cx(
            classes.classTextField,
            allSelected && classes.allClasses
          )}
          externalOptions={options}
          placeholder="Select Classes..."
          selected={selectedClasses}
          schoolId={schoolId}
          onSelect={onSelect}
        />
        {isPastFilter && !allSelected && (
          <Typography
            variant="h5"
            display="inline"
            className={classes.pastClassLabel}
          >
            (Past Class)
          </Typography>
        )}
      </Box>
      <Box className={classes.links}>
        <Button
          onClick={navigate('/feed', {})}
          className={cx(pathname === '/feed' && classes.currentPath)}
        >
          Class Feed
        </Button>
        <span> | </span>
        <Button
          onClick={navigate('/my_posts', { from: 'me' })}
          className={cx(pathname === '/my_posts' && classes.currentPath)}
        >
          My Posts
        </Button>
        <span> | </span>
        <Button
          onClick={navigate('/bookmarks', { from: 'bookmarks' })}
          className={cx(pathname === '/bookmarks' && classes.currentPath)}
        >
          Bookmarks
        </Button>
        <>
          <span> | </span>
          <Button
            onClick={openClassmatesDialog(expertMode ? 'student' : 'classmate')}
          >
            <Tooltip
              id={9057}
              placement="right"
              okButton="End"
              totalSteps={2}
              completedSteps={2}
              text="You can see a list of your classmates in each class or all your classes at once by selecting “Classmates”. 🎉"
              delay={500}
            >
              {expertMode ? 'Students' : 'Classmates'}
            </Tooltip>
          </Button>
        </>

        {selectedClasses.length === 1 && !expertMode && (
          <>
            <span> | </span>
            <Button
              onClick={navigate('/leaderboard', {})}
              className={cx(pathname === '/leaderboard' && classes.currentPath)}
            >
              Class Leaderboard
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default memo(HeaderNavigation);
