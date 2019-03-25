import React from 'react'
import { connect } from 'react-redux'

const InningState = props => {
  const batting = {away: 'Visitors', home: 'Home'}[props.batting]
  return (
    <div className="InningState">
    <table>
      <tbody>
        <tr>
          <th>Batting:</th>
          <td>{batting}</td>
        </tr>
        <tr>
          <th>Outs:</th>
          <td>{props.outs}</td>
        </tr>
        <tr>
          <th>Last At Bat:</th>
          <td>{props.lastAB ? props.lastAB : '---'}</td>
        </tr>
      </tbody>
    </table>
    </div>
  )
}

export default connect(
  state => {
    const {batting, outs, inning} = state.gameState
    const inningLog = state.log[batting][inning] || []
    let lastInningLog
    if (batting === 'home') {
      lastInningLog = state.log.away[inning]
    } else if (inning > 1) {
      lastInningLog = state.log.home[inning-1]
    }
    const lastAB = inningLog.length
      ? inningLog[inningLog.length-1]
      : lastInningLog 
        ? lastInningLog[lastInningLog.length-1] + ` (end of ${batting === 'home' ? 'half' : ''} inning)` 
        : '---'
    return {batting, outs, lastAB}
  }
)(InningState)