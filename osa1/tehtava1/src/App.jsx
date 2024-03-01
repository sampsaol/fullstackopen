
const Header = (props) => {
  console.log(props)
  return(
    <div>
      <h1>{props.coursename.name}</h1>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return(
    <div>
      <Part part={props.part.parts[0].name} exercise={props.part.parts[0].exercises}/>
      <Part part={props.part.parts[1].name} exercise={props.part.parts[1].exercises}/>
      <Part part={props.part.parts[2].name} exercise={props.part.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  return(
    <div>
      <p>Number of exercises {props.sum.parts[0].exercises + props.sum.parts[1].exercises + props.sum.parts[2].exercises}</p>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return(
    <div>
      <p>{props.part} {props.exercise}</p>
      </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header coursename={course} />
      <Content part={course}/>
      <Total sum={course}/>
    </div>
  )
}



export default App