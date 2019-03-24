import React from 'react'
import { connect } from 'react-redux'

const BaseRunners = props => {
  const classNames = ['Bases', {home: 'Home', away: 'Away'}[props.batting]]
  return (
    <div className="BaseRunners">
      <svg viewBox="0 0 100 100" width="2cm">
        <g className={classNames.join(' ')} transform="rotate(-45,50,50)">
          <rect x="55" y="55" width="30" height="30" 
            className={props.first ? "HasRunner" : undefined}/>
          <rect x="55" y="15" width="30" height="30" 
            className={props.second ? "HasRunner" : undefined}/>
          <rect x="15" y="15" width="30" height="30" 
            className={props.third ? "HasRunner" : undefined}/>
        </g>
      </svg>
    </div>
  )
}

export default connect(
  state => {
    const {batting, first, second, third} = state.gameState
    return {batting, first, second, third}
  }
)(BaseRunners)