import React from 'react';
import { Provider } from 'react-redux';
import {
  BaseRunners,
  GameLog,
  GameSimulator,
  GameStats,
  InningState,
  ScoreBoard,
  Weights,
} from './components'
import store from './store'


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div className="GameState">
            <ScoreBoard />
            <InningState />
            <BaseRunners />
            <GameStats />
          </div>
          <div className="Controls">
            <GameSimulator />
            <Weights />
          </div>
          <GameLog />
        </div>
      </Provider>
    )
  }
}
