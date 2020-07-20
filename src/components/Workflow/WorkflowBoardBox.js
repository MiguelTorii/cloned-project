import React, { memo, useContext, useMemo, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import WorkflowBoardCard from 'components/Workflow/WorkflowBoardCard'
import TextField from '@material-ui/core/TextField'
import WorkflowContext from 'containers/Workflow/WorkflowContext'

const useStyles = makeStyles(theme => ({
  '@global': {
    'body': {
      overflowY: 'hidden'
    },
  },
  container: {
    height: 'calc(100vh - 160px)',
    borderRadius: theme.spacing(1, 1, 0, 0),
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 0),
    width: theme.spacing(34),
  },
  headerItem: {
    width: 250
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  button: {
    '-webkit-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    'box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    textAlign: 'center',
    backgroundColor: theme.circleIn.palette.deepSeaOcean,
    fontSize: 16,
    width: theme.spacing(31),
    borderRadius: theme.spacing(),
    '& span': {
      textTransform: 'none',
    },
    margin: theme.spacing(1, 0),
    padding: 0,
    '& hover': {
      backgroundColor: theme.circleIn.palette.brand,
    }
  },
  newContainer: {
    marginBottom: theme.spacing(),
  },
  listContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'start',
    height: 'calc(100vh - 265px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0,0,0,0)'
    }
  },
  inputContainer: {
    position: 'relative'
  },
  placeholder: {
    position: 'absolute',
    color: theme.circleIn.palette.primaryText2,
    top: 4,
    left: 4,
  },
  textField: {
    '& .MuiInputBase-root': {
      color: theme.circleIn.palette.normalButtonText1,
    }
  }
}))

const WorkflowBoardBox = ({ buttonColor, bgcolor, categoryId, drop, name, list }) => {
  const { handleAddTask } = useContext(WorkflowContext)
  const classes = useStyles()
  const [showNew, setShowNew] = useState(false)
  const [newInputValue, setNewInputValue] = useState('')

  const openNew = useCallback(() => setShowNew(true), [])
  const closeNew = useCallback(() => {
    setShowNew(false)
    setNewInputValue('')
  }, [])

  const handleChange = useCallback(e => setNewInputValue(e.target.value), [])

  const handleNew = useCallback(async () => {
    if (newInputValue) {
      await handleAddTask({ title: newInputValue, categoryId })
    }
    closeNew()
  }, [closeNew, newInputValue, categoryId, handleAddTask])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') handleNew()
  }, [handleNew])

  const newInput = useMemo(() => (
    <div className={classes.inputContainer}>
      {!newInputValue && <Typography className={classes.placeholder}>Enter a title for this task</Typography>}
      <TextField
        fullWidth
        className={classes.textField}
        autoFocus
        multiline
        rowsMax={3}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  ), [handleKeyDown, handleChange, classes, newInputValue])

  return useMemo(() => (
    <Grid ref={drop} className={classes.container} style={{ backgroundColor: bgcolor }}>
      <Grid container justify='space-between' alignItems='center' direction='column'>
        <Grid item className={classes.headerItem}>
          <Typography className={classes.title}>{name}</Typography>
        </Grid>
        <Grid item className={classes.headerItem}>
          <Button style={{ backgroundColor: buttonColor }} className={classes.button} onClick={openNew}>
            + Add a task
          </Button>
        </Grid>
      </Grid>
      <Grid container className={classes.listContainer}>
        <div className={classes.newContainer}>
          {showNew &&
          <WorkflowBoardCard
            newInput={newInput}
            handleNew={handleNew}
            closeNew={closeNew}
          />
          }
        </div>
        {list}
      </Grid>
    </Grid>
  ), [bgcolor, buttonColor, classes.button, classes.container, classes.headerItem, classes.listContainer, classes.newContainer, classes.title, closeNew, drop, handleNew, list, name, newInput, openNew, showNew])
}

export default memo(WorkflowBoardBox)
