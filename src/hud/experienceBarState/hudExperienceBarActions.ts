export const experienceBarActions = {
  SET_EXPERIENCE_POINTS: 'SET_EXPERIENCE_POINTS',
  SET_EXPERIENCE_GOAL_TOTAL: 'SET_EXPERIENCE_GOAL_TOTAL'
};

export const setExperienceBarPoints = (experienceBarPoints: number) => ({
  type: experienceBarActions.SET_EXPERIENCE_POINTS,
  payload: {
    experienceBarPoints
  }
});

export const setExperienceGoalTotal = (experienceGoalTotal: number) => ({
  type: experienceBarActions.SET_EXPERIENCE_GOAL_TOTAL,
  payload: {
    experienceGoalTotal
  }
});
