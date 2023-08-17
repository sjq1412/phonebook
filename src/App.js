import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import personService from "./services/persons";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    variant: null,
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const resetNotification = () => {
    setTimeout(() => {
      setNotification({ message: null, variant: null });
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    // check if name already exists
    const personExists = persons.find((person) => person.name === newName);
    if (personExists) alert(`${newName} is already added to phonebook`);

    if (!personExists) {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((returnedPerson) => {
        setNotification({
          message: `Added ${returnedPerson.name}`,
          variant: "success",
        });
        resetNotification();
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.log(error);
          setNotification({
            message: `Information of ${person.name} has already been removed from the server`,
            variant: "error",
          });
          setPersons(persons.filter((p) => p.id !== id));
          resetNotification();
        });
    }
  };

  const personsToDisplay = filter
    ? persons.filter((person) => {
        return person.name
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase());
      })
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        variant={notification.variant}
      />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
