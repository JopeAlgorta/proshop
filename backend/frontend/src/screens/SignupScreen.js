import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SignupScreen = ({ location, history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const redirect = location.search ? location.search.split('=')[1] : '';
	const dispatch = useDispatch();
	const { loading, error, userInfo } = useSelector(state => state.userSignup);

	const onSubmit = e => {
		e.preventDefault();

		if (password !== confirmPassword) setMessage("Passwords doesn't match.");
		else {
			dispatch(signup(name, email, password));
			history.push('/');
		}
	};

	useEffect(() => {
		if (userInfo) history.push(redirect);
	}, [history, userInfo, redirect]);

	return (
		<FormContainer>
			<h1>Sign up</h1>
			{error && <Message variant='danger'>{error}</Message>}
			{message && <Message variant='danger'>{message}</Message>}
			{loading && <Loader />}
			<Form onSubmit={onSubmit}>
				<Form.Group controlId='name'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						required
						type='text'
						placeholder='Enter your name...'
						value={name}
						onChange={e => setName(e.target.value)}></Form.Control>
				</Form.Group>
				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						required
						type='email'
						placeholder='Enter your email address...'
						value={email}
						onChange={e => setEmail(e.target.value)}></Form.Control>
				</Form.Group>
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						required
						type='password'
						placeholder='Enter your password...'
						value={password}
						onChange={e => setPassword(e.target.value)}></Form.Control>
				</Form.Group>
				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						required
						type='password'
						placeholder='Confirm your password...'
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Sign up
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					Already a customer?{' '}
					<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default SignupScreen;
