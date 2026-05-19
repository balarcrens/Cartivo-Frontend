import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout/Layout'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './Context/Auth/authProvider'
import CartProvider from './Context/Cart/CartProvider'
import WishlistProvider from './Context/Wishlist/WishlistProvider'
import ScrollToTop from './Components/ScrollToTop'
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./Pages/ResetPassword'));
const AddressForm = lazy(() => import('./Pages/AddressForm'));
const NotFound = lazy(() => import('./Pages/NotFound'));
const CategoryPage = lazy(() => import('./Pages/CategoryPage'));
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const ProductDetail = lazy(() => import('./Pages/ProductDetail'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const OrderSuccess = lazy(() => import('./Pages/OrderSuccess'));
const Wishlist = lazy(() => import('./Pages/Wishlist'));
const Orders = lazy(() => import('./Pages/Orders'));
const OrderDetail = lazy(() => import('./Pages/OrderDetail'));
const Profile = lazy(() => import('./Pages/Profile'));
const PrivacyPolicy = lazy(() => import('./Pages/Legal/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./Pages/Legal/TermsOfUse'));
const WarrantyPolicy = lazy(() => import('./Pages/Legal/WarrantyPolicy'));
const ReturnPolicy = lazy(() => import('./Pages/Legal/ReturnPolicy'));
const ShippingPolicy = lazy(() => import('./Pages/Legal/ShippingPolicy'));
const CookiePolicy = lazy(() => import('./Pages/Legal/CookiePolicy'));
const FAQ = lazy(() => import('./Pages/Legal/FAQ'));
const SizeGuide = lazy(() => import('./Pages/Legal/SizeGuide'));
const AboutUs = lazy(() => import('./Pages/AboutUs'));
const ContactUs = lazy(() => import('./Pages/ContactUs'));

const AdminRoute = lazy(() => import('./Components/Admin/AdminRoute'));
const AdminLayout = lazy(() => import('./Components/Layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./Pages/Admin/Dashboard'));
const AdminOrders = lazy(() => import('./Pages/Admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./Pages/Admin/AdminOrderDetail'));
const AdminProducts = lazy(() => import('./Pages/Admin/AdminProducts'));
const AdminProductDetail = lazy(() => import('./Pages/Admin/AdminProductDetail'));
const AdminUsers = lazy(() => import('./Pages/Admin/AdminUsers'));
const AdminCategories = lazy(() => import('./Pages/Admin/AdminCategories'));
const AdminCoupons = lazy(() => import('./Pages/Admin/AdminCoupons'));
const AdminReturns = lazy(() => import('./Pages/Admin/AdminReturns'));
const AdminBrands = lazy(() => import('./Pages/Admin/AdminBrands'));
const AdminHero = lazy(() => import('./Pages/Admin/AdminHero'));
const AdminContacts = lazy(() => import('./Pages/Admin/AdminContacts'));

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Toaster
				position="top-right"
				reverseOrder={false}
				toastOptions={{
					duration: 3000,
					style: {
						background: '#fff',
						color: '#000',
					},
				}}
			/>
			<Suspense fallback={
				<div className="flex items-center justify-center min-h-screen bg-white">
					<div className="flex flex-col items-center animate-in">
						<img src="/loader.gif" alt="Loading..." loading='lazy' />
						<p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gray-400">Loading Luxury</p>
					</div>
				</div>
			}>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path='/auth/signin' element={<Login />} />
						<Route path='/auth/signup' element={<Register />} />
						<Route path='/auth/forgot-password' element={<ForgotPassword />} />
						<Route path='/auth/reset-password/:token' element={<ResetPassword />} />
						<Route path='/auth/signup/address' element={<AddressForm />} />
						<Route path='/category/:slug' element={<CategoryPage />} />
						<Route path='/product/:slug' element={<ProductDetail />} />
						<Route path='/search' element={<SearchPage />} />
						<Route path='/checkout' element={<Checkout />} />
						<Route path='/order-success/:orderId' element={<OrderSuccess />} />
						<Route path='/wishlist' element={<Wishlist />} />
						<Route path='/orders' element={<Orders />} />
						<Route path='/order/:orderId' element={<OrderDetail />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/privacy-policy' element={<PrivacyPolicy />} />
						<Route path='/terms-of-use' element={<TermsOfUse />} />
						<Route path='/warranty-policy' element={<WarrantyPolicy />} />
						<Route path='/return-policy' element={<ReturnPolicy />} />
						<Route path='/shipping-policy' element={<ShippingPolicy />} />
						<Route path='/cookie-policy' element={<CookiePolicy />} />
						<Route path='/faq' element={<FAQ />} />
						<Route path='/size-guide' element={<SizeGuide />} />
						<Route path='/about-us' element={<AboutUs />} />
						<Route path='/contact-us' element={<ContactUs />} />
					</Route>

					<Route path="/admin" element={<AdminRoute />}>
						<Route element={<AdminLayout />}>
							<Route path="dashboard" element={<AdminDashboard />} />
							<Route path="orders" element={<AdminOrders />} />
							<Route path="orders/:orderId" element={<AdminOrderDetail />} />
							<Route path="products" element={<AdminProducts />} />
							<Route path="products/:productId" element={<AdminProductDetail />} />
							<Route path="users" element={<AdminUsers />} />
							<Route path="categories" element={<AdminCategories />} />
							<Route path="coupons" element={<AdminCoupons />} />
							<Route path="returns" element={<AdminReturns />} />
							<Route path="brands" element={<AdminBrands />} />
							<Route path="hero" element={<AdminHero />} />
							<Route path="contacts" element={<AdminContacts />} />
						</Route>
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App