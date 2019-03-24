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
      </tbody>
    </table>
    </div>
  )
}

export default connect(
  state => {
    const {batting, outs} = state.gameState
    return {batting, outs}
  }
)(InningState)