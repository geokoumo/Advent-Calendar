import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState.jsx';
import AppShell from './layout/AppShell.jsx';
import Home from './pages/Home.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import GiftPage from './pages/GiftPage.jsx';
import Memories from './pages/Memories.jsx';
import ForYou from './pages/ForYou.jsx';
import NotFound from './pages/NotFound.jsx';

// Remount per day so each visit gets its own opening sequence.
function GiftRoute() {
  const { day } = useParams();
  return <GiftPage key={day} />;
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="day/:day" element={<GiftRoute />} />
            <Route path="memories" element={<Memories />} />
            <Route path="for-you" element={<ForYou />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
