/* eslint-disable no-restricted-syntax */

/* eslint-disable import/prefer-default-export */
import type { UserClass } from '../../types/models';

export const processUserClasses = ({
  classes,
  segment
}: {
  classes: Array<UserClass>;
  segment: string;
}) => {
  if (segment === 'K12') {
    return classes.map((item) => ({
      value: JSON.stringify({
        classId: item.classId
      }),
      label: item.className
    }));
  }

  if (segment === 'College') {
    const items = classes.map((item) =>
      item.section.map((section) => ({
        value: JSON.stringify({
          classId: item.classId,
          sectionId: section.sectionId
        }),
        label: `${section.subject} ${item.className}: ${section.firstName} ${section.lastName} - ${section.section}`
      }))
    );
    const result = [];

    for (const item of items) {
      result.push(...item);
    }

    return result;
  }

  return [];
};
