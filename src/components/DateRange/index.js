// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  buttonWrapper: {
    position: 'relative',
    marginTop: theme.spacing.unit
  },
  deleteIcon: {
    position: 'absolute',
    top: -10,
    right: -10
  },
  picker: {
    display: 'none'
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: theme.circleIn.palette.primaryText1
  },
  hover: {
    '&:hover': {
      backgroundColor: theme.circleIn.palette.action
    }
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled
  },
  highlightNonCurrentMonthDay: {
    color: '#676767'
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  alone: {
    backgroundColor: theme.circleIn.palette.action
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  }
});

type Props = {
  classes: Object,
  from: ?Object,
  to: ?Object,
  onChange: Function
};

type State = {
  from: ?Object,
  to: ?Object
};

class DateRange extends React.PureComponent<Props, State> {
  state = {
    from: null,
    to: null
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.fromPickerRef = React.createRef();
  }

  handleClick = e => {
    if (this.fromPickerRef && this.fromPickerRef.current) {
      this.fromPickerRef.current.open(e);
    }
  };

  handleReset = () => {
    const { onChange } = this.props;
    onChange('fromDate', null);
    onChange('toDate', null);
  };

  handleOpen = () => {
    const { from, to } = this.props;
    this.setState({ from, to });
  };

  handleDateChange = () => {
    const { onChange } = this.props;
    const { from, to } = this.state;
    onChange('fromDate', from);
    onChange('toDate', to);
  };

  handleChange = date => () => {
    const { from } = this.state;
    if (!from) {
      this.setState({ from: date });
    } else if (date.isBefore(from, 'day')) {
      this.setState({ from: date });
    } else if (date.isAfter(from, 'day')) {
      this.setState({ to: date });
    }
  };

  handleRenderDay = (date, selectedDate, dayInCurrentMonth, event) => {
    const { classes } = this.props;
    const { from, to } = this.state;
    const { props } = event;
    const { disabled } = props;

    const dayIsBetween = to && from && moment(date).isBetween(from, to, 'day');
    const isFirstDay = to && from && moment(date).isSame(from, 'day');
    const isLastDay = to && moment(date).isSame(to, 'day');
    const isAlone = !to && from && moment(date).isSame(from, 'day');

    const wrapperClassName = cx({
      [classes.highlight]: dayIsBetween || isFirstDay || isLastDay,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth
    });

    const dayClassName = cx(classes.day, {
      [classes.hover]: true,
      [classes.alone]: isAlone
    });

    return (
      <div className={wrapperClassName}>
        <IconButton
          className={dayClassName}
          disabled={disabled || !dayInCurrentMonth}
          onClick={this.handleChange(date)}
        >
          {moment(date).format('DD')}
        </IconButton>
      </div>
    );
  };

  fromPickerRef: Object;

  renderButtonText = () => {
    const { from, to } = this.props;
    if (from && to) {
      return `${from.format('DD/MM/YYYY')} - ${to.format('DD/MM/YYYY')}`;
    }
    if (from) {
      return `${from.format('DD/MM/YYYY')} -`;
    }
    if (to) {
      return `- ${to.format('DD/MM/YYYY')}`;
    }
    return 'Date';
  };

  render() {
    const { classes, from, to } = this.props;
    return (
      <Fragment>
        <div className={classes.buttonWrapper}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.root}
            onClick={this.handleClick}
          >
            {this.renderButtonText()}
          </Button>
          {(from || to) && (
            <ButtonBase
              aria-label="Delete"
              className={classes.deleteIcon}
              onClick={this.handleReset}
            >
              <DeleteIcon fontSize="small" />
            </ButtonBase>
          )}
        </div>
        <DatePicker
          showTodayButton
          disableFuture
          value={null}
          onChange={this.handleDateChange}
          onOpen={this.handleOpen}
          variant="outlined"
          label=""
          className={classes.picker}
          ref={this.fromPickerRef}
          renderDay={this.handleRenderDay}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(DateRange);
