import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { StudyCircle as StudyCircleState } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import MyStudyCircle from '../../components/MyStudyCircle/MyStudyCircle';
import { getStudyCircle } from '../../api/user';
import { removeFromStudyCircle } from '../../api/posts';
import * as chatActions from '../../actions/chat';
import { ChatState } from '../../reducers/chat';
import { ChatClientContext } from 'features/chat';

const styles = () => ({});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  chat?: ChatState;
  openChannelWithEntity?: (...args: Array<any>) => any;
};
type State = {
  isLoading: boolean;
  circle: StudyCircleState;
};

class StudyCircle extends React.PureComponent<Props, State> {
  static contextType = ChatClientContext;

  state = {
    isLoading: true,
    circle: []
  };

  mounted: boolean;

  componentDidMount = async () => {
    this.mounted = true;
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const circle = await getStudyCircle({
      userId
    });
    this.setState({
      circle,
      isLoading: false
    });
  };

  handleRemove = async (classmateId) => {
    try {
      const {
        user: {
          data: { userId }
        }
      } = this.props;
      this.setState({
        isLoading: true
      });
      await removeFromStudyCircle({
        userId,
        classmateId,
        feedId: null
      });
      const circle = await getStudyCircle({
        userId
      });
      this.setState({
        circle,
        isLoading: false
      });
    } catch (err) {
      this.setState({
        isLoading: false
      });
    }
  };

  handleStartChat = ({ userId, firstName, lastName }) => {
    const { openChannelWithEntity } = this.props;
    this.setState({
      isLoading: true
    });
    const client = this.context;
    openChannelWithEntity({
      entityId: userId ? Number(userId) : 0,
      entityFirstName: firstName,
      entityLastName: lastName,
      entityVideo: false,
      client
    });
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 2000);
  };

  render() {
    const { classes } = this.props;
    const { circle, isLoading } = this.state;
    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <MyStudyCircle
            isLoading={isLoading}
            circle={circle}
            onRemove={this.handleRemove}
            onStartChat={this.handleStartChat}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      openChannelWithEntity: chatActions.openChannelWithEntity
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(StudyCircle));
