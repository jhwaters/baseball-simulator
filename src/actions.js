export const SINGLE = 'SINGLE'
export const DOUBLE = 'DOUBLE'
export const TRIPLE = 'TRIPLE'
export const HOME_RUN = 'HOME_RUN'
export const BASE_ON_BALLS = 'BASE_ON_BALLS'
export const BASE_ON_ERROR = 'BASE_ON_ERROR'
export const STRIKE_OUT = 'STRIKE_OUT'
export const OUT_AT_FIRST = 'OUT_AT_FIRST'
export const FOUL_OUT = 'FOUL_OUT'
export const FLY_OUT = 'FLY_OUT'
export const DOUBLE_PLAY = 'DOUBLE_PLAY'
export const DECLARE_WINNER = 'DECLARE_WINNER'
export const UPDATE_WEIGHTS = 'UPDATE_WEIGHTS'
export const SIMULATE_UNTIL = 'SIMULATE_UNTIL'
export const STOP_SIMULATION = 'STOP_SIMULATION'
export const SET_SIMULATION_DELAY = 'SET_SIMULATION_DELAY'
export const RESET_GAME = 'RESET_GAME'

export const updateWeights = weights => ({
  type: UPDATE_WEIGHTS,
  payload: weights,
})

export const simulateUntil = until => ({
  type: SIMULATE_UNTIL,
  payload: until
})

export const stopSimulation = () => ({
  type: STOP_SIMULATION,
})

export const setSimulationDelay = delay => ({
  type: SET_SIMULATION_DELAY,
  payload: delay
})

export const resetGame = () => ({
  type: RESET_GAME
})