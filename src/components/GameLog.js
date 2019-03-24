import React from 'react'
import { connect } from 'react-redux'

const GameLog = props => {
  const logs = []
  for (let i = 1; i <= props.inning; i++) {
    const awaylog = props.log.away[i] || []
    const homelog = props.log.home[i] || []
    if (awaylog) {
      logs.push({label: `Top of Inning ${i}`, log: awaylog})
    }
    if (
      homelog.length
      || props.batting === 'home'
      || (!props.winner && (props.batting === 'away') && (props.outs >= 3))
    ) {
      logs.push({label: `Bottom of Inning ${i}`, log: homelog})
    }
  }
  logs.reverse()
  return (
    <div className="GameLog">
      <div>
        {logs.map((l,i) => {
          return (
            <div key={i} className="InningLog">
              <p style={{fontWeight: 'bold'}}>{l.label}</p>
              {l.log.map((x,j) => {
                return (
                  <p key={j}>{x}</p>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default connect(
  state => ({
    log: state.log,
    inning: state.gameState.inning,
    batting: state.gameState.batting,
    winner: state.gameState.winner,
    outs: state.gameState.outs,
  })
)(GameLog)
