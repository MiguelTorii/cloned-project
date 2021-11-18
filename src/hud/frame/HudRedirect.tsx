import React from 'react';
import { useSelector } from 'react-redux';
import Miss from '../../pages/Miss/Miss';

// TODO fixup the paths below so that the components handle the
// route details properly.
const pathsToRedirect: Record<string, string> = {
  '/create_post': '/',
  '/edit/flashcards/:flashcardId': '/',
  '/create/notes': '/',
  '/edit/notes/:noteId': '/',
  '/post/:postId': '/',
  '/notes/:noteId': '/',
  '/sharelink/:sharelinkId': '/',
  '/edit/sharelink/:sharelinkId': '/',
  '/question/:questionId': '/',
  '/create/question': '/',
  '/edit/question/:questionId': '/',
  '/create/sharelink': '/'
};

const HudRedirect = () => {
  const pathname: string = useSelector((state: any) => state.router.location.pathname);

  // TODO do matching for the URL ids to do more redirects.
  const hudRoute = pathsToRedirect[pathname];
  if (hudRoute) {
    window.location.href = hudRoute;
    return null;
  }
  return <Miss />;
};

export default HudRedirect;
