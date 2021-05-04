import React from 'react'
import Dialog from 'components/Dialog'
import Typography from '@material-ui/core/Typography'
import DarkStar from 'assets/svg/dark-star.svg'
import DarkMoon from 'assets/svg/dark-moon.svg'
import LoadImg from 'components/LoadImg'
import { useStyles } from '../_styles/DarkModeDialog'

const DarkModeDialog = ({
  open,
  finish,
}) => {
  const classes = useStyles()

  return (
    <Dialog
      className={classes.dialog}
      onCancel={finish}
      open={open}
    >
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <Typography className={classes.title}>
      Introducing Dark Mode!
          </Typography>
          <Typography className={classes.subtitle}>
        We’ve switched over to the <b>Dark Side</b> for you. <span role='img' aria-label='wink'>😉</span>
          </Typography>

          <Typography>
      You tempted us, plus research suggests that Dark Mode:
          </Typography>

          <Typography className={classes.list}>
            <span>- is better for low-light settings</span>
            <span>- reduces the ‘blue light’ emitted from your phone</span>
            <span>- uses less energy (great for saving your battery mobile and web!)</span>
            <span>- potentially reduces eye strain and dry eyes in low-light conditions</span>
            <span>- helps people with light sensitivity or visual impairment</span>
          </Typography>
          <Typography>
            <b>Light Mode</b> is coming soon!
          </Typography>
        </div>
        <div className={classes.star}>
          <LoadImg
            url={DarkStar}
          />
        </div>
        <div className={classes.moon}>
          <LoadImg
            url={DarkMoon}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default DarkModeDialog
