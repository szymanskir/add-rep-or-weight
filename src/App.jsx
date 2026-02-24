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

function Scenarios({ weight, reps, increments, formula }) {
  const scenarios = []

  // 1. Add 1 rep to the current weight
  const formulaMap = {
    epley: epley1RM,
    brzycki: function(brWeight, brReps){
      if (brReps <= 0) return 0
      return Math.round(brWeight * (36 / (37 - brReps)))
    },
    lander: function(laWeight, laReps){
      if (laReps <= 0) return 0
      return Math.round(laWeight * (100 / (101.3 - 2.67123 * laReps)))
    }
  }

  const compute1RM = (w, r) => {
    const fn = formulaMap[formula] || epley1RM
    return fn(w, r)
  }

  scenarios.push({
    totalWeight: weight,
    totalReps: reps + 1,
    est1RM: compute1RM(weight, reps + 1),
    operation: '+1 rep'
  })

  // 2. Keep same reps with different increments
  increments.forEach(inc => {
    scenarios.push({
      totalWeight: weight + inc,
      totalReps: reps,
      est1RM: compute1RM(weight + inc, reps),
      operation: `+${inc} kg`
    })
  })

  scenarios.sort((a,b) => a.est1RM - b.est1RM)

  // Calculate max reps for padding
  const maxReps = Math.max(...scenarios.map(s => s.totalReps))
  const repsDigits = maxReps.toString().length

  return (
    <div className="scenarios">
      <h2>Scenarios</h2>
      <table className="scenarios-table">
        <thead>
          <tr>
            <th>Reps × Weight</th>
            <th>Est 1RM</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => (
            <tr key={i}>
              <td className="weight-col"><span className="padded-reps">{s.totalReps.toString().padStart(repsDigits, ' ')}</span> x {s.totalWeight} kg</td>
              <td className="onerm-col">{s.est1RM} kg</td>
              <td className="operation-col">{s.operation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App(){
  const [weight, setWeight] = useState(100)
  const [reps, setReps] = useState(5)
  const [selectedIncrements, setSelectedIncrements] = useState(DEFAULT_INCREMENTS)
  const [formula, setFormula] = useState('epley')

  const toggleIncrement = (value) => {
    setSelectedIncrements(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value].sort((a, b) => a - b)
    )
  }

  return (
    <div className="container">
      <h1>Add Rep or Weight</h1>

      <div className="controls">
        <label>
          Current weight (kg)
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} step="any" />
        </label>

        <label>
          Reps
          <input type="number" value={reps} onChange={e => setReps(parseInt(e.target.value) || 0)} />
        </label>
      </div>

      <div className="increments-selector">
        <label>Weight Increments</label>
        <div style={{height:12}} />
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

        <div style={{marginBottom:24}}>
          <label className="formula-label">1RM Formula</label>
          <div className="formula-group">
            <button
              type="button"
              className={`seg-btn ${formula === 'epley' ? 'active' : ''}`}
              onClick={() => setFormula('epley')}
            >
              Epley
            </button>
            <button
              type="button"
              className={`seg-btn ${formula === 'brzycki' ? 'active' : ''}`}
              onClick={() => setFormula('brzycki')}
            >
              Brzycki
            </button>
            <button
              type="button"
              className={`seg-btn ${formula === 'lander' ? 'active' : ''}`}
              onClick={() => setFormula('lander')}
            >
              Lander
            </button>
          
          </div>
        </div>

      <Scenarios weight={weight} reps={reps} increments={selectedIncrements} formula={formula} />
    </div>
  )
}
