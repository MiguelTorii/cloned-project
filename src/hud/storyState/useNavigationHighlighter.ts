import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { clearNavigationHighlight } from '../navigationState/hudNavigationActions';

import type { HudNavigationState } from '../navigationState/hudNavigationState';

const useNavigationHighlighter = () => {
  const dispatch = useDispatch();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  useEffect(() => {
    if (highlightedNavigation) {
      if (
        selectedMainArea === highlightedNavigation.rootAreaId &&
        selectedMainSubArea === highlightedNavigation.leafAreaId
      ) {
        dispatch(clearNavigationHighlight());
      }
    }
  }, [highlightedNavigation, selectedMainArea, selectedMainSubArea]);

  return {};
};

export default useNavigationHighlighter;
