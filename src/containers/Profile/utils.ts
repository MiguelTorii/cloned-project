// @flow

export const processSeasons = (stats: Array<Object>) => {
  const seasons = [];
  const all = {
    seasonId: 0,
    bestAnswers: 0,
    communityServiceHours: 0,
    currentSeason: false,
    name: 'All',
    points: 0,
    rankReached: 0,
    reach: 0,
    thanks: 0
  };
  stats.forEach((item) => {
    seasons.push(item);
    all.bestAnswers += item.bestAnswers;
    all.communityServiceHours += item.communityServiceHours;
    all.points += item.points;
    all.rankReached = Math.max(all.rankReached, item.rankReached);
    all.reach += item.reach;
    all.thanks += item.thanks;
  });
  seasons.push(all);
  return seasons;
};
