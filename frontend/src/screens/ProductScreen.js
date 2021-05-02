import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { showProduct } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductScreen({ match, history }) {
	const [qty, setQty] = useState(1);

	const dispatch = useDispatch();
	const { loading, error, product } = useSelector(state => state.productDetails);

	useEffect(() => {
		dispatch(showProduct(match.params.id));
	}, [match.params.id, dispatch]);

	const onAddToCart = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`);
	};

	return (
		<div>
			<Link to='/' className='btn btn-light my-3'>
				Go back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row>
					<Col lg={6}>
						<Image src={product.image} alt={product.name} fluid />
					</Col>
					<Col lg={3}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product.numReviews} reviews`}
									color={'#f8e825'}
								/>{' '}
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
							<ListGroup.Item>Description: {product.description}</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col lg={3}>
						<Card>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
									</Row>
								</ListGroup.Item>
								{product.countInStock > 0 && (
									<ListGroup.Item>
										<Row>
											<Col>Qty:</Col>
											<Col xs='auto' className='my-1'>
												<Form.Control
													as='select'
													value={qty}
													onChange={e => setQty(e.target.value)}>
													{[...Array(product.countInStock).keys()].map(x => (
														<option key={x + 1} value={x + 1}>
															{x + 1}
														</option>
													))}
												</Form.Control>
											</Col>
										</Row>
									</ListGroup.Item>
								)}
								<ListGroup.Item>
									<Button
										onClick={onAddToCart}
										className='btn-block '
										disabled={product.countInStock === 0}>
										<Row>
											<Col xs={2}>
												<i className='fas fa-shopping-cart'></i>{' '}
											</Col>
											<Col xs={10}>Add to cart</Col>
										</Row>
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</div>
	);
}

export default ProductScreen;
