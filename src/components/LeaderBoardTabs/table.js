import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Student from './student'

import { styles } from '../_styles/LeaderBoardTabs/table';

const StyledTableRow = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.circleIn.palette.primaryText1,
  },
}))(TableRow);


const StudentTable = ({ 
  classes, 
  students, 
  scoreLabel,
  pushTo,
  userId,
}) => {
  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <StyledTableRow>
            <TableCell className={classes.tdHeader} padding='none' align="center"></TableCell>
            <TableCell className={classes.tdHeader} align="left">Student</TableCell>
            <TableCell className={classes.tdHeader} align="center">{scoreLabel}</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody className={classes.body}>
          {students.map(s => (
            <TableRow
              hover 
              key={s.userId}
              onClick={() => pushTo(`/profile/${s.userId}`)}
              className={cx(classes.tr, userId === s.userId ? classes.trHighlight : '')}
            >
              <TableCell padding='none' className={classes.tdnp} align="center">{s.position}</TableCell>
              <TableCell className={classes.td} align="left"><Student student={s} you={userId === s.userId} /></TableCell>
              <TableCell className={classes.td} align="center">{s.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withStyles(styles)(StudentTable);
