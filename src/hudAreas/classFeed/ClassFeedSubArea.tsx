import React, { useRef } from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { decypherClass } from 'utils/crypto';

import CreatePostLayout from 'containers/CreatePostLayout/CreatePostLayout';
import CreateShareLink from 'containers/CreateShareLink/CreateShareLink';
import Feed from 'containers/Feed/Feed';
import ViewNotes from 'containers/ViewNotes/ViewNotes';
import ViewPost from 'containers/ViewPost/ViewPost';
import ViewQuestion from 'containers/ViewQuestion/ViewQuestion';
import ViewShareLink from 'containers/ViewShareLink/ViewShareLink';
import {
  CREATE_NOTES_PATHNAME,
  CREATE_POST_PATHNAME,
  EDIT_NOTES_PATHNAME_PREFIX,
  EDIT_POST_PATHNAME_PREFIX,
  PROFILE_SOURCE_KEY
} from 'routeConstants';

import { useStyles } from './ClassFeedSubAreaStyles';

const ClassFeedSubArea = () => {
  const classes: any = useStyles();

  const pathname: string = useSelector((state: any) => state.router.location.pathname);
  const query: string = useSelector((state: any) => state.router.location.query);

  const from = query[PROFILE_SOURCE_KEY];

  const { feedId, postId, noteId, sharelinkId, questionId } = useParams();
  const { classId, sectionId } = decypherClass();

  if (pathname === CREATE_POST_PATHNAME || pathname.startsWith(EDIT_POST_PATHNAME_PREFIX)) {
    return <CreatePostLayout postId={postId} />;
  }

  if (pathname === CREATE_NOTES_PATHNAME || pathname.startsWith(EDIT_NOTES_PATHNAME_PREFIX)) {
    return <CreatePostLayout noteId={noteId} />;
  }

  if (pathname.startsWith('/post/')) {
    return <ViewPost postId={postId} />;
  }

  if (pathname.startsWith('/notes/')) {
    return <ViewNotes noteId={noteId} />;
  }

  if (pathname.startsWith('/sharelink/')) {
    return <ViewShareLink sharelinkId={sharelinkId} />;
  }

  if (pathname.startsWith('/question/')) {
    return <ViewQuestion questionId={questionId} />;
  }

  if (pathname.startsWith('/edit/question/') || pathname.startsWith('/create/question')) {
    return <CreatePostLayout questionId={questionId} />;
  }

  if (pathname.startsWith('/create/sharelink')) {
    return <CreatePostLayout />;
  }

  if (pathname.startsWith('/edit/sharelink/')) {
    return <CreatePostLayout sharelinkId={sharelinkId} />;
  }

  return (
    <Feed feedId={Number(feedId)} classId={classId} sectionId={sectionId} from={String(from)} />
  );
};

export default ClassFeedSubArea;
