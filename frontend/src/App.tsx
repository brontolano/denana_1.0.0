import { useState, useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { UsersPage } from './pages/UsersPage'
import { AdminPanelPage } from './pages/AdminPanelPage'
import { KategorisPage } from './pages/KategorisPage'
import { PosPage } from './pages/PosPage'
import { Layout } from './components/layout/Layout'
import { ToastContainer } from './components/Toast'
import { useAuthStore } from './store/authStore'

type Page = 'landing' | 'login' | 'register' | 'app'

type AppPage = 'dashboard' | 'pos' | 'products' | 'transactions' | 'users' | 'admin' | 'kategoris'

function App() {
  const [page, setPage] = useState<Page>('landing')
  const [appPage, setAppPage] = useState<AppPage>('dashboard')
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {}, [])

  useEffect(() => {
    if (!isAuthenticated && page === 'app') {
      setPage('landing')
    }
  }, [isAuthenticated, page])

  const renderContent = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onNavigate={setPage} />
      case 'login':
        return <LoginPage onNavigate={setPage} />
      case 'register':
        return <RegisterPage onNavigate={setPage} />
      case 'app':
        return (
          <Layout currentPage={appPage} onNavigate={setAppPage}>
            {(() => {
              switch (appPage) {
                case 'dashboard': return <DashboardPage />
                case 'pos': return <PosPage />
                case 'products': return <ProductsPage />
                case 'transactions': return <TransactionsPage />
                case 'users': return <UsersPage />
                case 'admin': return <AdminPanelPage />
                case 'kategoris': return <KategorisPage />
              }
            })()}
          </Layout>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <ToastContainer />
    </div>
  )
}

export default App
