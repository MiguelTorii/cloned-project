import { useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { removeSnackbar } from 'actions/notifications';

const useNotifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((store: any) => store.notifications.items || []);
  const pathname = useSelector((store: any) => store.router.location.pathname || '');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [displayedIds, setDisplayedIds] = useState<Array<number>>([]);

  const storeDisplayed = (id) => {
    setDisplayedIds([...displayedIds, id]);
  };

  const removeDisplayed = (id) => {
    setDisplayedIds(displayedIds.filter((item) => item !== id));
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
      if (displayedIds.includes(key)) {
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
          dispatch(removeSnackbar(myKey));
          removeDisplayed(myKey);
        }
      });
      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    }); // eslint-disable-next-line
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
