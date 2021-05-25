import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';

const PaymentScreen = ({ history }) => {
	const dispatch = useDispatch();
	const { shippingAddress } = useSelector(state => state.cart);

	const [paymentMethod, setPaymentMethod] = useState('PayPal');

	const onSubmit = e => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push('/order');
	};

	if (!shippingAddress.address) history.push('/shipping');
	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<Form onSubmit={onSubmit}>
				<Form.Group>
					<Form.Label as='legend'>Select Method</Form.Label>
					<Col>
						<Form.Check
							type='radio'
							label='Paypal or Credit Card'
							id='paypal'
							name='paymentMethod'
							checked
							onChange={e => setPaymentMethod(e.target.value)}></Form.Check>
					</Col>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
};

export default PaymentScreen;
