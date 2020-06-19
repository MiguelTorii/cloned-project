// @flow
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Lottie from 'react-lottie'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import CloseIcon from '@material-ui/icons/Close';

import { logEventLocally } from 'api/analytics';
import { createTodo, updateTodo } from 'api/workflow'
import ErrorBoundary from 'containers/ErrorBoundary';
import Dialog, { dialogStyle } from 'components/Dialog';
import DateInput from 'components/Workflow/DateInput'
import LoadImg from 'components/LoadImg'

import classesImg from 'assets/img/circlein-classes.png';
import backgroundImg from 'assets/img/onboarding-background.png';
import workflowDemoGif from 'assets/gif/workflow-demo.gif';
import creditCardAnimation from 'assets/lottie/creditcard.json'
import flipCardAnimation from 'assets/lottie/flip-card.json'
import moneyStackAnimation from 'assets/lottie/money-stack.json'
import onlineMathAnimation from 'assets/lottie/online-math-courses.json'

const centered = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const subtitle = {
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 0.6,
}

const styles = theme => ({
  actionPanel: {
    flex: 2,
    flexDirection: 'column',
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(4),
    ...centered,
  },
  actionPanelComponent: {
    paddingBottom: theme.spacing(),
  },
  animationPanel: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  board: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    display: 'flex',
    margin: `0px ${theme.spacing(4)}px`,
    padding: theme.spacing(4),
    width: '100%',
    '& div': {
      borderRadius: 8,
    }
  },
  boardColumn: {
    marginRight: theme.spacing(4),
    padding: `0px ${theme.spacing(1.5)}px`,
    width: 200,
  },
  boardHeader: {
    height: 30,
    marginBottom: theme.spacing(),
    paddingTop: theme.spacing(1.5),
    ...subtitle,
    letterSpacing: 0,
    fontSize: 20,
  },
  boardTask: {
    boxShadow: '4px 6px 5px -1px rgba(102,102,102,1)',
    backgroundColor: 'white',
    color: theme.circleIn.palette.primaryBackground,
    height: 120,
    padding: theme.spacing(1.5),
    margin: `${theme.spacing(1.5)}px 0px`,
    width: '100%',
    wordBreak: 'break-all',
    ...subtitle,
  },
  button: {
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    borderRadius: 8,
    color: theme.circleIn.palette.primaryText1,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1 / 2, 2),
    width: 200,
  },
  caption: {
    color: theme.circleIn.palette.primaryBackground,
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: theme.spacing(1.5),
    textAlign: 'center',
    width: '100%',
  },
  closeIcon: {
    top: 15,
    left: 15,
    position: 'absolute',
  },
  content: {
    height: '100%',
  },
  demoGif: {
    borderRadius: 8,
    height: 660,
    width: '100%',
  },
  demoPanel: {
    borderRadius: 8,
    background: `url(${backgroundImg})`,
    flex: 3,
    ...centered,
  },
  dragImg: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 10,
    right: 10,
  },
  dialog: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    height: 700,
    width: 1000,
  },
  fontBlack: {
    color: theme.circleIn.palette.primaryBackground,
  },
  form: {
    borderRadius: 8,
    color: '#7b8992',
    position: 'absolute',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(3),
    width: '85%',
    zIndex: 6,
  },
  formContainer: {
    ...centered,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  formFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formHeader: {
    marginTop: theme.spacing(3),
  },
  formInput: {
    borderRadius: 8,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid #7b8992`,
    paddingLeft: theme.spacing(),
    height: 30,
  },
  formOverlay: {
    background: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 5,
  },
  formRow: {
    marginBottom: theme.spacing(1.25),
  },
  formTitle: {
    color: 'white',
    fontSize: 20,
    borderBottom: `1px solid #7b8992`,
  },
  step: {
    display: 'flex',
    height: 700,
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: 400,
    position: 'absolute',
    bottom: 20,
  },
  textInput: {
    display: 'block',
    fontSize: 16,
    minWidth: 200,
    '& input': {
      borderBottom: `1px solid white`,
      minWidth: 200,
      textAlign: 'center',
    },
    '& input:focus': {
      borderBottom: `1px solid ${theme.circleIn.palette.action}`,
    },
  },
  textInputRow: {
    margin: `${theme.spacing()}px 0px`,
    width: '100%',
  },
  textRow: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    margin: `${theme.spacing(2)}px 0px`,
    textAlign: 'center',
  },
  textRows: {
    margin: `${theme.spacing(2)}px 0px`,
    maxWidth: 300,
  },
  theresMore: {
    padding: theme.spacing(4),
    flexDirection: 'column',
    ...centered,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
});

