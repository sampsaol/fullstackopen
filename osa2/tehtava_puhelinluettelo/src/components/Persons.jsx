const Persons = (props) => {
  const persons = props.persons
  const filter = props.newFilter
  const allFilters = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
  const removeButton = props.removeButton

  if (filter === '') {
    return (
      <div>
        {persons.map(person => 
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => removeButton(person.id, person.name)}>delete</button>
          </li>)}
      </div>
    )
  }
  return (
    <div>
      {allFilters.map(person => 
          <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removeButton(person.id, person.name)}>delete</button>
        </li>)}
    </div>
  )

}

export default Persons