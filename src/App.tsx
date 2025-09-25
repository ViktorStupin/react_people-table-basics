import { useEffect, useState } from 'react';
import classNames from 'classnames';
import './App.scss';

interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  motherName?: string;
  fatherName?: string;
}

const ACTIVE_NAV_LINK_CLASS = 'has-background-grey-lighter';
const SELECTED_PERSON_CLASS = 'has-background-warning';

// Компонент для завантаження
const Loader = () => (
  <div data-cy="loader" className="loader-container">
    <div className="loader is-active"></div>
  </div>
);

// Головна сторінка
const HomePage = () => (
  <h1 className="title">Home Page</h1>
);

// Сторінка з людьми
const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Оновлюємо вибраний slug при зміні hash
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      const slug = currentHash.includes('/people/')
        ? currentHash.split('/people/')[1]
        : null;
      setSelectedSlug(slug);
    };

    // Слухаємо зміни hash
    window.addEventListener('hashchange', handleHashChange);

    // Встановлюємо початкове значення
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('./api/people.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load people');
        }
        return response.json();
      })
      .then(data => {
        setPeople(data);
      })
      .catch(() => setError('Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  // Генеруємо slug для людини
  const generateSlug = (person: Person) => {
    return `${person.name.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, '-')}-${person.born}`;
  };

  // Знаходимо людину за іменем
  const findPersonByName = (name: string) => {
    return people.find(person => person.name === name);
  };

  // Обробник кліку на людину
  const handlePersonClick = (person: Person, e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = `#/people/${generateSlug(person)}`;
  };

  // Обробник кліку на батьків
  const handleParentClick = (parentName: string, e: React.MouseEvent) => {
    e.preventDefault();
    const parent = findPersonByName(parentName);
    if (parent) {
      window.location.hash = `#/people/${generateSlug(parent)}`;
    }
  };

  if (loading) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <Loader />
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      </>
    );
  }

  if (!people.length) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      </>
    );
  }

  return (
    <>
      <h1 className="title">People Page</h1>

      <table data-cy="peopleTable" className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sex</th>
            <th>Born</th>
            <th>Died</th>
            <th>Mother</th>
            <th>Father</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, index) => (
            <tr
              key={index}
              data-cy="person"
              className={classNames({
                [SELECTED_PERSON_CLASS]: generateSlug(person) === selectedSlug
              })}
            >
              <td>
                <a
                  href={`#/people/${generateSlug(person)}`}
                  className={classNames({
                    'has-text-danger': person.sex === 'f'
                  })}
                  onClick={(e) => handlePersonClick(person, e)}
                >
                  {person.name}
                </a>
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {person.motherName ? (
                  findPersonByName(person.motherName) ? (
                    <a
                      href={`#/people/${generateSlug(findPersonByName(person.motherName)!)}`}
                      className="has-text-danger"
                      onClick={(e) => handleParentClick(person.motherName!, e)}
                    >
                      {person.motherName}
                    </a>
                  ) : (
                    person.motherName
                  )
                ) : '-'}
              </td>
              <td>
                {person.fatherName ? (
                  findPersonByName(person.fatherName) ? (
                    <a
                      href={`#/people/${generateSlug(findPersonByName(person.fatherName)!)}`}
                      onClick={(e) => handleParentClick(person.fatherName!, e)}
                    >
                      {person.fatherName}
                    </a>
                  ) : (
                    person.fatherName
                  )
                ) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

// Сторінка не знайдена
const NotFoundPage = () => (
  <h1 className="title">Page not found</h1>
);

// Навігація
const Navigation = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getActiveClass = (path: string) => {
    if (path === '#/' && (currentHash === '#/' || currentHash === '' || currentHash === '#/home')) {
      return ACTIVE_NAV_LINK_CLASS;
    }
    return currentHash.startsWith(path) && path !== '#/' ? ACTIVE_NAV_LINK_CLASS : '';
  };

  return (
    <nav
      data-cy="nav"
      className="navbar is-fixed-top has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a
            className={`navbar-item ${getActiveClass('#/')}`}
            href="#/"
          >
            Home
          </a>
          <a
            className={`navbar-item ${getActiveClass('#/people')}`}
            href="#/people"
          >
            People
          </a>
        </div>
      </div>
    </nav>
  );
};

// Головний компонент
export const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'people' | 'notFound'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '' || hash === '#/' || hash === '#/home') {
        setCurrentPage('home');
      } else if (hash.startsWith('#/people')) {
        setCurrentPage('people');
      } else {
        setCurrentPage('notFound');
      }
    };

    // Обробка перенаправлення з /home на /
    if (window.location.hash === '#/home') {
      window.location.hash = '#/';
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Встановлюємо початкову сторінку

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'people':
        return <PeoplePage />;
      case 'notFound':
        return <NotFoundPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div data-cy="app">
      <Navigation />

      <main className="section">
        <div className="container">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};
