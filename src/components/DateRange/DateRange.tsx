import React, { Fragment } from "react";
import cx from "classnames";
import moment from "moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import TransparentButton from "components/Basic/Buttons/TransparentButton";
import styles from "../_styles/DateRange";
type Props = {
  classes: Record<string, any>;
  from: Record<string, any> | null | undefined;
  to: Record<string, any> | null | undefined;
  onChange: (...args: Array<any>) => any;
};
type State = {
  from: Record<string, any> | null | undefined;
  to: Record<string, any> | null | undefined;
  open: boolean;
};

class DateRange extends React.PureComponent<Props, State> {
  state = {
    from: null,
    to: null,
    open: false
  };
  handleClick = () => {
    this.setState({
      open: true
    });
  };
  handleReset = () => {
    const {
      onChange
    } = this.props;
    this.setState({
      from: null,
      to: null
    });
    onChange(null, null);
  };
  handleOpen = () => {
    const {
      from,
      to
    } = this.props;
    this.setState({
      from,
      to
    });
  };
  handleDateChange = () => {
    const {
      onChange
    } = this.props;
    const {
      from,
      to
    } = this.state;
    onChange(from, to);
    this.setState({
      open: false
    });
  };
  handleChange = d => () => {
    const {
      from
    } = this.state;
    const date = moment(d).utc();

    if (!from) {
      this.setState({
        from: date
      });
    } else if (date.isBefore(from, 'day')) {
      this.setState({
        from: date
      });
    } else if (date.isAfter(from, 'day')) {
      if (date.isSame(moment(), 'day')) {
        this.setState({
          to: moment().utc()
        });
      } else {
        this.setState({
          to: date
        });
      }
    }
  };
  handleRenderDay = (date, selectedDate, dayInCurrentMonth, event) => {
    const {
      classes
    } = this.props;
    const {
      from,
      to
    } = this.state;
    const {
      props
    } = event;
    const {
      disabled
    } = props;
    const dayIsBetween = to && from && moment(date).isBetween(from, to, 'day');
    const isFirstDay = to && from && moment(date).isSame(from, 'day');
    const isLastDay = to && moment(date).isSame(to, 'day');
    const isAlone = !to && from && moment(date).isSame(from, 'day');
    const wrapperClassName = cx({
      [classes.highlight]: dayIsBetween || isFirstDay || isLastDay,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.currentMonthDay]: dayInCurrentMonth
    });
    const dayClassName = cx(classes.day, {
      [classes.hover]: true,
      [classes.alone]: isAlone
    });
    return <div className={wrapperClassName}>
        <IconButton className={dayClassName} disabled={disabled || !dayInCurrentMonth} onClick={this.handleChange(date)}>
          {moment(date).format('DD')}
        </IconButton>
      </div>;
  };
  renderButtonText = () => {
    const {
      from,
      to
    } = this.props;

    if (from && to) {
      return `${from.format('MM/DD/YYYY')} - ${to.format('MM/DD/YYYY')}`;
    }

    if (from) {
      return `${from.format('MM/DD/YYYY')} -`;
    }

    if (to) {
      return `- ${to.format('MM/DD/YYYY')}`;
    }

    return 'Date';
  };

  render() {
    const {
      classes,
      from,
      to
    } = this.props;
    const {
      open
    } = this.state;
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Fragment>
          <div className={classes.buttonWrapper}>
            <TransparentButton variant="outlined" className={classes.root} onClick={from || to ? this.handleReset : this.handleClick} compact>
              {this.renderButtonText()}
              {(from || to) && <DeleteOutlineIcon className={classes.deleteIcon} fontSize="small" />}
            </TransparentButton>
          </div>
          <DatePicker disableFuture clearable onClear={this.handleReset} value={null} onChange={this.handleDateChange} onClose={() => this.setState({
          open: false
        })} onOpen={this.handleOpen} inputVariant="outlined" label="" className={classes.picker} open={open} variant="dialog" renderDay={this.handleRenderDay} />
        </Fragment>
      </MuiPickersUtilsProvider>;
  }

}

export default withStyles(styles)(DateRange);