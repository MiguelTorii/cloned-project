// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { navigate } from './utils';
import { styles } from '../_styles/RemindersCalendar/Toolbar';

type Props = {
  classes: Object,
  localizer: { messages: Object },
  label: string,
  views: Array<string>,
  view: string,
  onView: Function,
  onNavigate: Function
};

type State = {};

class Toolbar extends React.PureComponent<Props, State> {
  handleClick = (action) => () => {
    const { onNavigate } = this.props;
    onNavigate(action);
  };

  handleView = (view) => () => {
    const { onView } = this.props;
    onView(view);
  };

  render() {
    const {
      classes,
      localizer: { messages },
      label,
      views,
      view
    } = this.props;

    return (
      <main className={classes.main}>
        <Typography variant="h5">{label}</Typography>
        <div>
          {false &&
            views.map((name) => (
              <Fab
                size="small"
                key={name}
                aria-label={name}
                variant="extended"
                disabled={view === name}
                className={classes.fab}
                onClick={this.handleView(name)}
              >
                {messages[name]}
              </Fab>
            ))}
        </div>
        <div>
          <Fab
            size="small"
            color="primary"
            variant="extended"
            aria-label={messages.previous}
            className={classes.fab}
            onClick={this.handleClick(navigate.PREVIOUS)}
          >
            <KeyboardArrowLeftIcon className={classes.extendedIcon} />
          </Fab>
          <Fab
            size="small"
            color="primary"
            variant="extended"
            aria-label={messages.next}
            className={classes.fab}
            onClick={this.handleClick(navigate.NEXT)}
          >
            <KeyboardArrowRightIcon className={classes.extendedIcon} />
          </Fab>
          <Fab
            size="small"
            aria-label={messages.today}
            variant="extended"
            className={classes.fab}
            onClick={this.handleClick(navigate.TODAY)}
          >
            {messages.today}
          </Fab>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Toolbar);
