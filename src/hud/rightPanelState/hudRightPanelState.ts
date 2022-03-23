import type { TMission } from 'types/models';

export type HudRightPanelState = {
  missions: Array<TMission>;
};

export const defaultState: HudRightPanelState = {
  missions: null
};
