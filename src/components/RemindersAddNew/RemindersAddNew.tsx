import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from '../_styles/RemindersAddNew';

type Props = {
  classes: Record<string, any>;
  loading: boolean;
  onSubmit: (...args: Array<any>) => any;
};

type State = {
  value: string;
  school: boolean;
  personal: boolean;
  other: boolean;
  selected: number;
  selectedDate: Record<string, any>;
};

class RemindersAddNew extends React.PureComponent<Props, State> {
  state = {
    value: '',
    school: false,
    personal: false,
    other: false,
    selected: -1,
    selectedDate: moment()
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    });
  };

  handleDateChange = (selectedDate) => {
    this.setState({
      selectedDate
    });
  };

  handleMouseEnter = (name) => () => {
    this.setState({
      [name]: true
    } as any);
  };

  handleMouseLeave = (name) => () => {
    this.setState({
      [name]: false
    } as any);
  };

  handleClick = (label) => () => {
    this.setState(({ selected }) => ({
      selected: selected === label ? -1 : label
    }));
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { value, selected, selectedDate } = this.state;

    if (value.trim() === '') {
      return;
    }

    if (!(selectedDate as any)._isValid) {
      return;
    }

    onSubmit({
      title: value,
      dueDate: selectedDate.valueOf(),
      label: selected
    });
    this.setState({
      value: '',
      selected: -1,
      selectedDate: moment()
    });
  };

  render() {
    const { classes, loading } = this.props;
    const { value, selectedDate, school, personal, other, selected } = this.state;
    return (
      <Paper className={classes.header} elevation={1}>
        <TextField
          variant="outlined"
          className={classes.input}
          type="text"
          placeholder="Add new Reminder"
          value={value}
          disabled={loading}
          onChange={this.handleChange}
        />
        <DateTimePicker
          value={selectedDate}
          onChange={this.handleDateChange}
          variant="outlined"
          label=""
          disabled={loading}
          className={classes.picker}
        />
        <Divider className={classes.divider} light />
        <Tooltip title="School">
          <div>
            <ButtonBase
              disabled={loading}
              onClick={this.handleClick(2)}
              onMouseEnter={this.handleMouseEnter('school')}
              onMouseLeave={this.handleMouseLeave('school')}
              className={cx(
                classes.label,
                classes.blue,
                !school && selected !== 2 && classes.disabled
              )}
            />
          </div>
        </Tooltip>
        <Tooltip title="Personal">
          <div>
            <ButtonBase
              disabled={loading}
              onClick={this.handleClick(1)}
              onMouseEnter={this.handleMouseEnter('personal')}
              onMouseLeave={this.handleMouseLeave('personal')}
              className={cx(
                classes.label,
                classes.green,
                !personal && selected !== 1 && classes.disabled
              )}
            />
          </div>
        </Tooltip>
        <Tooltip title="Other">
          <div>
            <ButtonBase
              disabled={loading}
              onClick={this.handleClick(3)}
              onMouseEnter={this.handleMouseEnter('other')}
              onMouseLeave={this.handleMouseLeave('other')}
              className={cx(
                classes.label,
                classes.grey,
                !other && selected !== 3 && classes.disabled
              )}
            />
          </div>
        </Tooltip>
        <Divider className={classes.divider} light />
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            disabled={value.trim() === '' || loading}
            color="primary"
            variant="contained"
            onClick={this.handleSubmit}
          >
            Add
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles as any)(RemindersAddNew);
