import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrUpdateProduct, showProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants';

const ProductFormScreen = ({ match, history }) => {
	const dispatch = useDispatch();

	const {
		loading: productLoading,
		error: productError,
		product
	} = useSelector(state => state.productDetails);
	const { userInfo } = useSelector(state => state.userLogin);
	const { success } = useSelector(state => state.productCreateOrUpdate);

	const productId = match.params.id;
	const isCreateForm = productId === 'create';

	const [name, setName] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [image, setImage] = useState('');

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) return history.push('/');
		else if (isCreateForm) {
			dispatch({ type: PRODUCT_DETAILS_RESET });
		} else if (!product || product.id !== Number(productId)) dispatch(showProduct(productId));
		else {
			setName(product.name);
			setBrand(product.brand);
			setCategory(product.category);
			setPrice(product.price);
			setDescription(product.description);
			setCountInStock(product.countInStock);
			setImage(product.image);
		}
	}, [isCreateForm, dispatch, productId, history, userInfo, product]);

	useEffect(() => {
		if (success) history.goBack();
	}, [success, history]);

	const onSubmit = async e => {
		e.preventDefault();
		let payload = {
			name,
			brand,
			category,
			description,
			price,
			countInStock
		};

		if (!isCreateForm) payload.id = productId;

		dispatch(createOrUpdateProduct(payload));

		if (image) {
			const formData = new FormData();
			formData.append('image', image);

			await axios.post(`/api/products/${productId}/image/`, formData, {
				headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` }
			});
		}
	};

	return (
		<div>
			<Link to='/admin/products'>
				<Button variant='light'>
					<i className='fas fa-arrow-left'></i> Go Back
				</Button>
			</Link>
			<FormContainer>
				<h1>{isCreateForm ? 'Create' : 'Update'} Product</h1>
				{productLoading ? (
					<Loader />
				) : productError ? (
					<Message variant='danger'>{productError}</Message>
				) : (
					<Form onSubmit={onSubmit}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								required
								type='text'
								placeholder='Enter your name...'
								value={name}
								onChange={e => setName(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Row>
							<Col sm={6}>
								<Form.Group controlId='brand'>
									<Form.Label>Brand</Form.Label>
									<Form.Control
										required
										placeholder='Enter the brand...'
										value={brand}
										onChange={e => setBrand(e.target.value)}></Form.Control>
								</Form.Group>
							</Col>
							<Col sm={6}>
								<Form.Group controlId='category'>
									<Form.Label>Category</Form.Label>
									<Form.Control
										required
										placeholder='Enter the category...'
										value={category}
										onChange={e => setCategory(e.target.value)}></Form.Control>
								</Form.Group>
							</Col>
						</Form.Row>
						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								required
								as='textarea'
								rows={3}
								placeholder='Enter a description...'
								value={description}
								onChange={e => setDescription(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<InputGroup>
								<InputGroup.Prepend>
									<InputGroup.Text>$</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control
									required
									step='.01'
									type='number'
									placeholder='Enter the price...'
									value={price}
									onChange={e => setPrice(e.target.value)}></Form.Control>
							</InputGroup>
						</Form.Group>
						<Form.Row>
							<Col sm={6}>
								<Form.Group controlId='stock'>
									<Form.Label>Stock</Form.Label>
									<Form.Control
										step='.01'
										required
										type='number'
										value={countInStock}
										onChange={e => setCountInStock(e.target.value)}></Form.Control>
								</Form.Group>
							</Col>
							<Col sm={6}>
								<Form.Group controlId='image'>
									<Form.Label>Image</Form.Label>
									<Form.File
										id='imageField'
										label={typeof image === 'string' ? image : image.name}
										custom
										onChange={e => setImage(e.target.files[0])}></Form.File>
								</Form.Group>
							</Col>
						</Form.Row>

						<Button type='submit' variant='primary'>
							{isCreateForm ? 'Create' : 'Update'}
						</Button>
					</Form>
				)}
			</FormContainer>
		</div>
	);
};

export default ProductFormScreen;
