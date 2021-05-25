import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const SearchBox = () => {
	let history = useHistory();
	const [keyword, setKeyword] = useState('');

	const onSubmit = e => {
		e.preventDefault();
		if (keyword) history.push(`/?keyword=${keyword}&page=1`);
		else history.push(history.location.pathname);
	};

	return (
		<Form onSubmit={onSubmit} inline>
			<Form.Control
				type='text'
				name='q'
				onChange={e => setKeyword(e.target.value)}
				className='mr-sm-2 ml-sm-5'></Form.Control>
			<Button type='submit' variant='outline-success' className='p-2'>
				Submit
			</Button>
		</Form>
	);
};

export default SearchBox;
