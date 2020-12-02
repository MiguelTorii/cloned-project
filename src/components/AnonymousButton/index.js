import React, { memo, useMemo } from 'react'
import anon from 'assets/svg/anon.svg'
import anoff from 'assets/svg/anoff.svg'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    cursor: 'pointer',
    marginLeft: theme.spacing(),
    padding: 0
  }
}))

const AnonymousButton = ({
  active = false,
  toggleActive
}) => {
  const classes = useStyles()

  const button = useMemo(() => (
    active ? <img alt='anonymous button' src={anon} />
      : <img alt='anonymous button' src={anoff} />
  ), [active])

  return (
    <Grid
      className={classes.button}
      onClick={toggleActive}
    >
      {button}
    </Grid>
  )
}


export default memo(AnonymousButton)