type Props = {
  classes: Object,
  open: boolean,
  userId: number,
  updateOnboarding: Function
};

const Onboarding = ({ classes, open, userId, updateOnboarding }: Props) => {
  const [activeStep, setActiveStep] = useState(1);
  const [tasks, setTasks] = useState({});
  const [dueDate, setDueDate] = useState(null);
  const [focusedField, setFocusedField] = useState('task1');

  useEffect(() => {
    if (open) {
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Started',
      });
    }
  }, [open, userId]);

  const Intro = () => (
    <div style={{ margin: '0px 32px' }}>
      <LoadImg url={classesImg} style={{ width: '100%' }} />
    </div>
  );

  const updateDueDate = React.useCallback(value => {
    setDueDate(value)
  }, [])

  const SelectDate = () => (
    <DateInput
      fixed
      selected={dueDate}
      onChange={updateDueDate}
    />
  );

  const Animation = ({ animationData, title }) => (
    <div className={classes.animationPanel}>
      <div className={classes.caption}>{title}</div>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData,
        }}
      />
    </div>
  );

  const TheresMore = () => (
    <div className={classes.theresMore}>
      <div
        style={{ paddingBottom: 24 }}
        className={cx(classes.title, classes.fontBlack)}>
          There's more to CircleIn!
      </div>
      <Grid xs={12} md={12} container spacing={6}>
        <Grid xs={6} md={6} item>
          <Animation animationData={flipCardAnimation} title='Create study flashcards' />
        </Grid>
        <Grid xs={6} md={6} item>
          <Animation animationData={creditCardAnimation} title='Earn awesome rewards' />
        </Grid>
        <Grid xs={6} md={6} item>
          <Animation animationData={onlineMathAnimation} title='Chat with classmates' />
        </Grid>
        <Grid xs={6} md={6} item>
          <Animation animationData={moneyStackAnimation} title='Win scholarships' />
        </Grid>
      </Grid>
    </div>
  );

  const handleChange = (fieldName, value) => {
    setTasks({ ...tasks, [fieldName]: value });
    setFocusedField(fieldName);
  };

  const Tasks = () => (
    <div className={classes.textInputs}>
      <div className={classes.textInputRow}>
        <TextField
          autoFocus={focusedField === 'task1'}
          InputProps={{ classes: { root: classes.textInput }, disableUnderline: true }}
          onChange={e => handleChange('task1', e.target.value)}
          placeholder='Type a task here...'
          value={tasks.task1}
        />
      </div>
      <div className={classes.textInputRow}>
        <TextField
          autoFocus={focusedField === 'task2'}
          InputProps={{ classes: { root: classes.textInput }, disableUnderline: true }}
          onChange={e => handleChange('task2', e.target.value)}
          placeholder='and here...'
          value={tasks.task2}
        />
      </div>
      <div className={classes.textInputRow}>
        <TextField
          autoFocus={focusedField === 'task3'}
          InputProps={{ classes: { root: classes.textInput }, disableUnderline: true }}
          onChange={e => handleChange('task3', e.target.value)}
          placeholder='and here.'
          value={tasks.task3}
        />
      </div>
    </div>
  );

  const trunc = s => {
    if (!s) return '';
    return s.substr(0, 70);
  }

  const MockedBoard = () => (
    <div className={classes.board}>
      <div className={classes.boardColumn} style={{ backgroundColor: '#EBAF64'}}>
        <div className={classes.boardHeader}>Upcoming</div>
        <div className={classes.boardTask}>{trunc(tasks.task1)}</div>
        <div className={classes.boardTask}>{trunc(tasks.task2)}</div>
        <div className={classes.boardTask}>{trunc(tasks.task3)}</div>
      </div>
      <div className={classes.boardColumn} style={{ backgroundColor: '#4781B3' }}>
        <div className={classes.boardHeader}>In Progress</div>
      </div>
    </div>
  );

  const formColor = '#7b8992';

  const MockedForm = () => (
    <div className={classes.formContainer}>
      <MockedBoard />
      <div className={classes.formOverlay} />
      <div className={classes.form}>
        <div className={classes.formHeader}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <div className={cx(classes.formTitle, classes.formRow)} >
          {tasks.task1}
        </div>
        <div className={cx(classes.subtitle)}>Task Description</div>
        <div className={cx(classes.formInput, classes.formRow)} />
        <div
          className={cx(classes.formFlex, classes.formRow)}
        >
          <DateInput style={{ marginTop: 10 }} selected={dueDate} />
          <div style={{ marginLeft: 24, flex: 1 }}>
            <div className={classes.subtitle} style={{ marginTop: 10 }}>
              Task Status
            </div>
            <Select value={1} style={{ width: '100%' }}>
              <MenuItem value={1}>
                <span style={{ color: formColor }}>Ready to Start</span>
              </MenuItem>
            </Select>
          </div>
        </div>
        <div>
          <Select value={1} style={{width: '100%' }}>
            <MenuItem value={1}>
              <span style={{ color: formColor }}> What class is this for?</span>
            </MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );

  const WorkflowDemo = () => (
    <div>
      <img
        alt='workflow demo'
        className={classes.demoGif}
        src={workflowDemoGif}
      />
    </div>
  )

  const STEPS = [
    {
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Tell me more...',
      demoComponent: Intro,
      textRows: [
        'Your school has partnered with us to help you succeed.',
        'One of the ways we help you pass your classes is using Workflow.'
      ],
      title: 'Welcome to CircleIn!',
    },
    {
      actionComponent: Tasks,
      buttonDisabled: (!tasks.task1 || !tasks.task2 || !tasks.task3),
      buttonText: 'Done! Now what?',
      demoComponent: MockedBoard,
      textRows: [
        'It’s easy to lose track of due dates. The easiest way to stay organized is to create tasks for yourself to complete.',
        'Let’s start with three of your upcoming tasks:'
      ],
      title: 'Workflow allows you to manage all of your assignments in one place.',
    },
    {
      actionComponent: SelectDate,
      buttonDisabled: (!dueDate),
      buttonText: 'Due date added!',
      demoComponent: MockedForm,
      textRows: [
        `Let’s set the due date for ${tasks.task1}:`,
      ],
      title: 'Great! You have tasks. Now let’s add a due date to get them done',
    },
    {
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Got it!',
      demoComponent: WorkflowDemo,
      textRows: [
        'Expert Tip: Go through your syllabus and create tasks for all the important due dates!'
      ],
      title: 'Simply drag-n-drop a task from Upcoming to In Progress as you make progress with your schoolwork.',
    },
    {
      actionComponent: null,
      buttonDisabled: false,
      buttonText: 'Take me to CircleIn',
      demoComponent: TheresMore,
      textRows: [
        'You can do even more than task management on CircleIn.',
        'Make sure to explore all our tools and features to get the most academic success out of your experience.'
      ],
      title: 'Oh, and one last thing...',
    },
  ]

  const addTasks = async () => {
    const { task1, task2, task3 } = tasks;
    const categoryId = 2; // Upcoming

    const newTask = await createTodo({ title: task1, categoryId });
    await updateTodo({
      ...newTask,
      sectionId: '',
      date: moment(dueDate).valueOf(),
      status: 1,
    });

    await createTodo({ title: task2, categoryId });
    await createTodo({ title: task3, categoryId });
  }

  const handleButtonClick = async () => {
    if (activeStep === (STEPS.length - 1)) {
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Ended',
      });

      await addTasks();
      updateOnboarding({ viewedOnboarding: true });
    } else {
      setActiveStep(activeStep + 1);
    }
  }

  const OnboardingStep = ({
    buttonDisabled, buttonText, ActionComponent = null, DemoComponent, textRows, title
  }) => {
    return (
      <div className={classes.step}>
        <div className={classes.actionPanel}>
          <div className={classes.title}>
            {title}
          </div>
          <div className={classes.textRows}>
            {
              textRows.map(textRow => (
                <div key={Math.random()} className={classes.textRow}>{textRow}</div>
              ))
            }
          </div>
          <div className={classes.actionPanelComponent}>
            {ActionComponent && <ActionComponent />}
          </div>
          <div>
            <Button
              color='primary'
              disabled={buttonDisabled}
              className={classes.button}
              onClick={handleButtonClick}
              variant='contained'
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <div className={classes.demoPanel}>
          {DemoComponent && <DemoComponent />}
        </div>
      </div>
    )
  };

  const currentStep = STEPS[activeStep];

  return (
    <ErrorBoundary>
      <Dialog
        ariaDescribedBy='onboarding-description'
        className={classes.dialog}
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        showHeader={false}
      >
        <OnboardingStep
          ActionComponent={currentStep.actionComponent || null}
          buttonDisabled={currentStep.buttonDisabled}
          buttonText={currentStep.buttonText}
          DemoComponent={currentStep.demoComponent}
          textRows={currentStep.textRows}
          title={currentStep.title}
        />
      </Dialog>
    </ErrorBoundary>
  );
}

export default withStyles(styles)(Onboarding);
