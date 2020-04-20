// @flow

import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

type Deck = {
  question: string,
  answer: string,
  id: string
};

type Props = {
  deck: Array<Deck>
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing()
  },
  rootItem: {
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    padding: theme.spacing(),
    margin: theme.spacing(1, 0, 1, 0)
  },
  question: {
    wordBreak: 'break-word',
    fontWeight: 'bold',
  },
  answer: {
    fontWeight: 'bold',
    wordBreak: 'break-word',
    borderLeft: '1px solid rgba(255,255,255,0.25)'
  }
}))

const FlashcardList = ({ deck }: Props) => {
  const classes = useStyles()

  return (
    <Grid
      container
      classes={{
        root: classes.root
      }}>
      {deck.map(d => (
        <Grid
          key={d.id}
          container
          spacing={2}
          classes={{
            root: classes.rootItem
          }}
        >
          <Grid item xs={4} className={classes.question}>
            {d.question}
          </Grid>
          <Grid item xs={8} className={classes.answer}>
            {d.answer}
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export default FlashcardList
