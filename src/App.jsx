import React, { useState } from 'react'

function epley1RM(weight, reps) {
  if (reps <= 0) return 0
  return Math.round(weight * (1 + reps / 30))
}

function Scenarios({ weight, reps, increments }) {
  const scenarios = []

  // 1. Add 1 rep to the current weight
  scenarios.push({
    title: `+1 rep (same weight ${weight} kg)` ,
    weight: weight,
    reps: reps + 1,
    est1RM: epley1RM(weight, reps + 1)
  })

  // 2. Keep same reps with different increments
  increments.forEach(inc => {
    scenarios.push({
      title: `+${inc} kg (same reps ${reps})`,
      weight: weight + inc,
      reps: reps,
      est1RM: epley1RM(weight + inc, reps)
    })
  })

  scenarios.sort((a,b) => a.est1RM - b.est1RM)

  return (
    <div className="scenarios">
      <h2>Scenarios</h2>
      <ul>
        {scenarios.map((s, i) => (
          <li key={i}>
            <strong>{s.title}</strong> — est 1RM: {s.est1RM} kg
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App(){
  const [weight, setWeight] = useState(100)
  const [reps, setReps] = useState(5)
  const [incStr, setIncStr] = useState('1,2.5,5')

  const increments = incStr.split(',').map(s => parseFloat(s)).filter(n => !isNaN(n))

  return (
    <div className="container">
      <h1>Gym Decision Helper</h1>

      <div className="controls">
        <label>
          Current weight (kg)
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
        </label>

        <label>
          Reps
          <input type="number" value={reps} onChange={e => setReps(parseInt(e.target.value) || 0)} />
        </label>

        <label>
          Increments (comma separated kg)
          <input value={incStr} onChange={e => setIncStr(e.target.value)} />
        </label>
      </div>

      <Scenarios weight={weight} reps={reps} increments={increments} />
    </div>
  )
}
