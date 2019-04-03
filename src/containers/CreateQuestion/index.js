// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import QuestionForm from '../../components/question-form';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {
  title: string,
  userClass: string,
  description: string
};

class CreateQuestion extends React.PureComponent<Props, State> {
  state = {
    title: '',
    userClass: '',
    description: ''
  };

  handleChange = (field: string) => (
    // eslint-disable-next-line no-undef
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const { target } = event;
    // eslint-disable-next-line no-undef
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    this.setState({
      [field]: target.value
    });
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    const { title, userClass, description } = this.state;
    return (
      <div className={classes.root}>
        <QuestionForm
          handleChange={this.handleChange}
          handleDescriptionChange={this.handleDescriptionChange}
          handleSubmit={this.handleSubmit}
          title={title}
          userClass={userClass}
          description={description}
        />
      </div>
    );
  }
}

// const mapDispatchToProps = (dispatch: *): {} =>
//   bindActionCreators(
//     {
//       openNotifications: notificationsActions.openNotifications
//     },
//     dispatch
//   );

export default connect(
  null,
  null
)(withStyles(styles)(CreateQuestion));
