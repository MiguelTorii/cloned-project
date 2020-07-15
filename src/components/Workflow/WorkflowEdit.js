// @flow

import React, { useRef, useContext, useState, useEffect, useCallback} from 'react'
import Dialog from 'components/Dialog';
import TextField from '@material-ui/core/TextField'
import DateInput from 'components/Workflow/DateInput'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import AddRemoveClasses from 'components/AddRemoveClasses'
import {workflowCategories} from 'constants/common'
import RichTextEditor from 'containers/RichTextEditor';
import WorkflowImageUpload from 'components/Workflow/WorkflowImageUpload'
import WorkflowContext from 'containers/Workflow/WorkflowContext'

const useStyles = makeStyles(theme => ({
  newClass: {
    color: theme.circleIn.palette.action
  },
  dialog: {
    borderRadius: 20,
    width: 600,
    '& .MuiDialogContent-root': {
      overflowY: 'auto',
    }
  },
  dialogImg: {
    height: 'inherit',
  },
  title: {
    fontSize: 20
  },
  selectForm: {
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 10,
    }
  },
  emptyOption: {
    height: theme.spacing(4)
  },
  richText: {
    paddingBottom: '24px !important',
    '& .ql-image': {
      display: 'none !important'
    },
    '& div div': {
      padding: 0,
    },
    '& .ql-container': {
      padding: theme.spacing()
    }
  },
}))

type Props = {
  task: Object,
  onClose: Function,
  open: boolean
};

const WorkflowEdit = ({
  task,
  onClose,
  openConfirmArchive,
  open,
}: Props) => {
  const {
    classList,
    updateItem,
  } = useContext(WorkflowContext)
  const classes = useStyles()
  const [date, setDate] = useState('')
  const [description, setDescription] = useState(task.description)
  const [categoryId, setCategoryId] = useState(task.categoryId)
  const [title, setTitle] = useState(task.title)
  const [sectionId, setSectionId] = useState(task.sectionId)
  const [openAddClasses, setOpenAddClasses] = useState(false)
  const [images, setImages] = useState([])
  const imagesRef = useRef(null)

  const handleOpenManageClass = useCallback(() => setOpenAddClasses(true), [])
  const handleCloseManageClasses = useCallback(() => setOpenAddClasses(false), [])

  useEffect(() => {
    setCategoryId(task.categoryId)
    setTitle(task.title)
    setDescription(task.description)
    setSectionId(task.sectionId)
    if(task.images) setImages(task.images)

    if (task.date) {
      if (typeof task.date.getMonth === 'function') {
        setDate(task.date)
      } else {
        setDate(new Date(`${task.date.replace(' ', 'T')}Z`))
      }
    }
  }, [task])


  const updateTask = useCallback(async () => {
    // const images =  await imagesRef.current?.handleUploadImages()
    // use id as file name
    updateItem({
      index: task.index,
      title,
      date,
      categoryId,
      description,
      sectionId,
      id: task.id,
      status: task.status,
      images: imagesRef.current?.images
    })
    onClose()
  }, [updateItem, onClose, task, title, date, categoryId, description, sectionId, imagesRef])

  const updateTitle = useCallback(e => {
    setTitle(e.target.value)
  }, [])

  const updateDescription = useCallback(e => {
    setDescription(e)
  }, [])

  const updateDate = useCallback(value => {
    setDate(value)
  }, [])

  const updateType = useCallback(e => {
    setCategoryId(e.target.value)
  }, [])

  const updateClass = useCallback(e => {
    if (e.target.value === 'new') handleOpenManageClass()
    else setSectionId(e.target.value)
  }, [handleOpenManageClass])

  return (
    <Dialog
      className={classes.dialog}
      onCancel={onClose}
      open={open}
      onOk={updateTask}
      secondaryRemoveTitle='Delete'
      onSecondaryRemove={openConfirmArchive}
      // rightButton={<div>Test</div>}
      showActions
      okTitle='Save'
    >
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <TextField
            placeholder='Enter a task'
            inputProps={{
              className: classes.title,
            }}
            fullWidth
            multiline
            onChange={updateTitle}
            value={title}
            size='small'
          />
        </Grid>
        <Grid item xs={12} className={classes.richText}>
          <RichTextEditor
            placeholder='Additional Details'
            value={description}
            onChange={updateDescription}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <DateInput
            fixed
            selected={date}
            onChange={updateDate}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl className={classes.selectForm}>
            <InputLabel>Task Status</InputLabel>
            <Select
              className={classes.select}
              value={categoryId}
              fullWidth
              onChange={updateType}
            >
              {workflowCategories.map(w => (
                <MenuItem key={`cat-${w.name}`} value={w.categoryId}>{w.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl className={classes.selectForm}>
            <InputLabel>What class is this for?</InputLabel>
            <Select
              className={classes.select}
              value={sectionId}
              fullWidth
              onChange={updateClass}
            >
              <MenuItem value='' className={classes.emptyOption} />
              {Object.keys(classList).map(k => {
                const cl = classList[k]
                return (
                  <MenuItem
                    key={k}
                    value={k}>
                    {cl.courseDisplayName}
                  </MenuItem>
                )
              })}
              <MenuItem value="new" className={classes.newClass}>
                Add Classes
              </MenuItem>
            </Select>
          </FormControl>
          <AddRemoveClasses
            open={openAddClasses}
            onClose={handleCloseManageClasses}
          />
        </Grid>
        {/* <Grid xs={12} item> */}
        {/* <WorkflowImageUpload ref={imagesRef} imagesProps={images} /> */}
        {/* </Grid> */}
      </Grid>
    </Dialog>
  )
}

export default WorkflowEdit
