import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { getUsers } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const { users, loading, error } = useSelector(state => state.userList);
	const { userInfo } = useSelector(state => state.userLogin);

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		dispatch(getUsers());
	}, [dispatch, userInfo, history]);

	const onDelete = id => {};

	return (
		<div>
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message varinat='danger'>{error}</Message>
			) : (
				<Table stripped responsive bordered hover classname='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th className='text-center'>Admin</th>
							<th className='text-center'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map(u => (
							<tr key={u.id}>
								<td>{u.id}</td>
								<td>{u.name}</td>
								<td>{u.email}</td>
								{u.isAdmin ? (
									<td className='text-center' style={{ color: 'green' }}>
										{' '}
										<i className='fas fa-check'></i>{' '}
									</td>
								) : (
									<td className='text-center' style={{ color: 'red' }}>
										{' '}
										&#10008;{' '}
									</td>
								)}
								<td className='text-center'>
									<LinkContainer to={`/admin/user/${u.id}`}>
										<Button variant='info' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button variant='danger' className='btn-sm' onClick={e => onDelete(u.id)}>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	);
};

export default UserListScreen;
