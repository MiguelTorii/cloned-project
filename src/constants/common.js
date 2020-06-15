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

export const workflowCategories = [
  { name: 'Overdue',  categoryId: 1, bgcolor: '#C45961', buttonColor: '#6F343C' },
  { name: 'Upcoming', categoryId: 2, bgcolor: '#EBAF64', buttonColor: '#5F472B' },
  { name: 'In Progress', categoryId: 3, bgcolor: '#4781B3', buttonColor: '#2D5170' },
  { name: 'Done', categoryId: 4, bgcolor: '#74C182', buttonColor: '#2F5139' }
]
