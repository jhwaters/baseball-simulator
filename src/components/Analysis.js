import React from 'react'
import { connect } from 'react-redux'
import round from 'lodash/round'
import VegaLite from 'react-vega-lite'

class Analysis extends React.Component {
  constructor(props) {
    super(props)
    this.state = {histogram: 'per9'}
  }

  setHistogram = evt => this.setState({histogram: evt.target.value})

  render() {
    const props = this.props
    const { innings, runs, runCounts={}, per9={} } = props.data
    const runsPer9 = round(runs * 9 / innings, 3)
    const histogramData = {per9: per9, inning: runCounts}[this.state.histogram]
    const histogramValues = Object.keys(histogramData).map(k => ({runs: k, count: histogramData[k]}))
    const histogram = {
      data: {values: histogramValues},
      mark: {type: 'bar'},
      encoding: {
        x: {field: 'runs', type: 'quantitative'},
        y: {field: 'count', type: 'quantitative'},
      }
    }
    return (
      <div className="Analysis">
        <span>Cumulative statistics</span>
        <table>
          <tbody>
            <tr>
              <td>Total Innings:</td>
              <td>{innings || 0}</td>
            </tr>
            <tr>
              <td>Total Runs:</td>
              <td>{runs || 0}</td>
            </tr>
            <tr>
              <td>Runs Per 9:</td>
              <td>{runsPer9 || 0}</td>
            </tr>
          </tbody>
        </table>
        <label htmlFor="histogram-mode">Histogram:</label>
        <select id="histogram-mode"
          value={this.state.histogram}
          onChange={this.setHistogram}
        >
          <option value="inning">Single Inning</option>
          <option value="per9">9 Innings</option>
        </select>
        <div className="Histogram">
          {histogramData ? <VegaLite spec={histogram}/> : null}
        </div>
      </div>
    )
  }
}

export default connect(state => ({data: state.data}))(Analysis)