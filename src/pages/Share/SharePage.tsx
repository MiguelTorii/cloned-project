import React, { useEffect, useState } from 'react';

import { Redirect } from 'react-router';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import { logEvent } from 'api/analytics';
import { getPostInfo } from 'api/posts';
import withRoot from 'withRoot';

const styles = (theme) => ({
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
});

type Props = {
  classes: Record<string, any>;
  match: {
    params: {
      code: string;
    };
  };
};

const SharePage = ({ classes, match }: Props) => {
  const [redirect, setRedirect] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const {
        params: { code }
      } = match;

      try {
        const {
          typeId,
          postInfo: { postId, feedId }
        } = await getPostInfo({
          hid: code
        });

        switch (typeId) {
          case 3:
            setRedirect(`/flashcards/${postId}`);
            break;

          case 4:
            setRedirect(`/notes/${postId}`);
            break;

          case 5:
            setRedirect(`/sharelink/${postId}`);
            break;

          case 6:
            setRedirect(`/question/${postId}`);
            break;

          case 8:
            setRedirect(`/post/${postId}`);
            break;

          default:
            break;
        }

        logEvent({
          event: 'User- Opened Generated Link',
          props: {
            'Internal ID': feedId
          }
        });
      } catch (err) {
        setError(true);
      }
    };

    init();
  }, []);

  if (redirect !== '') {
    return <Redirect to={redirect} />;
  }

  if (error) {
    return <Redirect to="/" />;
  }

  return (
    <main>
      <CssBaseline />
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    </main>
  );
};

export default withRoot(withStyles(styles as any)(SharePage));
