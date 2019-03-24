import {
  SINGLE,
  DOUBLE,
  TRIPLE,
  HOME_RUN,
  BASE_ON_BALLS,
  BASE_ON_ERROR,
  STRIKE_OUT,
  OUT_AT_FIRST,
  FOUL_OUT,
  FLY_OUT,
  DOUBLE_PLAY,
  DECLARE_WINNER,
  RESET_GAME,
  UPDATE_WEIGHTS,
  SIMULATE_UNTIL,
  STOP_SIMULATION,
  SET_SIMULATION_DELAY,
} from '../actions'

import {
  single,
  double,
  triple,
  homerun,
  baseonballs,
  baseonerror,
  strikeout,
  flyout,
  foulout,
  outatfirst,
  doubleplay,
} from './gameactions'

import {
  buildWeightedArray,
  applyAndCheck,
} from './bigmess'

import initialState from './initialState'


function reducer(state=initialState, action) {
  switch(action.type) {
    case SINGLE: return applyAndCheck(state, single, 'single')
    case DOUBLE: return applyAndCheck(state, double, 'double')
    case TRIPLE: return applyAndCheck(state, triple, 'triple')
    case HOME_RUN: return applyAndCheck(state, homerun, 'home run')
    case BASE_ON_BALLS: return applyAndCheck(state, baseonballs, 'base on balls')
    case BASE_ON_ERROR: return applyAndCheck(state, baseonerror, 'base on error')
    case STRIKE_OUT: return applyAndCheck(state, strikeout, 'strike out')
    case OUT_AT_FIRST: return applyAndCheck(state, outatfirst, 'out at first')
    case FOUL_OUT: return applyAndCheck(state, foulout, 'foul out')
    case FLY_OUT: return applyAndCheck(state, flyout, 'fly out')
    case DOUBLE_PLAY: return applyAndCheck(state, doubleplay, 'double play')
    case DECLARE_WINNER: return {...state, gameState: {...state.gameState, winner: action.payload}}
    case RESET_GAME: return {
      ...state,
      gameState: initialState.gameState,
      stats: initialState.stats,
      log: initialState.log,
      autosimulate: {...state.autosimulate, until: false},
    }
    case UPDATE_WEIGHTS: return {
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