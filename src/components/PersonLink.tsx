import { Link } from 'react-router-dom';
import { generateSlug } from '../utils/generateSlug';
import React from 'react';

type Person = {
  name: string;
  sex: string;
  born: number;
  died: number;
  motherName: string | null;
  fatherName: string | null;
};

type Props = {
  person?: Person;
  name?: string | null;
  people?: Person[];
};

export const PersonLink: React.FC<Props> = ({ person, name, people }) => {
  // випадок: якщо передали person напряму
  if (person) {
    const slug = generateSlug(person);

    return (
      <Link
        to={`/people/${slug}`}
        className={person.sex === 'f' ? 'has-text-danger' : ''}
      >
        {person.name}
      </Link>
    );
  }

  // випадок: якщо передали name + people
  if (name) {
    const found = people?.find(p => p.name === name);

    if (found) {
      const slug = generateSlug(found);

      return (
        <Link
          to={`/people/${slug}`}
          className={found.sex === 'f' ? 'has-text-danger' : ''}
        >
          {found.name}
        </Link>
      );
    }

    return <span>{name}</span>;
  }

  // випадок: нічого немає
  return <span>-</span>;
};
