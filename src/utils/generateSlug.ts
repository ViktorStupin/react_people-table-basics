import type { Person } from '../App';

export const generateSlug = (person: Person) => {
  return person.name.toLowerCase().replace(/\s+/g, '-');
};
