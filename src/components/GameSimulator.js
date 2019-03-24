import React from 'react'
import { connect } from 'react-redux'
import random from 'lodash/random'
import {
  resetGame,
  simulateUntil,
  setSimulationDelay,
  stopSimulation,
} from '../actions'



class GameSimulator extends React.Component {

  resetGame = () => {
    if (this.props.simUntil) {
      this.props.stopSimulation()
      setTimeout(this.props.resetGame, this.props.simDelay)
    } else {
      this.props.resetGame()
    }
  }

  getRandomAction = () => {
    return this.props.weightedArray[random(0,this.props.weightedArray.length-1)]
  }

  simulateAtBat = () => {
    const action = this.getRandomAction()
    this.props.dispatchAction(action)
  }

  setSimDelay = evt => {
    this.props.setSimulationDelay(+evt.target.value)
  }

  doAutoSim = () => {
    if (this.props.simUntil) {
      this.simulateAtBat()
      setTimeout(this.doAutoSim, this.props.simDelay)
    }
  }

  componentDidUpdate() {
    this.doAutoSim()
  }

  render() {
    const winner = this.props.winner ? true : false
    return (
      <div className="GameSimulator">
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <button onClick={this.resetGame}
            >New Game</button>
            <button onClick={this.simulateAtBat}
              disabled={winner}
            >Simulate At-Bat</button>
            <button onClick={this.props.simulateInning}
              disabled={winner}
            >Simulate Inning</button>
            <button onClick={this.props.simulateGame}
              disabled={winner}
            >Simulate Game</button>
            <button onClick={this.props.stopSimulation}
            >Stop Simulation</button>
            <div style={{margin: '.5em 0'}}>
              <label htmlFor="speed-select">Speed:</label>
              <select id="speed-select"
                value={this.props.simDelay}
                onChange={this.setSimDelay}
              >
                <option value="10">faster</option>
                <option value="100">fast</option>
                <option value="300">medium</option>
                <option value="800">slow</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    winner: state.gameState.winner,
    weightedArray: state.weightedArray,
    simDelay: state.autosimulate.delay,
    simUntil: state.autosimulate.until,
  }),
  dispatch => ({
    resetGame: () => dispatch(resetGame()),
    dispatchAction: action => dispatch({type: action}),
    simulateInning: () => dispatch(simulateUntil('inning')),
    simulateGame: () => dispatch(simulateUntil('game')),
    stopSimulation: () => dispatch(stopSimulation()),
    setSimulationDelay: delay => dispatch(setSimulationDelay(delay)),
  })
)(GameSimulator)