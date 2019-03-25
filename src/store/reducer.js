import {
  MAKE_PLAY,
  UPDATE_DATA,
  RESET_GAME,
  RESET_STATISTICS,
  UPDATE_WEIGHTS,
  SIMULATE_UNTIL,
  STOP_SIMULATION,
  SET_SIMULATION_DELAY,
  LOCK_STATE,
  UNLOCK_STATE,
} from '../actions'

import {
  getFunction
} from './gameactions'

import {
  buildWeightedArray,
  applyAndCheck,
  updateData,
} from './bigmess'

import initialState from './initialState'


function reducer(state=initialState, action) {
  switch(action.type) {
    case MAKE_PLAY: return applyAndCheck(state, getFunction(action.payload))
    case RESET_STATISTICS: return {...state, data: {...initialState.data}, current9: {...initialState.current9}}
    case UNLOCK_STATE: return {...state, locked: false}
    case LOCK_STATE: return {...state, locked: true}
    case UPDATE_DATA: return {...state, data: updateData(state.data, action.payload)}
    case RESET_GAME: 
      return {
        ...state,
        gameState: initialState.gameState,
        stats: initialState.stats,
        log: initialState.log,
      }
    case UPDATE_WEIGHTS:
      return {
        ...state, 
        weights: action.payload, 
        weightedArray: buildWeightedArray(action.payload)
      }
    case STOP_SIMULATION:
      return {...state, autosimulate: {...state.autosimulate, until: false}}
    case SIMULATE_UNTIL:
      return {...state, autosimulate: {...state.autosimulate, until: action.payload}}
    case SET_SIMULATION_DELAY:
      return {...state, autosimulate: {...state.autosimulate, delay: action.payload}}
    default: return state
  }
}

export default reducer