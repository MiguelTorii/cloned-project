import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InfiniteScroll from 'react-infinite-scroller';
import { getMoreGrandStudents, getMoreTuesdayStudents } from '../../api/leaderboards';
import Student from './student';
import { styles } from '../_styles/LeaderBoardTabs/table';
import { buildPath } from '../../utils/helpers';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.circleIn.palette.primaryText1
  }
}))(TableRow);

const StudentTable = ({
  classes,
  students: initialStudents,
  scoreLabel,
  pushTo,
  userId,
  sectionId,
  selectedTab
}) => {
  const [hasMore, setHasMore] = useState(true);
  const [tuesdayIndex, setTuesdayIndex] = useState(0);
  const [grandIndex, setGrandIndex] = useState(0);
  const [students, setStudents] = useState(initialStudents);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents, initialStudents.length]);
  const handleLoadMore = useCallback(async () => {
    let list = [];

    if (selectedTab === 'tuesday') {
      list = await getMoreTuesdayStudents(sectionId, tuesdayIndex + 100);
      setTuesdayIndex(tuesdayIndex + 100);
    }

    if (selectedTab === 'grand') {
      list = await getMoreGrandStudents(sectionId, grandIndex + 100);
      setGrandIndex(grandIndex + 100);
    }

    setStudents((students) => [...students, ...list]);

    if (list.length % 100 > 0) {
      setHasMore(false);
    }
  }, [selectedTab, sectionId, tuesdayIndex, grandIndex]);
  useEffect(() => {
    setTuesdayIndex(0);
    setGrandIndex(0);
    setStudents(initialStudents);
  }, [selectedTab, initialStudents]);
  return (
    <div className={classes.root}>
      <InfiniteScroll
        loadMore={handleLoadMore}
        hasMore={hasMore}
        initialLoad={false}
        scrollableTarget="achievements-scroll-container"
      >
        <Table className={classes.table}>
          <TableHead>
            <StyledTableRow>
              <TableCell className={classes.tdHeader} padding="none" align="center" />
              <TableCell className={classes.tdHeader} align="left">
                Student
              </TableCell>
              <TableCell className={classes.tdHeader} align="center">
                {scoreLabel}
              </TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody className={classes.body}>
            {students.map((s) => (
              <TableRow
                hover
                key={s.userId}
                onClick={() =>
                  pushTo(
                    buildPath(`/profile/${s.userId}`, {
                      from: PROFILE_PAGE_SOURCE.LEADERBOARD
                    })
                  )
                }
                className={cx(classes.tr, userId === s.userId ? classes.trHighlight : '')}
              >
                <TableCell padding="none" className={classes.tdnp} align="center">
                  {s.position}
                </TableCell>
                <TableCell className={classes.td} align="left">
                  <Student student={s} you={userId === s.userId} />
                </TableCell>
                <TableCell className={classes.td} align="center">
                  {s.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </div>
  );
};

export default withStyles(styles as any)(StudentTable);
