import { buildWeightedArray } from './bigmess'

const gameState = {
  homescore: 0,
  awayscore: 0,
  inning: 1,
  batting: 'away',
  first: false,
  second: false,
  third: false,
  outs: 0,
  winner: null,
}
const stats = {
  away: {total: {}},
  home: {total: {}},
}
const log = {
  away: {},
  home: {},
}
const options = {
  scoreFromSecondOnSingle: true,
  scoreFromThirdOnFlyOut: true,
  scoreFromFirstOnDouble: false,
  firstToThirdOnSingle: false,
}
const weights = {
  SINGLE: 3,
  DOUBLE: 1,
  TRIPLE: 1,
  HOME_RUN: 1,
  BASE_ON_BALLS: 1,
  BASE_ON_ERROR: 1,
  STRIKE_OUT: 4,
  OUT_AT_FIRST: 4,
  FOUL_OUT: 1,
  FLY_OUT: 3,
  DOUBLE_PLAY: 1,
}
const weightedArray = buildWeightedArray(weights)
const autosimulate = {
  until: false,
  delay: 10,
}

const initialState = {
  gameState,
  stats,
  log,
  options,
  weights,
  weightedArray,
  autosimulate,
}

export default initialState