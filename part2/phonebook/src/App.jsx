import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
              setNotification(`Updated ${newName}`)
              setNotificationType('success')
              setTimeout(() => {
                setNotification(null)
                setNotificationType(null)
              }, 5000)
            })
          .catch(error => {
            setNotification(`Information of '${newName}' has already been removed from server`)
            setNotificationType('error')
            setTimeout(() => {
              setNotification(null)
              setNotificationType(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification(`Added ${newName}`)
            setNotificationType('success')
            setTimeout(() => {
              setNotification(null)
              setNotificationType(null)
            }, 5000)
          })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .removePerson(id)
          .then(response => {
            console.log(response)
            setPersons(persons.filter(person => person.id !== id))
          })
    }
  }

  const personsToShow = filterName
    ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} type={notificationType} />

      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>

      <div>debug: {newName}</div>
      <div>debug: {newNumber}</div>
      <div>debug: {filterName}</div>
      
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App