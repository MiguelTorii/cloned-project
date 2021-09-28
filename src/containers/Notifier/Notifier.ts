import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { removeSnackbar } from '../../actions/notifications';

let displayed = [];

const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((store: any) => store.notifications.items || []);
  const pathname = useSelector((store: any) => store.router.location.pathname || '');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(({ nextPath, key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }

      // display only on correct screen after navigation
      if (nextPath && pathname && pathname !== nextPath) {
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) {
        return;
      }

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if ((options as any).onClose) {
            (options as any).onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {
          // removen this snackbar from redux store
          dispatch(
            removeSnackbar({
              key: String(myKey)
            })
          );
          removeDisplayed(myKey);
        }
      });
      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    }); // eslint-disable-next-line
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
  return null;
};

export default Notifier;
