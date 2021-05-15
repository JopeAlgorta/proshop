import React, { useEffect, useState } from 'react';
import { Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, location }) => {
	const dispatch = useDispatch();
	const { order, error, loading } = useSelector(state => state.orderDetails);
	const { loading: loadingPay, success: successPay } = useSelector(state => state.orderPay);

	const [sdkReady, setSdkReady] = useState(false);
	const [referrer, setReferrer] = useState(location.search ? location.search.split('=')[1] : '');
	const orderId = match.params.id;

	if (referrer) setTimeout(() => setReferrer(''), 3000);

	let itemsPrice;
	if (!loading) itemsPrice = order.items.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

	const addPayPalScript = () => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src =
			'https://www.paypal.com/sdk/js?client-id=ATBryFI1zIRQvyo-ab6m_yVH6pyJ2YP_YGRVYXZhQLZWjaV5UL-hsRTOLpNNwwlx8vFgPEMQWM61ZuuK';
		script.async = true;
		script.onload = () => setSdkReady(true);
		document.body.appendChild(script);
	};

	useEffect(() => {
		if (!order || successPay || order.id !== Number(orderId)) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) addPayPalScript();
			else setSdkReady(true);
		}
	}, [order, orderId, dispatch, successPay]);

	const onPaymentSuccess = paymentResult => {
		dispatch(payOrder(orderId, paymentResult));
	};
	if (loading) return <Loader />;
	else if (error) return <Message variant='danger'>{error}</Message>;
	return (
		<div>
			{referrer && <Message variant='success'>Your order has been successfully placed!</Message>}
			<h1>Order: {orderId}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name:</strong> {order.user.name}
							</p>
							<p>
								<strong>Email:</strong>{' '}
								<a href={`mailto:${order.user.username}`}>{order.user.username}</a>
							</p>
							<p>
								<strong>Shipping: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city}
								{'    '}
								{order.shippingAddress.postalCode}
								{'    '}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>Delivered on: {order.deliveredAt}</Message>
							) : (
								<Message variant='warning'>Not delivered yet.</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>
									Paid on: {new Date(order.paidAt).toDateString()}
								</Message>
							) : (
								<Message variant='warning'>Not paid yet.</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.items.length === 0 ? (
								<Message variant='info'>Your order is empty.</Message>
							) : (
								<ListGroup variant='flush'>
									{order.items.map((item, i) => (
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
									<Col>$ {order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>$ {order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>$ {order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={onPaymentSuccess}
										/>
									)}
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default OrderScreen;
