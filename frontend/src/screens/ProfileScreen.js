import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const dispatch = useDispatch();
	const { loading, error, user } = useSelector(state => state.userDetails);
	const { userInfo } = useSelector(state => state.userLogin);

	const onSubmit = e => {
		e.preventDefault();

		if (password !== confirmPassword) setMessage("Passwords doesn't match.");
		else {
			dispatch(updateUser({ name, email, password }));
			setMessage('');
		}
	};

	const { success } = useSelector(state => state.userUpdate);

	useEffect(() => {
		if (!userInfo) history.push('/login');
		else if (!user || !user.name || success) {
			dispatch({ type: USER_UPDATE_RESET });
			dispatch(getUserDetails());
		} else {
			setName(user.name);
			setEmail(user.email);
		}
	}, [history, userInfo, user, dispatch, success]);

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
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
							type='password'
							placeholder='Enter your password...'
							value={password}
							onChange={e => setPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm your password...'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Button type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
			</Col>
		</Row>
	);
};

export default ProfileScreen;
