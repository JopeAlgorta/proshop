import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
	return (
		<div
			style={{
				minHeight: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
			<Spinner
				animation='border'
				role='status'
				style={{
					maxHeight: '90%',
					height: '50px',
					width: '50px',
					margin: 'auto'
				}}>
				<span className='sr-only'>Loading...</span>
			</Spinner>
		</div>
	);
};

export default Loader;
