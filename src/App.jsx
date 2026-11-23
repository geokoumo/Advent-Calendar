import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { RequireAuth, RequireRole } from './auth/guards.jsx';
import { ContentProvider } from './hooks/useContent.jsx';
import ExperienceRoot from './layout/ExperienceRoot.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Home from './pages/Home.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import GiftPage from './pages/GiftPage.jsx';
import Memories from './pages/Memories.jsx';
import ForYou from './pages/ForYou.jsx';
import NotFound from './pages/NotFound.jsx';
import LoadingState from './components/LoadingState.jsx';

// The admin area is a separate chunk: Gina's experience never downloads it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

// Remount per day (and per admin "replay") so each visit gets its own opening sequence.
function GiftRoute() {
  const { day } = useParams();
  const location = useLocation();
  return <GiftPage key={`${day}-${location.state?.replay ?? ''}`} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route
              path="admin/*"
              element={
                <RequireRole role="admin">
                  <Suspense fallback={<LoadingState label="Opening the admin panel" />}>
                    <AdminApp />
                  </Suspense>
                </RequireRole>
              }
            />
            <Route
              element={
                <RequireAuth>
                  <ExperienceRoot />
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="day/:day" element={<GiftRoute />} />
              <Route path="memories" element={<Memories />} />
              <Route path="for-you" element={<ForYou />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
