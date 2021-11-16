export const experienceActions = {
  SET_EXPERIENCE_POINTS: 'SET_EXPERIENCE_POINTS',
  SET_EXPERIENCE_GOAL_TOTAL: 'SET_EXPERIENCE_GOAL_TOTAL'
};

export const setExperiencePoints = (experiencePoints: number) => ({
  type: experienceActions.SET_EXPERIENCE_POINTS,
  payload: {
    experiencePoints
  }
});

export const setExperienceGoalTotal = (experienceGoalTotal: number) => ({
  type: experienceActions.SET_EXPERIENCE_GOAL_TOTAL,
  payload: {
    experienceGoalTotal
  }
});
