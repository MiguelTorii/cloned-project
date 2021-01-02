// @flow
import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles'
import type { State as StoreState } from 'types/state';
import * as userActions from 'actions/user'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  background: {
    position: 'fixed',
    overflow: 'hidden',
    height: `100%`,
    margin: - theme.spacing(),
    width: `100%`,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre',
    textAlign: 'center',
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    backdropFilter: 'blur(5px)'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 24
  }
}))

const UserDialog = ({
  user,
  clear
}) => {
  const { dialogMessage: { title }, isLoading } = user
  const classes = useStyles()

  useEffect(() => {
    if (!isLoading) setTimeout(() => clear(), 1000)
  }, [clear, isLoading])

  if(!title) return null
  return (
    <div className={classes.background}>
      <Typography className={classes.text}>
        {title}
      </Typography>
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user,
})

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      clear: userActions.clearDialogMessage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDialog)
