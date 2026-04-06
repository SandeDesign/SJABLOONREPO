import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public layout + pagina's
import PubliekLayout from './pages/public/components/PubliekLayout'
import PubliekeWebsite from './pages/public/PubliekeWebsite'
import AboutPage from './pages/public/sections/AboutSection'
import ServicesPage from './pages/public/sections/ServicesSection'
import PortfolioPage from './pages/public/sections/PortfolioSection'
import ReviewsPage from './pages/public/sections/ReviewsSection'
import ContactPage from './pages/public/sections/ContactSection'

// Auth
import Login from './pages/Login'
import Register from './pages/Register'

// CMS
import CmsLayout from './pages/cms/CmsLayout'
import CmsDashboard from './pages/cms/CmsDashboard'
import CmsPaginas from './pages/cms/CmsPaginas'
import CmsInstellingen from './pages/cms/CmsInstellingen'
import CmsAfspraken from './pages/cms/modules/CmsAfspraken'
import CmsAanvragen from './pages/cms/modules/CmsAanvragen'
import CmsPortfolio from './pages/cms/modules/CmsPortfolio'
import CmsProducten from './pages/cms/modules/CmsProducten'
import CmsDocumenten from './pages/cms/modules/CmsDocumenten'
import CmsReviews from './pages/cms/modules/CmsReviews'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminInstellingen from './pages/admin/AdminInstellingen'
import AdminGebruikers from './pages/admin/AdminGebruikers'

import './index.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Publieke website — multi-page met gedeelde layout */}
            <Route element={<PubliekLayout />}>
              <Route path="/" element={<PubliekeWebsite />} />
              <Route path="/over-ons" element={<AboutPage />} />
              <Route path="/diensten" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* CMS routes — auth vereist */}
            <Route
              path="/cms"
              element={
                <ProtectedRoute>
                  <CmsLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CmsDashboard />} />
              <Route path="paginas" element={<CmsPaginas />} />
              <Route path="instellingen" element={<CmsInstellingen />} />
              <Route path="afspraken" element={<CmsAfspraken />} />
              <Route path="aanvragen" element={<CmsAanvragen />} />
              <Route path="portfolio" element={<CmsPortfolio />} />
              <Route path="producten" element={<CmsProducten />} />
              <Route path="documenten" element={<CmsDocumenten />} />
              <Route path="reviews" element={<CmsReviews />} />
            </Route>

            {/* Admin routes — alleen admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <CmsLayout isAdmin />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="instellingen" element={<AdminInstellingen />} />
              <Route path="gebruikers" element={<AdminGebruikers />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
