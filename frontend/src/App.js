import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import EditUserScreen from './screens/EditUserScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductFormScreen from './screens/ProductFormScreen';

function App() {
	return (
		<Router>
			<Header />
			<main className='py-3'>
				<Container>
					<Route path='/' exact component={HomeScreen} />
					<Route path='/login' component={LoginScreen} />
					<Route path='/signup' component={SignupScreen} />
					<Route path='/profile' component={ProfileScreen} />
					<Route path='/shipping' component={ShippingScreen} />
					<Route path='/payment' component={PaymentScreen} />
					<Route path='/order/:id' component={OrderScreen} />
					<Route path='/order' exact component={PlaceOrderScreen} />
					<Route path='/product/:id' component={ProductScreen} />
					<Route path='/cart/:id?' component={CartScreen} />
					<Route path='/admin/users' component={UserListScreen} />
					<Route path='/admin/user/:id' component={EditUserScreen} />
					<Route path='/admin/products' component={ProductListScreen} />
					<Route path='/admin/product/:id' component={ProductFormScreen} />
				</Container>
			</main>
			<Footer />
		</Router>
	);
}

export default App;
