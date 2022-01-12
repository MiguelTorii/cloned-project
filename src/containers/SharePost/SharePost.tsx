import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import { createShareURL } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import ShareDialog from '../../components/ShareDialog/ShareDialog';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  feedId: number;
  open: boolean;
  onClose?: (...args: Array<any>) => any;
};

const SharePost = ({ classes, feedId, open, onClose }: Props) => {
  const [wasOpen, setWasOpen] = useState<boolean>();
  const [lastFeedId, setLastFeedId] = useState<number>();
  const [link, setLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const {
    isLoading,
    error,
    data: { userId }
  } = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    const loadShareUrl = async () => {
      if (
        (open !== wasOpen && link === '' && open === true) ||
        (open !== wasOpen && feedId !== lastFeedId && open === true)
      ) {
        try {
          setLoading(true);

          // TODO fix race condition where if the feedId changes
          // the share url could get out of sync.
          const url = await createShareURL({
            userId,
            feedId
          });
          setLink(url);
        } finally {
          setLoading(false);
          logEvent({
            event: 'User- Generated Link',
            props: {
              'Internal ID': feedId
            }
          });
        }
      }
    };
    loadShareUrl();
    setWasOpen(open);
    setLastFeedId(feedId);
  }, [userId, open, link, wasOpen, feedId, lastFeedId]);

  const handleLinkCopied = () => {
    enqueueSnackbar('Shareable Link has been copied.', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      autoHideDuration: 3000,
      ContentProps: {
        classes: {
          root: classes.stackbar
        }
      }
    });
  };

  if (isLoading) {
    return <CircularProgress size={12} />;
  }

  if (userId === '' || error) {
    return <>Oops, there was an error loading your data, please try again.</>;
  }

  return (
    <ErrorBoundary>
      <ShareDialog
        open={open}
        link={link}
        isLoading={loading}
        onLinkCopied={handleLinkCopied}
        onClose={onClose}
      />
    </ErrorBoundary>
  );
};

export default withStyles(styles as any)(SharePost);
