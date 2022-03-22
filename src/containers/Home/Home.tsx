import React, { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import useScript from '../../hooks/useScript';
import AuthRedirect from '../../pages/AuthRedirect/AuthRedirectPage';
import type { State as StoreState } from '../../types/state';
import HudFrame from '../../hud/frame/HudFrame';

const styles = () => ({
  loading: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes?: any;
  user?: any;
};

const Home = ({ classes, user }: Props) => {
  const {
    data: { userId },
    isLoading
  } = user;
  const widgetUrl = useMemo(
    () => !userId && 'https://widget.freshworks.com/widgets/67000003041.js',
    [userId]
  );

  const widgetId = useMemo(() => !userId && 67000003041, [userId]);
  const status = useScript(widgetUrl);
  useEffect(() => {
    function loadWidget() {
      if (!userId && typeof window !== 'undefined') {
        (window as any).fwSettings = {
          widget_id: widgetId,
          hideChatButton: true
        };

        if (typeof (window as any).FreshworksWidget !== 'function') {
          const n = function () {
            n.q.push(arguments);
          };
          n.q = [];
          (window as any).FreshworksWidget = n;
        }
      }
    }

    function hideWidget() {
      if (userId) {
        (window as any).FreshworksWidget('hide', 'launcher');
      } else {
        (window as any).FreshworksWidget('show', 'launcher');
      }
    }

    loadWidget();
    hideWidget();
  }, [widgetId, widgetUrl, status, userId]);

  if (isLoading && !userId) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (!userId) {
    return <AuthRedirect />;
  }

  return <HudFrame />;
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(withStyles(styles as any)(Home));
