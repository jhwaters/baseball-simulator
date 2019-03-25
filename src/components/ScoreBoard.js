import React from 'react'
import { connect } from 'react-redux'
import times from 'lodash/times'

const ScoreBoard = props => {
  const isActive = (t, i) => {
    if ((t === props.active.batting) && (i === +props.active.inning)) {
      return 'Active'
    }
  }
  return (
    <div className="ScoreBoard">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Total</th>
            {props.header.map(i => <th key={i}>{i}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="Away">Visitor</th>
            <th>{props.awayTotal || 0}</th>
            {props.away.map((runs, i) => <td key={i} className={isActive('away', i+1)}>{runs}</td>)}
          </tr>
          <tr>
            <th className="Home">Home</th>
            <th>{props.homeTotal || 0}</th>
            {props.home.map((runs, i) => <td key={i} className={isActive('home', i+1)}>{runs}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function getScores(state) {
  const {inning, batting, outs, winner} = state.gameState
  const {home, away} = state.stats
  let header = [], awayScores = [], homeScores = []
  let awayTotal = 0, homeTotal = 0
  times(inning, j => {
    const i = j + 1
    header.push(i)
    const awayScore = (away[i] || {}).runs || 0
    const homeScore = (home[i] || {}).runs || 0
    awayTotal += awayScore
    awayScores.push(awayScore)
    homeTotal += homeScore
    if (i < +inning || batting === 'home') {
      homeScores.push(homeScore)
    } else {
      homeScores.push(' ')
    }
  })
  return {
    header, 
    awayTotal, 
    homeTotal,
    winner,
    active: {batting, inning: winner ? inning + 1 : inning},
    away: awayScores, 
    home: homeScores,
  }
}

export default connect(getScores)(ScoreBoard)