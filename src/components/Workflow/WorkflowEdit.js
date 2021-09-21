// @flow

import React, {
  memo,
  useMemo,
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import Dialog from 'components/Dialog/Dialog';
import TextField from '@material-ui/core/TextField';
import DateInput from 'components/Workflow/DateInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import AddRemoveClasses from 'components/AddRemoveClasses/AddRemoveClasses';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import { workflowCategories, remiderTime } from 'constants/common';
import RichTextEditor from 'containers/RichTextEditor/RichTextEditor';
// import WorkflowImageUpload from 'components/Workflow/WorkflowImageUpload'
import WorkflowContext from 'containers/Workflow/WorkflowContext';
import Notification from 'components/Workflow/Notification';
import moment from 'moment';
import { useStyles } from '../_styles/Workflow/WorkflowEdit';

type Props = {
  task: Object,
  onClose: Function,
  open: boolean
};

const getNotificationTime = (notifications) => {
  try {
    if (notifications && notifications.length === 1) {
      const { value } = remiderTime[notifications[0].key];
      return value;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const toISO = (date) => {
  if (typeof date === 'string') {
    return `${date.replace(' ', 'T')}Z`;
  }
  return date;
};

const getNotificationOptions = (seconds, updated, due) => {
  if (seconds && updated && due) {
    const dueValue = moment(toISO(due)).valueOf();
    const updatedValue = moment(toISO(updated)).valueOf();
    const optionSeconds = Math.floor(
      (dueValue - updatedValue - seconds * 1000) / 1000
    );

    const now = moment().valueOf();
    if (now + optionSeconds * 1000 > dueValue) return null;

    const option = Object.keys(remiderTime).reduce((prev, cur) => (Math.abs(cur - optionSeconds) < Math.abs(prev - optionSeconds)
        ? cur
        : prev));
    return option;
  }
  return null;
};

const isFuture = (date) => moment(date).valueOf() - moment().valueOf() > 0;

const WorkflowEdit = ({ task, onClose, openConfirmArchive, open }: Props) => {
  const { classList, canAddClasses, updateItem } = useContext(WorkflowContext);
  const classes = useStyles();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState(task.description);
  const [categoryId, setCategoryId] = useState(task.categoryId);
  const [title, setTitle] = useState(task.title);
  const [sectionId, setSectionId] = useState(task.sectionId);
  const [openAddClasses, setOpenAddClasses] = useState(false);
  const [additionalDetailToolbar, setAdditionalDetailToolbar] = useState(null);
  const [editor, setEditor] = useState(null);

  const [
    // images,
    setImages
  ] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const imagesRef = useRef(null);

  const handleOpenManageClass = useCallback(() => setOpenAddClasses(true), []);
  const handleCloseManageClasses = useCallback(
    () => setOpenAddClasses(false),
    []
  );

  useEffect(() => {
    setCategoryId(task.categoryId);
    setTitle(task.title);
    setDescription(task.description);
    setSectionId(task.sectionId);
    if (task.images) setImages(task.images);

    if (task.date) {
      if (typeof task.date.getMonth === 'function') {
        setDate(task.date);
      } else {
        setDate(new Date(`${task.date.replace(' ', 'T')}Z`));
      }
    }
  }, [task, setImages, open]);

  useEffect(() => {
    if (editor) {
      setAdditionalDetailToolbar(editor.getEditor().theme.modules.toolbar);
    }
  }, [editor]);

  useEffect(() => {
    const notificationValue = getNotificationOptions(
      task.firstNotificationSeconds,
      task.notificationLastUpdated,
      date
    );

    if (!notifications && date) {
      if (notificationValue) {
        setNotifications([{ key: notificationValue }]);
      } else if (
        moment(date).valueOf() / 1000 - moment().valueOf() / 1000 >
        86400
      ) {
        setNotifications([{ key: '86400' }]);
      } else {
        setNotifications([{ key: '' }]);
      }
    }
  }, [date, notifications, task]);

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
      reminder: getNotificationTime(notifications),
      images: imagesRef.current?.images
    });
    if (title) onClose();
  }, [
    notifications,
    updateItem,
    task.index,
    task.id,
    task.status,
    title,
    date,
    categoryId,
    description,
    sectionId,
    onClose
  ]);

  const updateTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const updateDescription = useCallback((e) => {
    setDescription(e);
  }, []);

  const updateDate = useCallback((value) => {
    setNotifications(null);
    setDate(value);
  }, []);

  const updateType = useCallback((e) => {
    setCategoryId(e.target.value);
  }, []);

  const updateClass = useCallback(
    (e) => {
      if (e.target.value === 'new') handleOpenManageClass();
      else setSectionId(e.target.value);
    },
    [handleOpenManageClass]
  );

  const editNotification = useCallback(
    (e, index) => {
      const { key, value } = e.target;
      if (key === 'custom') {
        setNotifications((n) =>
          n.map((v, i) => (i === index ? { key: key + index, value } : v))
        );
        return;
      }

      if (!notifications.includes(value)) {
        setNotifications((n) =>
          n.map((v, i) => (i === index ? { key: value } : v))
        );
      }
    },
    [notifications, setNotifications]
  );

  const deleteNotification = useCallback(() => {
    setNotifications([{ key: '' }]);
    // setNotifications(n => n.filter((_, idx) => idx !== index))
  }, [setNotifications]);

  return (
    <Dialog
      className={classes.dialog}
      contentClassName={classes.dialogContent}
      onCancel={onClose}
      open={open}
      onOk={updateTask}
      secondaryRemoveTitle="Delete"
      onSecondaryRemove={openConfirmArchive}
      showActions
      okTitle="Save"
    >
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <TextField
            placeholder="Enter a task"
            inputProps={{
              className: classes.title
            }}
            fullWidth
            multiline
            onChange={updateTitle}
            value={title}
            size="small"
          />
        </Grid>
        <Grid item xs={12} className={classes.richText}>
          <ToolbarTooltip toolbar={additionalDetailToolbar} />
          <RichTextEditor
            setEditor={setEditor}
            placeholder="Additional Details"
            value={description}
            onChange={updateDescription}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <DateInput selected={date} onChange={updateDate} />
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
              {workflowCategories.map((w) => (
                <MenuItem key={`cat-${w.name}`} value={w.categoryId}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {isFuture(date) &&
            notifications &&
            notifications.map((n, index) => (
              <Notification
                n={n}
                key={`reminders-${n.key}`}
                dueDate={date}
                index={index}
                editNotification={editNotification}
                deleteNotification={deleteNotification}
              />
            ))}
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.selectForm}>
            <InputLabel>What class is this for?</InputLabel>
            <Select
              className={classes.select}
              value={sectionId}
              fullWidth
              onChange={updateClass}
            >
              <MenuItem value="" className={classes.emptyOption} />
              {Object.keys(classList).map((k) => {
                const cl = classList[k];
                return (
                  <MenuItem key={k} value={k}>
                    {cl.courseDisplayName}
                  </MenuItem>
                );
              })}
              {canAddClasses && (
                <MenuItem value="new" className={classes.newClass}>
                  Add Classes
                </MenuItem>
              )}
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
  );
};

export default memo(WorkflowEdit);
