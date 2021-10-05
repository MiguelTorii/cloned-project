import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PostsList from '../../components/PostsList/PostsList';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  }
});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
};
type State = {};

class Feed extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <PostsList />
        </div>
      </ErrorBoundary>
    );
  }
}

export default connect<{}, {}, Props>(null, null)(withStyles(styles as any)(Feed));
