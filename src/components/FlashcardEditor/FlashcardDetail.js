// @flow

import React, { useState, useCallback, useMemo } from 'react'
import Grid from '@material-ui/core/Grid'
import Markdown from 'components/Markdown';
import SelectedImage from 'components/SelectedImage'
import clsx from 'clsx'
import CreateIcon from '@material-ui/icons/Create'
import ClearIcon from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

type Deck = {
  question: string,
  answer: string,
  id: string
};

type Props = {
  id: string,
  question: string,
  answer: string,
  questionImage: string,
  answerImage: string,
  handleDelete: Function,
  handleOpen: Function
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing()
  },
  rootItem: {
    position: 'relative',
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    padding: theme.spacing(1/2),
    margin: theme.spacing(1, 0, 1, 0)
  },
  question: {
    position: 'relative',
    wordBreak: 'break-word',
    fontWeight: 'bold',
  },
  answer: {
    position: 'relative',
    fontWeight: 'bold',
    wordBreak: 'break-word',
    borderLeft: '1px solid rgba(255,255,255,0.25)'
  },
  hasImage: {
    marginLeft: 60,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    minWidth: 0,
  },
  hidden: {
    display: 'none'
  },
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
}))

const FlashcardList = ({
  id,
  question,
  answer,
  questionImage,
  answerImage,
  handleDelete,
  handleOpen
}: Props) => {
  const classes = useStyles()
  const imageStyle = useMemo(() => ({
    borderRadius: 8,
    maxHeight: 50,
    maxWidth: 50
  }), [])
  const [hover, setHover] = useState(false)
  const onHoverEnter = useCallback(() => setHover(true), [])
  const onHoverLeave= useCallback(() => setHover(false), [])

  return (
    <Grid
      key={id}
      container
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      spacing={2}
      classes={{
        root: classes.rootItem
      }}
    >
      <div
        className={clsx(classes.buttonGroup, !hover && classes.hidden)}
      >
        <Button
          className={classes.button}
          onClick={handleOpen}
        >
          <CreateIcon fontSize="small" />
        </Button>
        <Button
          className={classes.button}
          onClick={handleDelete}
        >
          <ClearIcon fontSize="small" />
        </Button>
      </div>
      <Grid item xs={4} className={classes.question}>
        {questionImage && <SelectedImage
          image={questionImage}
          imageStyle={imageStyle}
        />}
        <Markdown className={clsx(questionImage && classes.hasImage)}>{question}</Markdown>
      </Grid>
      <Grid item xs={8} className={classes.answer}>
        {answerImage && <SelectedImage
          image={answerImage}
          imageStyle={imageStyle}
        />}
        <Markdown className={clsx(answerImage && classes.hasImage)}>{answer}</Markdown>
      </Grid>
    </Grid>
  )
}

export default FlashcardList
