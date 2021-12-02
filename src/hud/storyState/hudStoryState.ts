export type HudStoryState = {
  currentStatement: string;
  greetingLoadTriggered: boolean;
  greetingStatements: string[];
};

export const defaultState: HudStoryState = {
  currentStatement: '',
  greetingLoadTriggered: false,
  greetingStatements: []
};
