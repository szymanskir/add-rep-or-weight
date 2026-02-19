import React, { useState } from 'react'

const ALL_INCREMENTS = [
  { value: 0.25, label: '0.25 kg' },
  { value: 0.5, label: '0.5 kg' },
  { value: 1, label: '1 kg' },
  { value: 1.25, label: '1.25 kg' },
  { value: 2.5, label: '2.5 kg' },
  { value: 5, label: '5 kg' },
  { value: 10, label: '10 kg' },
  { value: 15, label: '15 kg' },
  { value: 20, label: '20 kg' },
  { value: 25, label: '25 kg' }
]

const DEFAULT_INCREMENTS = [1.25, 2.5, 5, 10]

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
  const [selectedIncrements, setSelectedIncrements] = useState(DEFAULT_INCREMENTS)

  const toggleIncrement = (value) => {
    setSelectedIncrements(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value].sort((a, b) => a - b)
    )
  }

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
      </div>

      <div className="increments-selector">
        <label>Weight Increments</label>
        <div className="checkbox-group">
          {ALL_INCREMENTS.map(inc => (
            <label key={inc.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedIncrements.includes(inc.value)}
                onChange={() => toggleIncrement(inc.value)}
              />
              {inc.label}
            </label>
          ))}
        </div>
      </div>

      <Scenarios weight={weight} reps={reps} increments={selectedIncrements} />
    </div>
  )
}
