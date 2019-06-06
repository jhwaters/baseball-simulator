import React from 'react';
import { connect } from 'react-redux';
import { updateWeights, gameActionList } from '../actions';
import round from 'lodash/round'

class Weights extends React.Component {
  updateWeight = k => {
    return evt => this.props.updateWeights({...this.props.weights, [k]: +evt.target.value})
  }

  render() {
    let total = 0
    for (const k in this.props.weights) {
      total += +this.props.weights[k]
    }
    const actions = [

    ]
    return (
      <div className="Weights">
        <table>
          <thead>
            <tr>
            <th>Outcome</th><th>Relative Probability</th>
            </tr>
          </thead>
          <tbody>
            {gameActionList.map(k => {
              return (
                <tr key={k}>
                  <td>{k}</td>
                  <td>
                    <input type="number" 
                      min={0}
                      value={this.props.weights[k]} 
                      onChange={this.updateWeight(k)}/>
                  </td>
                  <td>
                    {`${round(100 * this.props.weights[k] / total, 1)}%`}
                  </td>
                </tr>
              )
            })}
            <tr><th>Total:</th><td>{total}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(
  state => ({weights: state.weights}),
  dispatch => ({updateWeights: weights => dispatch(updateWeights(weights))}),
)(Weights)