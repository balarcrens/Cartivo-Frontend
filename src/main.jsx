import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/Auth/authProvider.jsx'
import CartProvider from './Context/Cart/CartProvider.jsx'
import WishlistProvider from './Context/Wishlist/WishlistProvider.jsx'
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<CartProvider>
				<WishlistProvider>
					<HelmetProvider>
						<App />
					</HelmetProvider>
				</WishlistProvider>
			</CartProvider>
		</AuthProvider>
	</StrictMode>,
);
