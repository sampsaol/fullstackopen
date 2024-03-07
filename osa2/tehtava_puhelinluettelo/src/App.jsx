import { useState } from 'react'
import Persons from './components/Persons'
// props needed are persons and newFilter --  responsible for showing the "phonebook" either fully or based on the filter
import Filter from './components/Filter'
// props needed are handleFilterChange and newFilter -- responsible for filters form
import PersonForm from './components/PersonForm'
// props needed are addPerson, handlePersonChange, handleNumberChange, newName and newNumber --  responsible for name and number forms


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber}
    const test = persons.find((element) => element.name === newName)
    if (test) {
      return (
        alert(`${newName} is already added to phonebook`)
      )
    }
      setPersons(persons.concat(personObject))
      setNewNumber('')
      setNewName('')
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
       handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} 
       newName={newName} newNumber={newNumber}/>
      <h3>Numbers</h3>
      <ul>
        <Persons persons={persons} newFilter={newFilter}/>
      </ul>
    </div>
  )

}

export default App
