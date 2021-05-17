import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';

const ProductListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector(state => state.productList);
	const { userInfo } = useSelector(state => state.userLogin);
	const { success } = useSelector(state => state.userDelete);

	const [modal, setModal] = useState({ show: false, id: '' });

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		dispatch(listProducts());
	}, [dispatch, userInfo, history, success]);

	const onDeleteConfirm = () => {
		// dispatch(deleteUser(modal.id));
		setModal({ id: '', show: false });
	};

	return (
		<div>
			<Row className='mb-2'>
				<Col md={10}>
					<h1>Products</h1>
				</Col>
				<Col md={2} className='text-right'>
					<Link to='/admin/product/'>
						<Button variant='primary'>
							<i className='fas fa-plus'></i> Add product
						</Button>
					</Link>
				</Col>
			</Row>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table responsive bordered hover className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Category</th>
							<th className='text-center'>Rating</th>
							<th className='text-center'>Stock</th>
							<th className='text-center'>Price</th>
							<th className='text-center'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map(p => (
							<tr key={p.id}>
								<td>{p.id}</td>
								<td>{p.name}</td>
								<td>{p.category}</td>
								<td className='text-center'>
									<Rating value={p.rating} color={'#f8e825'} />
								</td>
								<td className='text-center'>{p.countInStock}</td>
								<td className='text-center'>$ {p.price}</td>
								<td className='text-center'>
									<LinkContainer to={`/admin/product/${p.id}`}>
										<Button variant='info' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={e => setModal({ show: true, id: p.id })}>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<Modal show={modal.show} onHide={() => setModal({ id: '', show: false })}>
				<Modal.Header closeButton>
					<Modal.Title>Deleting product...</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure to delete this product?</Modal.Body>
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

export default ProductListScreen;
