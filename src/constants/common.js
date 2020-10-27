const collegeGrades = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const addSuffix = (grade) => {
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
  { name: 'Overdue', categoryId: 1, bgcolor: '#C45961', buttonColor: '#6F343C' },
  { name: 'Upcoming', categoryId: 2, bgcolor: '#EBAF64', buttonColor: '#5F472B' },
  { name: 'In Progress', categoryId: 3, bgcolor: '#4781B3', buttonColor: '#2D5170' },
  { name: 'Done', categoryId: 4, bgcolor: '#74C182', buttonColor: '#2F5139' }
]

export const remiderTime = {
  60: { label: '1 minute before', type: 'minutes', value: 1 * 60 },
  300: { label: '5 minutes before', type: 'minutes', value: 5 * 60 },
  600: { label: '10 minutes before', type: 'minutes', value: 10 * 60 },
  900: { label: '15 minutes before', type: 'minutes', value: 15 * 60 },
  1800: { label: '30 minutes before', type: 'minutes', value: 30 * 60 },
  3600: { label: '1 hour before', type: 'hour', value: 60 * 60 },
  7200: { label: '2 hours before', type: 'hour', value: 120 * 60 },
  86400: { label: '1 day before', type: 'day', value: 24 * 60 * 60 },
  172800: { label: '2 days before', type: 'day', value: 24 * 120 * 60 },
}
