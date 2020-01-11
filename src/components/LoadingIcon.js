import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadingIcon = (props) => (
  <div style={displayWaitingIconStyle}>
  <FontAwesomeIcon icon="sync" spin={true} size="6x" className={props.textColor}/>
</div>
)

export default LoadingIcon
const displayWaitingIconStyle = {
  display:'flex',
  flexDirection:'column', 
  alignItems:'center', 
  justifyContent:'center', 
  minHeight:'100vh',
  color:'rgba(255,255,255,.75)'
}