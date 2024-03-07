const Person = ({ person }) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

const Persons = (props) => {
  const persons = props.persons
  const filter = props.newFilter
  const allFilters = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  if (filter === '') {
    return (
      <div>
        {persons.map(person => 
          <Person key={person.name} person={person}/>)}
      </div>
    )
  }
  return (
    <div>
      {allFilters.map(person => 
          <Person key={person.name} person={person}/>)}
    </div>
  )

}

export default Persons