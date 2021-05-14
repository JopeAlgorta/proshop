import React from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';

const OrderScreen = () => {
	const dispatch = useDispatch();
	const { shippingAddress, cartItems, paymentMethod } = useSelector(state => state.cart);

	const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
	const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
	const tax = (0.082 * itemsPrice).toFixed(2);
	const totalPrice = (Number(tax) + shippingPrice + Number(itemsPrice)).toFixed(2);

	const placeOrder = () => {};

	return (
		<div>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Shipping: </strong>
								{shippingAddress.address}, {shippingAddress.city}
								{'    '}
								{shippingAddress.postalCode}
								{'    '}
								{shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{paymentMethod}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{cartItems.length === 0 ? (
								<Message variant='info'>Your cart is empty.</Message>
							) : (
								<ListGroup variant='flush'>
									{cartItems.map((item, i) => (
										<ListGroup.Item key={i}>
											<Row>
												<Col md={1}>
													<Image src={item.image} alt={item.name} rounded fluid />
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>{item.name}</Link>
												</Col>
												<Col md={1}>{item.qty}</Col>
												<Col md={1}>X</Col>
												<Col md={2}>${item.price}</Col>
												<Col md={2}>$ {(item.qty * item.price).toFixed(2)}</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Subtotal:</Col>
									<Col>$ {itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping:</Col>
									<Col>$ {shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>$ {tax}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>$ {totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Button
									className='btn-block'
									disabled={cartItems.length === 0}
									onClick={placeOrder}>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default OrderScreen;
