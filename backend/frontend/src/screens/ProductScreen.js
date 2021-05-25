import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { createProductReview, showProduct } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

function ProductScreen({ match, history }) {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	const dispatch = useDispatch();
	const { loading, error, product } = useSelector(state => state.productDetails);
	const {
		loading: loadingReview,
		error: errorReview,
		success: successReview
	} = useSelector(state => state.productReviewCreate);
	const { userInfo } = useSelector(state => state.userLogin);

	useEffect(() => {
		if (successReview) {
			setRating(0);
			setComment('');
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(showProduct(match.params.id));
	}, [match.params.id, dispatch, successReview]);

	const onAddToCart = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`);
	};

	const onSubmit = e => {
		e.preventDefault();
		const productId = match.params.id;
		dispatch(createProductReview(productId, { rating, comment }));
	};

	return (
		<div>
			<Link to='/' className='btn btn-light my-3'>
				<i className='fas fa-arrow-left'></i> Go back
			</Link>
			{loading === undefined || loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<div>
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
											<Col>
												{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
											</Col>
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
					<Row>
						<Col md={6}>
							<h4>Reviews</h4>
							{product.reviews.length === 0 && <Message variant='info'>No reviews</Message>}
							<ListGroup variant='flush'>
								{product.reviews.map(r => (
									<ListGroup.Item key={r.id}>
										<div className='d-flex justify-content-between'>
											<strong>{r.name}</strong>
											<small>{new Date(r.createdAt).toDateString()}</small>
										</div>
										<Rating value={r.rating} color='#f8e825' />
										<p className='pt-3'>{r.comment}</p>
									</ListGroup.Item>
								))}
								<ListGroup.Item>
									<h4>Write a review</h4>
									{loadingReview && <Loader />}
									{successReview && <Message variant='success'>Review submitted!</Message>}
									{errorReview && <Message variant='danger'>{errorReview}</Message>}
									{userInfo ? (
										<Form onSubmit={onSubmit}>
											<Form.Group controlId='rating'>
												<Form.Label>Rating</Form.Label>
												<Form.Control
													as='select'
													value={rating}
													onChange={e => setRating(e.target.value)}>
													<option value='0'>Select ...</option>
													<option value='1'>1 - Poor</option>
													<option value='2'>2 - Fair</option>
													<option value='3'>3 - Good</option>
													<option value='4'>4 - Very good</option>
													<option value='5'>5 - Excellent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId='comment'>
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as='textarea'
													rows={5}
													value={comment}
													onChange={e => setComment(e.target.value)}></Form.Control>
											</Form.Group>
											<Form.Group>
												<Button
													type='submit'
													disabled={loadingReview}
													variant='primary'>
													Submit
												</Button>
											</Form.Group>
										</Form>
									) : (
										<Message variant='info'>
											Please <Link to='/login'>login</Link> to write a review
										</Message>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
				</div>
			)}
		</div>
	);
}

export default ProductScreen;
