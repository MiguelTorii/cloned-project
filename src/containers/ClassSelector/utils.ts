/* eslint-disable no-restricted-syntax */

/* eslint-disable import/prefer-default-export */
import type { UserClass, SelectType } from '../../types/models';
export const processClasses = ({
  classes,
  segment
}: {
  classes: Array<UserClass>,
  segment: string
}): Array<SelectType> => {
  if (segment === 'K12') {
    return classes
      .filter((item) => item.permissions.canCreate)
      .map((item) => ({
        label: item.className,
        value: JSON.stringify({
          classId: item.classId
        })
      }));
  }

  const items = classes
    .filter((item) => item.permissions.canCreate)
    .map((item) =>
      item.section.map((o) => ({
        label: `${o.subject} ${item.className}: ${o.firstName} ${o.lastName} - ${o.section}`,
        value: JSON.stringify({
          classId: item.classId,
          sectionId: o.sectionId
        })
      }))
    );
  const result = [];

  for (const item of items) {
    result.push(...item);
  }

  return result;
};
