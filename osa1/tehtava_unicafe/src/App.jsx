import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  const total = props.total
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const average = props.average / props.total
  const positive = (props.good / props.total) * 100

  if (total === 0) {
    return (
      <div>
        {"No feedback given"}
      </div>
    )
  }

  return (
    <table>
      <StatisticLine text="good " value={good}/>
      <StatisticLine text="neutral " value={neutral}/>
      <StatisticLine text="bad " value={bad}/>
      <StatisticLine text="total " value={total}/>
      <StatisticLine text="average " value={average}/>
      <StatisticLine text="positive " value={positive}/>
    </table>

  )

}

const StatisticLine = (props) => {
  const text = props.text
  const value = props.value
  if (text === "positive ") {
    return (
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value} %</td>
        </tr>
      </tbody>
    )
  }
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>

  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGood = () => {
    setTotal(total + 1)
    setGood(good + 1)
    setAverage(average + 1)
  }
  const handleNeutral = () => {
    setTotal(total + 1)
    setNeutral(neutral + 1)
  }
  const handleBad = () => {
    setTotal(total + 1)
    setBad(bad + 1)
    setAverage(average - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick ={() => handleGood()} text="good"/>
      <Button handleClick ={() => handleNeutral()} text="neutral"/>
      <Button handleClick ={() => handleBad()} text="bad"/>
      <h1>statistics</h1>
      <Statistics 
      good={good} neutral={neutral} bad={bad}
      total={total} average={average}/>


    </div>
  )
}

export default App