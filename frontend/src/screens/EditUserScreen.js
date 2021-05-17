import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { adminUpdateUser, getUserDetails } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ADMIN_USER_UPDATE_RESET } from '../constants/userConstants';

const EditUserScreen = ({ history, match }) => {
	const dispatch = useDispatch();
	const { loading, error, user } = useSelector(state => state.userDetails);
	const { userInfo } = useSelector(state => state.userLogin);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const userId = match.params.id;

	const onSubmit = e => {
		e.preventDefault();
		dispatch(adminUpdateUser({ id: userId, name, email, isAdmin }));
	};

	const { success } = useSelector(state => state.userUpdateAdmin);

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		else if (!user || !user.name || user.id !== Number(userId)) {
			dispatch({ type: ADMIN_USER_UPDATE_RESET });
			dispatch(getUserDetails(userId));
		} else {
			setName(user.name);
			setEmail(user.email);
			setIsAdmin(user.isAdmin);
		}
	}, [history, userInfo, user, dispatch, userId]);

	useEffect(() => {
		if (success) history.goBack();
	}, [success, history]);

	return (
		<div>
			<Link to='/admin/users'>
				<Button variant='light'>
					<i className='fas fa-arrow-left'></i> Go Back
				</Button>
			</Link>
			<FormContainer>
				<h1>Update user</h1>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={onSubmit}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter your name...'
								value={name}
								onChange={e => setName(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter your email address...'
								value={email}
								onChange={e => setEmail(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='password'>
							<Form.Check
								type='checkbox'
								label='Is admin?'
								checked={isAdmin}
								onChange={e => setIsAdmin(e.target.checked)}
							/>
						</Form.Group>
						<Button type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</div>
	);
};

export default EditUserScreen;
