import { useState, useEffect } from 'react';
import { Loader } from '../components/Loader/Loader';
import PeopleTable from '../components/PeopleTable/PeopleTable';
import type { Person } from '../types/Person';
import { useParams } from 'react-router-dom';
import React from 'react';

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    setLoading(true);
    fetch('https://mate-academy.github.io/react_people-table/api/people.json')
      .then(res => res.json())
      .then((data: Person[]) => setPeople(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>People Page</h1>
      <PeopleTable people={people} selectedSlug={slug} />
    </div>
  );
};

export default PeoplePage;
