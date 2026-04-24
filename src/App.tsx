import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { ProductsPage } from "./pages/products";
import { ProtectedRoute } from "@/components/protected-route";
import { Navbar } from "@/components/navbar";

function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Login page - public */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Products page - protected */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navbar />
              <ProductsPage />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
