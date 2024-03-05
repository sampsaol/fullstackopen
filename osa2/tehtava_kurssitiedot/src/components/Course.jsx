const Course = ({course}) => {
  const initialValue = 0
  const totalList = course.parts.map(part => part.exercises)
  const total = totalList.reduce(
    (accumulator, currentValue) => accumulator + currentValue, initialValue)
  return (
    <div>
      <ul>
        <h2>{course.name}</h2>
        {course.parts.map(part =>
          <li key={part.id}>
            {[part.name, part.exercises].join(" ")}
          </li>
        )}
        <li>
          <b>
            total of {total} exercises
          </b>
        </li>

      </ul>
    </div>
  )
}

export default Course