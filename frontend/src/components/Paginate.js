import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, keyword = '', isAdmin = false, entity = '' }) => {
	if (keyword) keyword = keyword.split('?keyword=')[1].split('&')[0];

	return (
		<Pagination>
			{[...Array(pages).keys()].map(x => (
				<LinkContainer
					key={x + 1}
					to={
						isAdmin
							? `/admin/${entity}/?keyword=${keyword}&page=${x + 1}`
							: `/?keyword=${keyword}&page=${x + 1}`
					}>
					<Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
				</LinkContainer>
			))}
		</Pagination>
	);
};

export default Paginate;
