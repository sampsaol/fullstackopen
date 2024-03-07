const Filter = (props) => {
  const newFilter = props.newFilter
  const handleFilterChange = props.handleFilterChange
  return (
    <div>
    filter shown with<input
    type='text'
    value={newFilter}
    onChange={handleFilterChange}/>
    </div>
  )

}

export default Filter