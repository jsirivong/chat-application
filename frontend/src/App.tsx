import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx';
import Notifications from './pages/Notifications.tsx';
import CompleteProfile from './pages/CompleteProfile.tsx';
import Call from './pages/Call.tsx';
import useRegister from './hooks/useRegister.ts';
import PageLoader from './components/pageloader.tsx';
import useAuthentication from './hooks/useAuthentication.ts';
import Layout from './components/layout.tsx';
import { useThemeStore } from './store/useThemeStore.ts';
import { useEffect, useState } from 'react';
import ChatPage from './pages/ChatPage.tsx';

// <a href="https://storyset.com/online">Online illustrations by Storyset</a>

export default function App() {
  const { loading, error, handleRegister } = useRegister();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  const { user, authLoading } = useAuthentication();
  const { theme } = useThemeStore();

  useEffect(() => {
    setIsAuthenticated(Boolean(user));
    setProfileCompleted(user?.completed_profile as boolean);
  })

  if (authLoading) {
    return <PageLoader />
  }

  return (
    <div data-theme={theme}>
      <Toaster />
      <Routes>
        {/* the Layout component shows the "navbar" and "sidebar" components */}
        <Route path='/' element={isAuthenticated && profileCompleted ? <Layout showSidebar={true}><Home /></Layout> : <Navigate to={!isAuthenticated ? '/login' : '/complete'} />} />
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={!profileCompleted ? '/complete' : '/'} />} />
        <Route path='/register' element={!isAuthenticated ? <Register handleSubmit={handleRegister} error={error} loading={loading} /> : <Navigate to={!profileCompleted ? '/complete' : '/'} />} />
        <Route path='/notifications' element={isAuthenticated && profileCompleted ? <Layout showSidebar><Notifications /></Layout> : <Navigate to={!profileCompleted ? "/complete" : "/login"} />} />
        <Route path='/complete' element={isAuthenticated ? (!profileCompleted ? <CompleteProfile /> : <Home />) : <Navigate to={"/login"} />} />
        <Route path='/call' element={isAuthenticated ? <Call /> : <Navigate to={"/login"} />} />
        <Route path='/chat/:id' element={<Layout showSidebar={false}><ChatPage/></Layout>}/>
      </Routes> 
    </div>
  )
} 