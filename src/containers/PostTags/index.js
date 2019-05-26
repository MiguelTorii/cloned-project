// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import type { Tag } from '../../types/models';
import { getPostMetadata } from '../../api/posts';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  chip: {
    margin: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  userId: string,
  feedId: number
};

type State = {
  tags: Array<Tag>,
  loading: boolean
};

class PostTags extends React.PureComponent<Props, State> {
  state = {
    tags: [],
    loading: false
  };

  componentDidMount = async () => {
    const { userId, feedId } = this.props;
    try {
      this.setState({ loading: true });
      const { tags } = await getPostMetadata({ userId, feedId });
      this.setState({ tags });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { classes } = this.props;
    const { tags, loading } = this.state;

    if (loading)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          {tags.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              color="primary"
              className={classes.chip}
            />
          ))}
        </ErrorBoundary>
      </div>
    );
  }
}

export default withStyles(styles)(PostTags);
