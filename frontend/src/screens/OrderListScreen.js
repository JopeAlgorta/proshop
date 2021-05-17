import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { deliverOrder, getOrdersAdmin } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const { orders, loading, error } = useSelector(state => state.orderListAdmin);
	const { userInfo } = useSelector(state => state.userLogin);
	const { success } = useSelector(state => state.orderDeliver);

	const [modal, setModal] = useState({ show: false, id: '' });

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		dispatch(getOrdersAdmin());
	}, [dispatch, userInfo, history, success]);

	const onDeliverConfirm = () => {
		dispatch(deliverOrder(modal.id));
		setModal({ id: '', show: false });
	};

	return (
		<div>
			<h1>Orders</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table responsive bordered hover className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>User</th>
							<th className='text-center'>Price</th>
							<th className='text-center'>Paid</th>
							<th className='text-center'>Paid At</th>
							<th className='text-center'>Delivered</th>
							<th className='text-center'>Delivered At</th>
							<th className='text-center'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{orders.map(o => (
							<tr key={o.id}>
								<td>{o.id}</td>
								<td>{o.user.email}</td>
								<td className='text-center'>$ {o.totalPrice}</td>
								{o.isPaid ? (
									<td className='text-center'>
										{' '}
										<i style={{ color: 'green' }} className='fas fa-check'></i>
									</td>
								) : (
									<td className='text-center' style={{ color: 'red' }}>
										{' '}
										&#10008;{' '}
									</td>
								)}
								<td className='text-center'>
									{o.isPaid ? new Date(o.paidAt).toDateString() : '-'}
								</td>
								{o.isDelivered ? (
									<td className='text-center' style={{ color: 'green' }}>
										{' '}
										<i className='fas fa-check'></i>
									</td>
								) : (
									<td className='text-center' style={{ color: 'red' }}>
										{' '}
										&#10008;{' '}
									</td>
								)}
								<td className='text-center'>
									{o.isDelivered ? new Date(o.deliveredAt).toDateString() : '-'}
								</td>
								<td className='text-center'>
									<LinkContainer to={`/order/${o.id}`}>
										<Button variant='info' className='btn-sm'>
											<i className='fas fa-eye'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='success'
										className='btn-sm'
										disabled={o.isDelivered}
										onClick={e => setModal({ show: true, id: o.id })}>
										<i className='fas fa-plane'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<Modal show={modal.show} onHide={() => setModal({ id: '', show: false })}>
				<Modal.Header closeButton>
					<Modal.Title>Delivering order...</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure to mark this order as delivered?</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setModal({ id: '', show: false })}>
						Close
					</Button>
					<Button variant='success' onClick={onDeliverConfirm}>
						Deliver
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default OrderListScreen;
