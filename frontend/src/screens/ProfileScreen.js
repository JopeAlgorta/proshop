import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../actions/orderActions';
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
	const { orders, loading: loadingOrders, error: ordersError } = useSelector(state => state.orderList);

	useEffect(() => {
		if (!userInfo) history.push('/login');
		else if (!user || !user.name || user.id !== userInfo.id || success) {
			dispatch({ type: USER_UPDATE_RESET });
			dispatch(getUserDetails());
			dispatch(getOrders());
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
				{loadingOrders ? (
					<Loader />
				) : ordersError ? (
					<Message variant='danger'>{ordersError}</Message>
				) : (
					<Table striped responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>Date</th>
								<th>Total</th>
								<th>Paid</th>
								<th>Delivered</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(o => (
								<tr key={o.id}>
									<Link to={`/order/${o.id}`}>
										<td>{o.id}</td>
									</Link>
									<td>{new Date(o.createdAt).toDateString()}</td>
									<td>$ {o.totalPrice}</td>
									{o.isPaid ? (
										<td style={{ color: 'green' }}>
											{' '}
											<i className='fas fa-check'></i>{' '}
										</td>
									) : (
										<td style={{ color: 'red' }}> &#10008; </td>
									)}
									{o.isDelivered ? (
										<td style={{ color: 'green' }}>
											{' '}
											<i className='fas fa-check'></i>{' '}
										</td>
									) : (
										<td style={{ color: 'red' }}> &#10008; </td>
									)}
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	);
};

export default ProfileScreen;
