import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { Col, Image, ListGroup, Row, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { Link } from 'react-router-dom';

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;
	const qty = location.search ? Number(location.search.split('=', 2)[1]) : 1;
	const dispatch = useDispatch();
	const { cartItems } = useSelector(state => state.cart);

	useEffect(() => {
		if (productId) dispatch(addToCart(productId, qty));
	}, [dispatch, productId, qty]);

	const onDelete = id => {
		dispatch(removeFromCart(id));
	};

	const onCheckout = () => {
		history.push('/login?redirect=shipping');
	};

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message variant='info'>
						Your cart is empty <Link to='/'>Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map(i => (
							<ListGroup.Item key={i.product}>
								<Row>
									<Col md={3}>
										<Image src={i.image} alt={i.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${i.product}`}>{i.name}</Link>
									</Col>
									<Col md={2}>${i.price}</Col>
									<Col md={3}>
										<Form.Control
											as='select'
											value={i.qty}
											onChange={e =>
												dispatch(addToCart(i.product, Number(e.target.value)))
											}>
											{[...Array(i.countInStock).keys()].map(x => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={1}>
										<Button
											type='button'
											variant='light'
											onClick={() => onDelete(i.product)}>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h3>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)}) items </h3>
							<h6>$ {cartItems.reduce((acc, i) => acc + i.qty * i.price, 0).toFixed(2)}</h6>
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								onClick={onCheckout}
								className='btn-block'
								disabled={cartItems.length === 0}>
								<Row>
									<Col xs={2}>
										<i className='fas fa-credit-card'></i>
									</Col>
									<Col xs={10}>Go to Checkout</Col>
								</Row>
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default CartScreen;
