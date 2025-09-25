import { PersonLink } from '../PersonLink';
import type { Person } from '../../types/Person';
import './PeopleTable.scss';
import React from 'react';

type Props = {
  people: Person[];
  selectedSlug?: string;
};

const generateSlug = (person: Person) =>
  person.name.trim().toLowerCase().replace(/\s+/g, '-');

const PeopleTable: React.FC<Props> = ({ people, selectedSlug }) => (
  <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>Name</th>
        <th>Born</th>
        <th>Died</th>
        <th>Mother</th>
        <th>Father</th>
      </tr>
    </thead>
    <tbody>
      {people.map(person => {
        const slug = generateSlug(person);

        return (
          <tr
            key={slug}
            className={slug === selectedSlug ? 'has-background-warning' : ''}
          >
            <td>
              <PersonLink person={person} />
            </td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td>
              <PersonLink name={person.motherName} people={people} />
            </td>
            <td>
              <PersonLink name={person.fatherName} people={people} />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default PeopleTable;
