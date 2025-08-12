import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx';
import Notifications from './pages/Notifications.tsx';
import CompleteProfile from './pages/CompleteProfile.tsx';
import Call from './pages/Call.tsx';
import Chat from './pages/Chat.tsx';
import useRegister from './hooks/useRegister.ts';
import PageLoader from './components/pageloader.tsx';
import useAuthentication from './hooks/useAuthentication.ts';
import { useEffect, useState } from 'react';

// <a href="https://storyset.com/online">Online illustrations by Storyset</a>

export default function App() {
  const { loading, error, handleRegister } = useRegister();
  const { user, authLoading } = useAuthentication();
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false);
  const [ profileCompleted, setProfileCompleted ] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(user));
    setProfileCompleted(Boolean(user?.completed_profile));
  }, [user]);

  return (
    <div>
      {authLoading && <PageLoader/>}
      <Toaster />
      <Routes>
        <Route path='/' element={isAuthenticated && profileCompleted ? <Home /> : <Navigate to={!isAuthenticated ? '/login' : '/complete'} />} />
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={!profileCompleted ? '/complete' : '/'}/>} />
        <Route path='/register' element={!isAuthenticated ? <Register handleSubmit={handleRegister} error={error} loading={loading}/> : <Navigate to={!profileCompleted ? '/complete' : '/'} />} />
        <Route path='/notifications' element={isAuthenticated ? <Notifications /> : <Navigate to={"/login"} />} />
        <Route path='/complete' element={isAuthenticated ? (!profileCompleted ? <CompleteProfile/> : <Home/>) : <Navigate to={"/login"} />} />
        <Route path='/call' element={isAuthenticated ? <Call /> : <Navigate to={"/login"} />} />
        <Route path='/chat' element={isAuthenticated ? <Chat /> : <Navigate to={"/login"} />} />
      </Routes>
    </div>
  )
} 