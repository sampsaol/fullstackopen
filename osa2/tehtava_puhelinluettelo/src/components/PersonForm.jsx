const PersonForm = (props) => {
  const addPerson = props.addPerson
  const handlePersonChange = props.handlePersonChange
  const handleNumberChange = props.handleNumberChange
  const newName = props.newName
  const newNumber = props.newNumber
  return(
    <form onSubmit={addPerson}>
          <div>
            name: <input 
            type='text'
            value={newName} 
            onChange= {handlePersonChange}/>
          </div>
          <div>
            number: <input 
            type='tel'
            value={newNumber}
            onChange= {handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
  )
}

export default PersonForm