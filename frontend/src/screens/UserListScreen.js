import React, { Fragment, useEffect, useState } from 'react';
import { Button, Modal, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteUser, getUsers } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const UserListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const { users, loading, error, pages, page } = useSelector(state => state.userList);
	const { userInfo } = useSelector(state => state.userLogin);
	const { success } = useSelector(state => state.userDelete);

	const [modal, setModal] = useState({ show: false, id: '' });

	let keyword = history.location.search;

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		dispatch(getUsers(keyword));
	}, [dispatch, userInfo, history, success, keyword]);

	const onDeleteConfirm = () => {
		dispatch(deleteUser(modal.id));
		setModal({ id: '', show: false });
	};

	return (
		<div>
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Fragment>
					<Table responsive bordered hover className='table-sm'>
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
										<Button
											variant='danger'
											className='btn-sm'
											onClick={e => setModal({ show: true, id: u.id })}>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Row className='justify-content-center'>
						<Paginate pages={pages} page={page} isAdmin entity='users' />
					</Row>
				</Fragment>
			)}
			<Modal show={modal.show} onHide={() => setModal({ id: '', show: false })}>
				<Modal.Header closeButton>
					<Modal.Title>Deleting user...</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure to delete this user?</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setModal({ id: '', show: false })}>
						Close
					</Button>
					<Button variant='danger' onClick={onDeleteConfirm}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default UserListScreen;
