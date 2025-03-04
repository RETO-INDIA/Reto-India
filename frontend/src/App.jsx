import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import TitleUpdater from "../src/components/Title_Updater/title_updater";
import MainLayout from "./components/Layout/MainLayout";

const LandingPage = lazy(() => import("./components/LandingPage/LandingPage"));
const AboutUs = lazy(() => import("./components/About/AboutUs"));
const CartPage = lazy(() => import("./components/CartPage/CartPage"));
const CheckoutPage = lazy(() => import("./components/CheckOutPage/CheckoutPage"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const Login = lazy(() => import("./components/Login_Signup_Page/Login"));
const Signup = lazy(() => import("./components/Login_Signup_Page/Signup"));
const OrderPage = lazy(() => import("./components/OrderPage/OrderPage"));
const CardPaymentTemplate = lazy(() => import("./components/PaymentPage/CardPaymentTemplate"));
const GPayPaymentTemplate = lazy(() => import("./components/PaymentPage/GPayPaymentTemplate"));
const PaymentPage = lazy(() => import("./components/PaymentPage/MainPaymentPage"));
const PhonepePaymentTemplate = lazy(() => import("./components/PaymentPage/PhonePe"));
const UPIPaymentTemplate = lazy(() => import("./components/PaymentPage/Upi"));
const Product = lazy(() => import("./components/ProductPage/ProductPage"));
const ProductView = lazy(() => import("./components/ProductView/ProductView"));
const SuccessPage = lazy(() => import("./components/successPage/Success"));
const TrackingPage = lazy(() => import("./components/Track_order/TrackingPage"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TitleUpdater />
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="contact" element={<Contact />} />
              <Route path="product" element={<Product />} />
              <Route path="product/:productId" element={<ProductView />} />
              <Route path="tracking" element={<TrackingPage />} />
              <Route path="cartPage" element={<CartPage />} />
              <Route path="auth">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route path="orderPage" element={<OrderPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="order/:orderId/success" element={<SuccessPage />} />
              <Route path="gpayPayment" element={<GPayPaymentTemplate />} />
              <Route path="phonepe" element={<PhonepePaymentTemplate />} />
              <Route path="upipay" element={<UPIPaymentTemplate />} />
              <Route path="card" element={<CardPaymentTemplate />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;