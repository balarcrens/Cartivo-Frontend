import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/Auth/authProvider.jsx'
import CartProvider from './Context/Cart/CartProvider.jsx'
import WishlistProvider from './Context/Wishlist/WishlistProvider.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<CartProvider>
				<WishlistProvider>
						<App />
				</WishlistProvider>
			</CartProvider>
		</AuthProvider>
	</StrictMode>,
);
