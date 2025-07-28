import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { OrderProvider } from "./contexts/OrderContext"

// Customer Pages
import CustomerMenu from "./pages/customer/CustomerMenu"
import ProductDetail from "./pages/customer/ProductDetail"
import Cart from "./pages/customer/Cart"
import Checkout from "./pages/customer/Checkout"
import OrderStatus from "./pages/customer/OrderStatus"

// Cashier Pages
import CashierLogin from "./pages/cashier/CashierLogin"
import CashierDashboard from "./pages/cashier/CashierDashboard"
import OrderDetail from "./pages/cashier/OrderDetail"

// Owner Pages
import OwnerLogin from "./pages/owner/OwnerLogin"
import OwnerDashboard from "./pages/owner/OwnerDashboard"
import MenuManagement from "./pages/owner/MenuManagement"
import Analytics from "./pages/owner/Analytics"

// Components
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerMenu />} />
                <Route path="/menu" element={<CustomerMenu />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:orderId" element={<OrderStatus />} />

                {/* Cashier Routes */}
                <Route path="/cashier/login" element={<CashierLogin />} />
                <Route
                  path="/cashier/dashboard"
                  element={
                    <ProtectedRoute role="cashier">
                      <CashierDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cashier/order/:orderId"
                  element={
                    <ProtectedRoute role="cashier">
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Owner Routes */}
                <Route path="/owner/login" element={<OwnerLogin />} />
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedRoute role="owner">
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/menu"
                  element={
                    <ProtectedRoute role="owner">
                      <MenuManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/analytics"
                  element={
                    <ProtectedRoute role="owner">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
           
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
