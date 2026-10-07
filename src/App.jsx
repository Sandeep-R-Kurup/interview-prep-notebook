import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StackPage from './pages/StackPage';
import TopicPage from './pages/TopicPage';
import Bookmarks from './pages/Bookmarks';
import QuickRevise from './pages/QuickRevise';
import RapidFire from './pages/RapidFire';
import SwipeCards from './pages/SwipeCards';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="stack/:stackId" element={<StackPage />} />
        <Route path="stack/:stackId/revise" element={<QuickRevise />} />
        <Route path="stack/:stackId/rapid" element={<RapidFire />} />
        <Route path="stack/:stackId/cards" element={<SwipeCards />} />
        <Route path="stack/:stackId/:topicId" element={<TopicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
