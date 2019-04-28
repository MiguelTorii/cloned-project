// @flow

import React, { Fragment } from 'react';
import PostItemAddComment from '../../components/PostItem/PostItemAddComment';
import PostItemComment from '../../components/PostItem/PostItemComment';

type Props = {};

class ViewNotes extends React.PureComponent<Props> {
  componentDidMount = async () => {};

  render() {
    return (
      <Fragment>
        <PostItemAddComment />
        <PostItemComment />
      </Fragment>
    );
  }
}

export default ViewNotes;
