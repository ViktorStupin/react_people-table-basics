import { useEffect, useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useParams,
} from 'react-router-dom';

import { Loader } from './components/Loader/Loader';
import { PersonLink } from './components/PersonLink';
import { generateSlug } from './utils/generateSlug';
import React from 'react';

export type Person = {
  name: string;
  sex: string;
  born: number;
  died: number;
  motherName: string | null;
  fatherName: string | null;
};

const HomePage: React.FC = () => {
  return (
    <div className="content">
      <h1 className="title">Home Page</h1>
    </div>
  );
};

const PeoplePage: React.FC<{ people: Person[] }> = ({ people }) => {
  const { slug } = useParams();
  const selectedSlug = slug || null;

  return (
    <div className="content">
      <h1 className="title">People Table</h1>

      <table className="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Sex</th>
            <th>Born</th>
            <th>Died</th>
            <th>Mother</th>
            <th>Father</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, index) => {
            const personSlug = generateSlug(person);

            return (
              <tr
                key={personSlug}
                className={
                  personSlug === selectedSlug
                    ? 'has-background-grey-lighter'
                    : ''
                }
              >
                <td>{index + 1}</td>
                <td>
                  <PersonLink person={person} />
                </td>
                <td>{person.sex}</td>
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
    </div>
  );
};

export const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mate-academy.github.io/react_people-table/api/people.json')
      .then(res => res.json())
      .then(setPeople)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <HashRouter>
      <nav className="navbar is-link" role="navigation">
        <div className="navbar-menu">
          <div className="navbar-start">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/people"
              className={({ isActive }) =>
                `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`
              }
            >
              People
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/people" element={<PeoplePage people={people} />} />
        <Route path="/people/:slug" element={<PeoplePage people={people} />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
