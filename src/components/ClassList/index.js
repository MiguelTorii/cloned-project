import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import type { UserState } from '../../reducers/user'
import type { State as StoreState } from '../../types/state';

const styles = theme => ({
  addRm: {
    color: theme.circleIn.palette.action,
    width: '90%',
    wordBreak: 'break-word',
    cursor: 'pointer',
    whiteSpace: 'initial',
  },
  container: {
    marginLeft: 60,
  },
  list: {
    overflowY: 'scroll',
    maxHeight: 100,
  },
  item: {
    width: '80%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
});

type Props = {
  classes: Object,
  onClick: Function,
  user: UserState,
};

const ClassList = (props: Props) => {
  const {
    classes,
    onClick,
    user: {
      userClasses: {
        classList,
        canAddClasses
      }
    }
  } = props

  const renderButtonText = () => {
    if (classList.length === 0) return 'Click here to get started and to add your classes' 
    return 'Add/Remove Classes'
  }

  return (
    <div className={classes.container}>
      <div className={classes.list}>{classList && classList.map(c => (
        <div key={c.className} title={c.className} className={classes.item}>{c.className}</div>
      ))}
      </div>
      {canAddClasses && <div 
        tabIndex={0}
        onKeyPress={() => {}}
        role='button'
        onClick={onClick}
        className={classes.addRm}
      >
        {renderButtonText()}
      </div>}
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(ClassList));
