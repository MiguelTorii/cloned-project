const collegeGrades = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const addSuffix = (grade: number) => {
  switch (grade) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};
export const gradeName = (segment, grade = 1) => {
  if (segment === 'College') {
    return collegeGrades[grade - 1];
  }
  return `${grade}${addSuffix(grade)} Grade`;
};
export const ranks = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Master'
];
