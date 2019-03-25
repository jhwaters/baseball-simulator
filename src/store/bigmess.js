import times from 'lodash/times'

export function updateGameState(old, updated) {
  return {...old, ...updated}
}

export function updateStats(old, updates) {
  const result = {...old}
  for (const k in updates) {
    if (result[k] === undefined) {
      result[k] = 0
    }
    result[k] += updates[k]
  }
  return result
}

export function checkForWin(gameState) {
  const { inning, batting, homescore, awayscore, outs } = gameState
  if (inning < 9) {
    return false
  }
  if (homescore === awayscore) {
    return false
  }
  if (homescore > awayscore) {
    if (batting === 'home' || (batting === 'away' && outs >= 3)) {
      return 'home'
    }
  }
  if (awayscore > homescore) {
    if (batting === 'home' && outs >= 3) {
      return 'away'
    }
  }
}

export function checkForInning(gameState) {
  if (gameState.outs >= 3) {
    return true
  }
  return false
}

export function nextInning(state) {
  if (state.batting === 'away') {
    return {...state, batting: 'home', first: false, second: false, third: false, outs: 0}
  } else if (state.batting === 'home') {
    return {...state, inning: state.inning + 1, batting: 'away', first: false, second: false, third: false, outs: 0}
  }
}

export function buildWeightedArray(weights) {
  const result = []
  for (const k in weights) {
    times(weights[k], () => result.push(k))
  }
  return result
}

function applyUpdates(state, updates={}) {
  const {stats={}, log} = updates
  const {batting, inning} = state.gameState
  let gameState = updateGameState(state.gameState, updates.state)
  const teamStats = state.stats[batting].total
  const currentInningStats = (state.stats[batting] || {})[inning] || {}
  if (stats.runs) {
    if (batting === 'away') {
      gameState.awayscore += stats.runs
    }
    if (batting === 'home') {
      gameState.homescore += stats.runs
    }
  }
  const winner = checkForWin(gameState)
  if (winner) {
    gameState.winner = winner
  }
  let result = {
    ...state,
    gameState,
    stats: {
      ...state.stats,
      [batting]: {
        ...state.stats[batting],
        total: updateStats(teamStats, stats),
        [inning]: updateStats(currentInningStats, stats)
      }
    },
    log: {
      away: {...state.log.away},
      home: {...state.log.home},
    }
  }
  if (!result.log[batting][inning]) {
    result.log[batting][inning] = []
  }
  if (log) {
    let tolog = log
    if (stats.runs) {
      if (stats.runs === 1) {
        tolog += ` (1 run`
      } else {
        tolog += ` (${stats.runs} runs`
      }
      tolog += `, ${gameState.awayscore}-${gameState.homescore})`
    }
    console.log(tolog)
    result.log[batting][inning].push(tolog)
  }
  return result
}

function applyFunction(state, f) {
  if (state.gameState.winner) {
    return state
  }
  const updates = f(state.gameState, state.options)
  return applyUpdates(state, updates)
}

function advanceInning(state) {
  let {batting, inning} = state.gameState

  if (batting === 'away') {
    batting = 'home'
  } else if (batting === 'home') {
    batting = 'away'
    inning += 1
  }
  return {
    ...state,
    gameState: {
      ...state.gameState,
      batting,
      inning,
      first: false,
      second: false,
      third: false,
      outs: 0
    }
  }
}

function updateCounter(old={}, updates={}) {
  let result = {...old}
  for (const k in updates) {
    result[k] = (result[k] || 0) + updates[k]
  }
  return result
}

export function updateData(data, {runs=0, innings=0, runCounts={}, per9={}}) {
  return {
    ...data,
    innings: data.innings + innings,
    runs: data.runs + runs,
    runCounts: updateCounter(data.runCounts, runCounts),
    per9: updateCounter(data.per9, per9)
  }
}

function updateDataFromInning(state) {
  const runs = state.stats[state.gameState.batting][state.gameState.inning].runs || 0
  let current9 = {...state.current9}
  let per9
  current9.innings += 1
  current9.runs += runs
  if (current9.innings === 9) {
    per9 = {[current9.runs]: 1}
    current9 = {innings: 0, runs: 0}
  }
  return {
    ...state,
    data: updateData(state.data, {runs, innings: 1, runCounts: {[runs]: 1}, per9}),
    current9
  }
}

export function applyAndCheck(state, f) {
  if (!state.locked && !state.gameState.winner) {
    let result = applyFunction(state, f)
    if (result.gameState.outs >= 3 && (
      // don't use home innings after 8th
      (state.gameState.inning < 9) || (state.gameState.batting === 'away')
    )) {
      result = updateDataFromInning(result)
    }
    if (result.gameState.winner) {
      console.log('end of game; ' + result.gameState.winner + ' wins')
      if (result.autosimulate.until === 'inning' || result.autosimulate.until === 'game') {
        result.autosimulate = {...result.autosimulate, until: false}
      }
      return result
    }
    if (checkForInning(result.gameState)) {
      result = advanceInning(result)
      console.log(`${result.gameState.batting} batting in inning ${result.gameState.inning}`)
      if (result.autosimulate.until === 'inning') {
        result.autosimulate = {...result.autosimulate, until: false}
      }
    }
    return result
  }
  return state
}
