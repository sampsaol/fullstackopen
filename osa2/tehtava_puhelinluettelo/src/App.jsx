import { useState, useEffect } from 'react'
import personService from './services/person'
import Persons from './components/Persons'
// props needed are persons and newFilter --  responsible for showing the "phonebook" either fully or based on the filter
import Filter from './components/Filter'
// props needed are handleFilterChange and newFilter -- responsible for filters form
import PersonForm from './components/PersonForm'
// props needed are addPerson, handlePersonChange, handleNumberChange, newName and newNumber --  responsible for name and number forms



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber}
    const nameCheck = persons.find((element) => element.name === newName)
    if (nameCheck) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const updatedPerson = {...nameCheck, number: newNumber}
        personService
          .updateNumber(updatedPerson, nameCheck.id, newNumber)
            .then(() => 
            personService
              .getAll()
                .then(updatedPersons => {
                    setPersons(updatedPersons)
              }))
      }
    }
    else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
          })
    }
  }

  const removeButton = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .removePerson(id)
          .then(() => 
            personService
              .getAll()
                .then(updatedPersons => {
                    setPersons(updatedPersons)
              }))
    }

      }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson}
       handlePersonChange={handlePersonChange} 
       handleNumberChange={handleNumberChange} 
       newName={newName} 
       newNumber={newNumber}/>
      <h3>Numbers</h3>
      <ul>
        <Persons 
        persons={persons} 
        newFilter={newFilter}
        removeButton={removeButton}/>
      </ul>
    </div>
  )

}

export default App
