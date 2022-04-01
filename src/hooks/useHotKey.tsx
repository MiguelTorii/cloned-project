import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { last, uniq } from 'lodash';

export const HOTKEYS = {
  EDIT_MESSAGE: { key: 'Shift+ArrowUp', text: 'Shift+Up' },
  CREATE_NEW_CHAT: { key: 'Ctrl+k', text: 'Control+K' },
  TAB: { key: 'Tab', text: 'Next Field' },
  PRIOR_TAB: { key: 'Shift+Tab', text: 'Next Field' }
};

const useHotkey = (keys, callback, node = null) => {
  const parseKeys = (triggerKeys) => {
    const combos = {};
    const singleKeys = [];
    uniq(triggerKeys)
      .map((combo) => {
        const comboKeys = combo.split('+');
        return comboKeys;
      })
      .filter((comboKeys) => comboKeys.length <= 2)
      .forEach((comboKeys) => {
        const key = last(comboKeys);
        if (comboKeys.length === 1) {
          singleKeys.push(key);
        } else {
          const specialKey = comboKeys[0];
          if (key in combos) {
            combos[key].push(specialKey);
          } else {
            combos[key] = [specialKey];
          }
        }
      });
    return { combos, singleKeys };
  };

  const handleKeyPress = useCallback(
    (event) => {
      const key = event.key;
      const specialKey = () => {
        if (event.ctrlKey) {
          return 'Ctrl';
        } else if (event.shiftKey) {
          return 'Shift';
        } else if (event.altKey) {
          return 'Alt';
        }
      };
      const { combos, singleKeys } = parseKeys(keys);

      const hasSpecialKey = specialKey() !== undefined;
      const comboPressed = hasSpecialKey && combos[key] && combos[key].includes(specialKey());
      let keyPressed = comboPressed;
      try {
        const singlePressed = !hasSpecialKey && singleKeys.includes(key);
        keyPressed = comboPressed || singlePressed;
      } catch (e) {
        console.error(`error: ${e}`);
      }
      if (keyPressed) {
        callback();
      }
    },
    [keys]
  );

  useEffect(() => {
    const targetNode = node ?? document;
    if (targetNode) {
      targetNode.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (targetNode) {
        targetNode.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [handleKeyPress, node]);
};

export default useHotkey;
