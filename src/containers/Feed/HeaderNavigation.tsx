import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';

import cx from 'clsx';
import head from 'lodash/head';
import queryString from 'query-string';
import { useSelector } from 'react-redux';

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { FEED_NAVIGATION_TABS, POST_WRITER } from 'constants/common';
import { cypherClass, decypherClass } from 'utils/crypto';
import { getPastClassIds } from 'utils/helpers';

import ClassMultiSelect from '../ClassMultiSelect/ClassMultiSelect';
import Tooltip from '../Tooltip/Tooltip';

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
  activeTab: any;
  classList?: Array<any>;
  expertMode?: boolean;
  firstName?: string;
  openClassmatesDialog?: any;
  pathname?: string;
  push?: (...args: Array<any>) => any;
  schoolId?: any;
  search?: string;
  selectedClasses?: Array<any>;
  selectedSectionIds: Array<any>;
  setActiveTab: (...args: Array<any>) => any;
  setSelectedClasses?: (...args: Array<any>) => any;
  setSelectedSectionIds: (...args: Array<any>) => any;
  state?: Record<string, any>;
  updateFeed?: (...args: Array<any>) => any;
};

const HeaderNavigation = ({
  selectedSectionIds,
  setSelectedSectionIds,
  openClassmatesDialog,
  classList,
  schoolId,
  push,
  pathname,
  firstName,
  expertMode,
  activeTab,
  setActiveTab
}: Props) => {
  const isPastFilter = useSelector((state: any) => state.feed.data.filters.pastFilter);
  const options = useMemo(() => {
    const newClassList = {};
    let currentClassList = [];

    if (isPastFilter) {
      currentClassList = classList.filter((cl) => !cl.isCurrent);
    } else {
      currentClassList = classList.filter((cl) => cl.isCurrent);
    }

    currentClassList.forEach((cl) => {
      if (cl.section && cl.section.length > 0 && cl.className && cl.bgColor) {
        cl.section.forEach((s) => {
          newClassList[s.sectionId] = cl;
        });
      }
    });
    return Object.keys(newClassList).map((sectionId) => ({
      ...newClassList[sectionId],
      sectionId: Number(sectionId)
    }));
  }, [classList, isPastFilter]);
  const selectedClasses = useMemo(
    () => options.filter((option) => selectedSectionIds.includes(option.sectionId)),
    [options, selectedSectionIds]
  );
  const allSelected = useMemo(
    () => options.length === selectedSectionIds.length,
    [options.length, selectedSectionIds.length]
  );
  const allLabel = useMemo(
    () => (isPastFilter ? `${firstName}'s Past Classes` : `${firstName}'s Classes`),
    [firstName, isPastFilter]
  );
  const handleSelectClasses = useCallback(
    (classesData) => {
      setSelectedSectionIds(classesData.map((item) => item.sectionId));
    },
    [setSelectedSectionIds]
  );
  const handleVisitClassLeaderboard = () => {
    push(`/leaderboard?class=${cypherClass(head(selectedClasses))}`);
  };
  const classes = useStyles();
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <ClassMultiSelect
          noEmpty
          variant="standard"
          allLabel={allLabel}
          textFieldStyle={cx(classes.classTextField, allSelected && classes.allClasses)}
          placeholder={!options.length ? 'Select Classes...' : ''}
          externalOptions={options}
          selected={selectedClasses}
          schoolId={schoolId}
          onSelect={handleSelectClasses}
          classes={{
            container: classes.classSelector
          }}
        />
        {isPastFilter && !allSelected && (
          <Typography variant="h5" display="inline" className={classes.pastClassLabel}>
            (Past Class)
          </Typography>
        )}
      </Box>
      <Box className={classes.links}>
        <Button
          onClick={() => setActiveTab(FEED_NAVIGATION_TABS.CLASS_FEED)}
          className={cx(activeTab === FEED_NAVIGATION_TABS.CLASS_FEED && classes.currentPath)}
        >
          Class Feed
        </Button>
        <span> | </span>
        <Button
          onClick={() => setActiveTab(FEED_NAVIGATION_TABS.MY_POSTS)}
          className={cx(activeTab === FEED_NAVIGATION_TABS.MY_POSTS && classes.currentPath)}
        >
          My Posts
        </Button>
        <span> | </span>
        <Button
          onClick={() => setActiveTab(FEED_NAVIGATION_TABS.BOOKMARKS)}
          className={cx(activeTab === FEED_NAVIGATION_TABS.BOOKMARKS && classes.currentPath)}
        >
          Bookmarks
        </Button>
        <>
          <span> | </span>
          <Button onClick={() => openClassmatesDialog(expertMode ? 'student' : 'classmate')}>
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
            <Button onClick={handleVisitClassLeaderboard}>Class Leaderboard</Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default memo(HeaderNavigation);
