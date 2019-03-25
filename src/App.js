import React from 'react';
import { Provider } from 'react-redux';
import {
  Analysis,
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
          <div className="controls">
            <GameSimulator />
            <Analysis />
            <Weights />
          </div>
          <div className="simulation">
            <GameStats/>
            <div className="GameState">
              <ScoreBoard />
              <BaseRunners />
              <InningState />
            </div>
          </div>
          <div className="log">
            <GameLog />
          </div>
        </div>
      </Provider>
    )
  }
}
