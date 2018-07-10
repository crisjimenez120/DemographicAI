import React from 'react';
import Tilt from 'react-tilt';
import wisdom from './wisdom.png'

import './Logo.css'
const Logo = () => {
	return(
		<div className='ma4 mt0'>
			<Tilt className = "Tilt b2 shadow-2" options={{max: 25}} style ={{height:150, width: 150}}>
				<div className = "Tilt-inner pa3"><img  style={{paddingTop: '3px'}}alt = 'logo' src={wisdom}/></div>
			</Tilt>
		</div>

	);
}

export default Logo;