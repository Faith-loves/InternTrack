import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components'
import DashboardLayout from './layouts/DashboardLayout'
import AddApplicationPage from './pages/AddApplicationPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ApplicationDetailsPage from './pages/ApplicationDetailsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import CompaniesPage from './pages/CompaniesPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsPage from './pages/DocumentsPage'
import EditApplicationPage from './pages/EditApplicationPage'
import FeaturesPage from './pages/FeaturesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import InterviewsPage from './pages/InterviewsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import NotificationsPage from './pages/NotificationsPage'
import PolicyPage from './pages/PolicyPage'
import PricingPage from './pages/PricingPage'
import ResourcesPage from './pages/ResourcesPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import SuccessPage from './pages/SuccessPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PolicyPage type="privacy" />} />
      <Route path="/terms" element={<PolicyPage type="terms" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/add" element={<AddApplicationPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
          <Route path="/applications/:id/edit" element={<EditApplicationPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
