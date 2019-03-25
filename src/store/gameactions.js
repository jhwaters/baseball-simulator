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
} from '../actions'

export function getFunction(type) {
  switch(type) {
    case SINGLE: return single
    case DOUBLE: return double
    case TRIPLE: return triple
    case HOME_RUN: return homerun
    case BASE_ON_BALLS: return baseonballs
    case BASE_ON_ERROR: return baseonerror
    case STRIKE_OUT: return strikeout
    case OUT_AT_FIRST: return outatfirst
    case FOUL_OUT: return foulout
    case FLY_OUT: return flyout
    case DOUBLE_PLAY: return doubleplay
    default: return () => null
  }
}

export function single(state, options) {
  let first = true, second = false, third = false, runs = 0
  if (state.third) {
    runs += 1
  }
  if (state.second) {
    if (options.scoreFromSecondOnSingle || options.firstToThirdOnSingle) {
      runs += 1
    } else {
      third = true
    }
  }
  if (state.first) {
    if (options.firstToThirdOnSingle) {
      third = true
    } else {
      second = true
    }
  }
  return {
    state: {first, second, third}, 
    stats: {runs, hits: 1, singles: 1},
    log: 'single',
  }
}

export function double(state, options) {
  let first = false, second = true, third = false, runs = 0
  if (state.third) {
    runs += 1
  }
  if (state.second) {
    runs += 1
  }
  if (state.first) {
    if (options.scoreFromFirstOnDouble) {
      runs += 1
    } else {
      third = true
    }
  }
  return {
    state: {first, second, third},
    stats: {runs, hits: 1, doubles: 1},
    log: 'double'
  }
}

export function triple(state) {
  let first = false, second = false, third = true, runs = 0
  if (state.third) {
    runs += 1
  }
  if (state.second) {
    runs += 1
  }
  if (state.first) {
    runs += 1
  }
  return {
    state: {first, second, third},
    stats: {runs, hits: 1, triples: 1},
    log: 'triple',
  }
}

export function homerun(state) {
  let runs = 1
  if (state.first) { runs += 1 }
  if (state.second) { runs += 1 }
  if (state.third) { runs += 1 }
  return {
    state: {first: false, second: false, third: false},
    stats: {runs, hits: 1, homeruns: 1},
    log: 'home run',
  }
}

export function baseonballs(state) {
  const first = true
  let {second, third} = state
  let runs = 0
  if (state.first) {
    second = true
    if (state.second) {
      third = true
      if (state.third) {
        runs += 1
      }
    }
  }
  return {
    state: {first, second, third},
    stats: {runs, bbs: 1},
    log: 'walk',
  }
}

export function baseonerror(state, options) {
  const s = single(state, options)
  return {
    state: s.state,
    stats: {runs: s.stats.runs, errors: 1},
    log: 'reach on error',
  }
}

export function strikeout(state) {
  return {
    state: {outs: state.outs + 1},
    stats: {strikeouts: 1},
    log: 'strike out',
  }
}

export function outatfirst(state) {
  return {
    state: {outs: state.outs + 1},
    stats: {outatfirsts: 1},
    log: 'out at first',
  }
}

export function foulout(state) {
  return {
    state: {outs: state.outs + 1},
    stats: {foulouts: 1},
    log: 'foul out',
  }
}

export function flyout(state, options) {
  let runs = 0
  let {first, second, third} = state
  if (options.scoreFromThirdOnFlyOut) {
    if (third && state.outs < 2) {
      runs += 1
      third = false
    }
  }
  let stats = {runs, flyouts: 1}
  if (runs) {
    stats.sacrifices = 1
  }
  return {
    state: {outs: state.outs + 1, first, second, third},
    stats,
    log: 'fly out',
  }
}

export function doubleplay(state) {
  // assume the outs are always the leading base runner and the batter
  if (state.outs > 1) {
    return outatfirst(state)
  }
  if (!state.first && !state.second && !state.third) {
    return outatfirst(state)
  }
  let {first, second, third} = state
  if (third) {
    third = false
  } else if (second) {
    second = false
  } else if (first) {
    first = false
  }
  return {
    state: {first, second, third, outs: state.outs + 2},
    stats: {doubleplays: 1},
    log: 'double play',
  }
}
