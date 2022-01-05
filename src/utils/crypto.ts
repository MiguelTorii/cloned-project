import queryString from 'query-string';

export type ClassSectionLocation = {
  classId?: number;
  sectionId?: number;
};

export const cypher = (text: string): string => {
  try {
    return btoa(text);
  } catch (e) {
    return '';
  }
};

export const decypher = (text: string): string => {
  try {
    return atob(text);
  } catch (e) {
    return '';
  }
};

export const cypherClass = (location: ClassSectionLocation): string =>
  cypher(`${location.classId}:${location.sectionId}`);

export const decypherClass = (): ClassSectionLocation => {
  try {
    const { class: classCypher } = queryString.parse(window.location.search);
    if (classCypher) {
      const [classId, sectionId] = decypher(classCypher as string).split(':');
      return {
        classId: Number(classId),
        sectionId: Number(sectionId)
      };
    }
  } catch (error) {}
  return {};
};

export const decipherClassId = (encryptedString: string) => {
  if (!encryptedString) {
    return null;
  }

  try {
    const [classId, sectionId] = decypher(encryptedString).split(':');
    return {
      classId: Number(classId),
      sectionId: Number(sectionId)
    };
  } catch {}

  return null;
};
