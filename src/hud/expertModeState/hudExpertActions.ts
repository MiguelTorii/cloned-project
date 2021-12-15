export const hudExpertActions = {
  TOGGLE_EXPERT_MODE: 'TOGGLE_EXPERT_MODE'
};

export const hudToggleExpertMode = (isExpert: boolean) => ({
  type: hudExpertActions.TOGGLE_EXPERT_MODE,
  payload: {
    isExpert
  }
});
