import React, { useEffect } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTopProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductCarousel = () => {
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector(state => state.productTopRated);

	useEffect(() => {
		dispatch(getTopProducts());
	}, [dispatch]);

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<Carousel pause='hover' className='bg-dark'>
			{products.map(p => (
				<Carousel.Item key={p.id}>
					<Link to={`/product/${p.id}`}>
						<div className='image-container'>
							<Image src={p.image} alt={p.name} roundedCircle />
						</div>
						<Carousel.Caption className='carousel.caption'>
							<h4>
								{p.name} ($ {p.price})
							</h4>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default ProductCarousel;
