import React from 'react'
import { connect } from 'react-redux'
import random from 'lodash/random'
import times from 'lodash/times'
import {
  resetGame,
  resetStatistics,
  simulateUntil,
  setSimulationDelay,
  stopSimulation,
  lockState,
  unlockState,
  makePlay,
  updateData,
} from '../actions'
import { getFunction } from '../store/gameactions'

function pickRandom(weightedArray) {
  return weightedArray[random(0,weightedArray.length-1)]
}

function simulateInning(weightedArray, {options={}, initialGameState={}}={}) {
  let runs = 0
  let gameState = {first: false, second: false, third: false, outs: 0, ...initialGameState}
  while (gameState.outs < 3) {
    const {state, stats} = getFunction(pickRandom(weightedArray))(gameState, options)
    runs += (stats.runs || 0)
    gameState = {...gameState, ...state}
  }
  return { runs }
}

function simulateInnings(weightedArray, n, {options={}}={}) {
  let runs = 0, runCounts = {}, per9 = {}, in9 = 0, i = 9
  times(n, () => {
    i -= 1
    const r = simulateInning(weightedArray, {options}).runs
    runs += r
    in9 += r
    runCounts[r] = (runCounts[r] || 0) + 1
    if (i === 0) {
      per9[in9] = (per9[in9] || 0) + 1
      in9 = 0
      i = 9
    }
  })
  return {runs, runCounts, per9, innings: n}
}

class GameSimulator extends React.Component {

  constructor(props) {
    super(props)
    this.state = {simMode: 'game'}
  }

  resetGame = () => {
    this.quickLock()
    this.props.stopSimulation()
    this.props.resetGame()
  }

  getRandomAction = () => {
    return this.props.weightedArray[random(0,this.props.weightedArray.length-1)]
  }

  simulateBatter = () => {
    const action = this.getRandomAction()
    this.props.makePlay(action)
  }

  stopSimulation = () => {
    this.props.stopSimulation()
    this.quickLock()
  }

  quickLock = ({delay}={}) => {
    this.props.lockState()
    setTimeout(this.props.unlockState, (delay || 1.2*this.props.simDelay))
  }

  setSimDelay = evt => {
    const v = evt.target.value
    if (+v > this.props.simDelay) {
      this.props.setSimulationDelay(+v)
      this.quickLock()
    } else {
      this.quickLock()
      this.props.setSimulationDelay(+v)
    }
  }

  doAutoSim = () => {
    if (!this.props.locked) {
      if (this.props.winner && this.props.simUntil === 'eternity') {
        this.quickLock()
        this.props.resetGame()
      } else if (this.props.simUntil) {
        this.simulateBatter()
        setTimeout(this.doAutoSim, this.props.simDelay)
      }
    }
  }

  setSimMode = evt => {
    this.stopSimulation()
    this.setState({simMode: evt.target.value})
  }

  startSimulation = () => {
    const mode = this.state.simMode
    if (mode === 'batter') {
      this.simulateBatter()
    } else if (mode === 'inning') {
      this.props.simulateUntil('inning')
    } else if (mode === 'game') {
      this.props.simulateUntil('game')
    } else if (mode === 'eternity') {
      this.props.simulateUntil('eternity')
    }
  }

  simulateLots = ({n=9000}={}) => {
    const data = simulateInnings(this.props.weightedArray, n, {options: this.props.options})
    this.props.updateData(data)
  }

  componentDidUpdate() {
    this.doAutoSim()
  }

  render() {
    const disableStart = this.props.simUntil || (this.props.winner && (this.state.simMode !== 'eternity'))
    const disableStop = !this.props.simUntil
    return (
      <div className="GameSimulator">
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div>
              <label htmlFor="speed-select">Speed:</label>
              <select id="speed-select"
                value={this.props.simDelay}
                onChange={this.setSimDelay}
              >
                <option value="5">LUDICROUS</option>
                <option value="50">Faster</option>
                <option value="100">Fast</option>
                <option value="300">Medium</option>
                <option value="800">Slow</option>
              </select>
            </div>
            <div>
              <label htmlFor="mode-select">Mode:</label>
              <select id="mode-select"
                value={this.state.simMode}
                onChange={this.setSimMode}
              >
                <option value="batter">Plate Appearance</option>
                <option value="inning">Half Inning</option>
                <option value="game">Game</option>
                <option value="eternity">Forever</option>
              </select>
            </div>
            <button onClick={this.startSimulation} disabled={disableStart}>Simulate</button>
            <button onClick={this.stopSimulation} disabled={disableStop}>Stop</button>
            <button onClick={this.resetGame}>New Game</button>
            <button onClick={this.simulateLots}>+1000 Games Instantly</button>
            <button onClick={this.props.resetStatistics}>Reset Statistics</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    locked: state.locked,
    winner: state.gameState.winner,
    weightedArray: state.weightedArray,
    simDelay: state.autosimulate.delay,
    simUntil: state.autosimulate.until,
    options: state.options,
  }),
  dispatch => ({
    lockState: () => dispatch(lockState()),
    unlockState: () => dispatch(unlockState()),
    resetGame: () => dispatch(resetGame()),
    resetStatistics: () => dispatch(resetStatistics()),
    updateData: data => dispatch(updateData(data)),
    makePlay: action => dispatch(makePlay(action)),
    simulateUntil: until => dispatch(simulateUntil(until)),
    stopSimulation: () => dispatch(stopSimulation()),
    setSimulationDelay: delay => dispatch(setSimulationDelay(delay)),
  })
)(GameSimulator)