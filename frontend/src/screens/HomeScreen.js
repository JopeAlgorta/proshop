import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

function HomeScreen({ history }) {
	const dispatch = useDispatch();
	const { error, loading, products, pages, page } = useSelector(state => state.productList);

	let keyword = history.location.search;

	useEffect(() => {
		dispatch(listProducts(keyword));
	}, [dispatch, keyword]);

	return (
		<div>
			<h1>Latest Products</h1>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : products.length === 0 ? (
				<Message variant='info'>
					No results for search: "{keyword && keyword.split('?keyword=')[1].split('&')[0]}"
				</Message>
			) : (
				<div>
					<Row>
						{products.map(pr => (
							<Col key={pr.id} sm={12} md={6} lg={4} xl={3}>
								<Product product={pr} />
							</Col>
						))}
					</Row>
					<Row className='justify-content-center'>
						<Paginate pages={pages} page={page} keyword={keyword} />
					</Row>
				</div>
			)}
		</div>
	);
}

export default HomeScreen;
