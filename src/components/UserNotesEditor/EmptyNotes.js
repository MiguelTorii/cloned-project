import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import emptyNotes from 'assets/svg/emptyNotes.svg'
import LoadImg from 'components/LoadImg'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    padding: theme.spacing(2),
    fontWeight: 'bold'
  },
  subtitle: {
    color: theme.circleIn.palette.primaryText2,
    paddingBottom: theme.spacing(3),
    fontSize: 16
  },
  image: {
    [theme.breakpoints.down('xs')]: {
      objectFit: 'scale-down',
      width: '50vw'
    }
  }
}))

const Empty = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <LoadImg alt='empty-notes' url={emptyNotes} className={classes.image} />
      <div className={classes.title}>Now, you can type class notes right inside of CircleIn.</div>
      <div className={classes.subtitle}>Organization just got so much easier.</div>
    </div>
  )
}

export default Empty
