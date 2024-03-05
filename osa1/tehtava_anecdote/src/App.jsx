import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Display = (props) => {
  return (
    <div>
      {props.value}
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const help = new Uint8Array(anecdotes.length)
  const [votes, setVotes] = useState(help)

  const [most, setMost] = useState(0)

  const [selected, setSelected] = useState(0)

  const getRandom = (max) => {
    return Math.floor(Math.random() * max)
  }

  const setNumber = () => {
    const number = getRandom(anecdotes.length)
    setSelected(number)

  }

  const addVote = (props) => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    if (copy[selected] > copy[most]) {
      setMost(selected)
    }
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Display value={anecdotes[selected]}/>
      <Display value={"has " + String(votes[selected]) + " votes"}/>
      <Button handleClick={() => setNumber()} text="next anecdote"/>
      <Button handleClick={() => addVote(selected)} text="vote"/>
      <h1>Anecdote with most votes</h1>
      <Display value={anecdotes[most]}/>
      <Display value={"has " + String(votes[most]) + " votes"}/>
    </div>
  )
}

export default App