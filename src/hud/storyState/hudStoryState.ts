export type HudStoryState = {
  conversation: string;
  initialLoadTriggered: boolean;
};

export const defaultState: HudStoryState = {
  conversation: '',
  initialLoadTriggered: false
};
