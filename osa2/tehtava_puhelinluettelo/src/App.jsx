import { useState, useEffect } from 'react'
import personService from './services/person'
import Persons from './components/Persons'
// props needed are persons and newFilter --  responsible for showing the "phonebook" either fully or based on the filter
import Filter from './components/Filter'
// props needed are handleFilterChange and newFilter -- responsible for filters form
import PersonForm from './components/PersonForm'
// props needed are addPerson, handlePersonChange, handleNumberChange, newName and newNumber --  responsible for name and number forms

const Notification = ({ message, type }) => {
  const confirmNotificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10

  }

  const errorNotificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10

  }
  if (message === null) {
    return null
  }
  if (type === 'confirm'){
    return (
      <div style={confirmNotificationStyle}>
        {message}
      </div>
    )
    }
  return (
    <div style={errorNotificationStyle}>
      {message}
    </div>
  )
  
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [confirmMessage, setConfirmMessage] = useState(null)
  const [confirmMessageType, setConfirmMessageType] = useState('confirm')

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
    const nameCheck = persons.find((element) => element.name == newName)
    if (nameCheck) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const updatedPerson = {...nameCheck, number: newNumber}
        console.log(updatedPerson)
        personService
          .updateNumber(updatedPerson, updatedPerson.id)
            .then(() => 
            personService
              .getAll()
                .then(updatedPersons => {
                    setPersons(updatedPersons)
                    setConfirmMessageType('confirm')
                    setConfirmMessage(
                      `Updated ${newName}'s number`
                    )
                    setTimeout(() => {
                      setConfirmMessage(null)
                    }, 5000)
             }))
        .catch(error => {
           setConfirmMessageType('error')
          setConfirmMessage(error.response.data.error)
          console.log(error.response.data)
/*           personService
          .getAll()
            .then(initialPersons => {
            setPersons(initialPersons)
          }) */
          setTimeout(() => {
            setConfirmMessage(null)
          }, 5000)
        })
      }
    }
    else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setConfirmMessageType('confirm')
            setConfirmMessage(
              `Added ${newName}`
            )
            setTimeout(() => {
              setConfirmMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
      .catch(error => {
        setConfirmMessageType('error')
        setConfirmMessage(error.response.data.error)
        console.log(error.response.data)
        setTimeout(() => {
          setConfirmMessage(null)
        }, 5000)
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
                    setConfirmMessageType('confirm')
                    setConfirmMessage(
                      `Removed ${newName}`
                    )
                    setTimeout(() => {
                      setConfirmMessage(null)
                    }, 5000)
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
      <Notification message={confirmMessage} type={confirmMessageType}/>
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
