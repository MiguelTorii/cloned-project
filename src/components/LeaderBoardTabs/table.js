import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Student from './student'

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    color: theme.circleIn.palette.primaryText1,
  },
  table: {
    border: 'none',
  },
  tr: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.action} !important`,
    },
  },
  tdHeader: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderBottom: 'none',
    fontSize: 16,
    color: theme.circleIn.palette.primaryText1,
  },
  td: {
    borderBottom: 'none',
    fontSize: 16,
    fontWeight: 700,
    padding: theme.spacing(),
    color: theme.circleIn.palette.primaryText1,
  },
  tdnp: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 700,
    borderBottom: 'none',
    color: theme.circleIn.palette.primaryText1,
  }
});

const StyledTableRow = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.circleIn.palette.primaryText1,
  },
}))(TableRow);


function SimpleTable({ classes, students, scoreLabel }) {
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
              className={classes.tr}
            >
              <TableCell padding='none' className={classes.tdnp} align="center">{s.position}</TableCell>
              <TableCell className={classes.td} align="left"><Student student={s} /></TableCell>
              <TableCell className={classes.td} align="center">{s.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withStyles(styles)(SimpleTable);
