import React from 'react';
import './DemographicTable.css'

const DemographicTable = ({demographicTable}) => {
	return(
		<div className='table'>
			<div className =' f4 gray'>
				<h2>DemographicTable</h2>
				<p>{'Age:'}</p>
				<p> {demographicTable.age} </p>
				<p>{'Gender:'}</p>
				<p> {demographicTable.gender} </p>
				<p>{'Ethnicity:'}</p>
				<p> {demographicTable.culture} </p>
			</div>
			
		</div>

	);
}

export default DemographicTable;