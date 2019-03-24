import React from 'react'
import { connect } from 'react-redux'
import round from 'lodash/round'

const hits = t => (t.homeruns || 0) + (t.triples || 0) + (t.doubles || 0) + (t.singles || 0)
const tb = t => 4*(t.homeruns || 0) + 3*(t.triples || 0) + 2*(t.doubles || 0) + (t.singles || 0)
const walks = t => t.bbs || 0
const err = t => t.errors || 0
const outs = t => {
  return (
    (t.strikeouts || 0)
    + (t.outatfirsts || 0)
    + (t.flyouts || 0)
    + (t.foulouts || 0)
    + (t.doubleplays || 0)
  )
}
const ab = t => hits(t) + walks(t) + outs(t) + err(t)
const avg = t => round(hits(t) / (ab(t)-walks(t)), 3)
const obp = t => round((hits(t)+walks(t)) / ab(t), 3)
const slug = t => round(tb(t) / (ab(t)-walks(t)), 3)
const ops = t => round(obp(t) + slug(t), 3)

const GameStats = props => {
  const home = props.stats.home.total
  const away = props.stats.away.total

  const table = [
    ['Hits', ({team}) => hits(team)],
    ['Walks', ({team}) => team.bbs],
    ['Strikeouts', ({team}) => team.strikeouts],
    ['Singles', ({team}) => team.singles],
    ['Doubles', ({team}) => team.doubles],
    ['Triples', ({team}) => team.triples],
    ['Home Runs', ({team}) => team.homeruns],
    ['Reach on Error', ({team}) => team.errors],
    ['Hit into DP', ({team}) => team.doubleplays],
    ['Sac Fly', ({team}) => team.sacrifices],
    ['AVG', ({team}) => avg(team)],
    ['OBP', ({team}) => obp(team)],
    ['Slug', ({team}) => slug(team)],
    //['OPS', ({team}) => ops(team)],
  ]
  const awayProps = {team: away, other: home}
  const homeProps = {team: home, other: away}
  return (
    <div className="GameStats">
      <table style={{textAlign: 'right'}}>
        <tbody>
          <tr>
            <th>Batting Stats</th>
            <th>Visitor</th>
            <th>Home</th>
          </tr>
          {table.map(stat => {
            const [statName, statChecker] = stat
            const awayStat = statChecker(awayProps) || 0
            const homeStat = statChecker(homeProps) || 0
            return (
              <tr key={stat}>
                <td>{statName}</td>
                <td>{awayStat}</td>
                <td>{homeStat}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default connect(state => ({stats: state.stats}))(GameStats)