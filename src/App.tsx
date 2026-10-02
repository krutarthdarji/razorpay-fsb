import { Navigate, Route, Routes } from 'react-router-dom';
import { GlobalNav } from './components/GlobalNav';
import { DemoApp } from './DemoApp';
import { Landing } from './screens/Landing/Landing';
import { paths } from './routes';

export function App() {
  return (
    <>
      <GlobalNav />
      <Routes>
        <Route path={paths.landing} element={<Landing />} />
        <Route path={`${paths.home}/*`} element={<DemoApp />} />
        <Route path="*" element={<Navigate to={paths.landing} replace />} />
      </Routes>
    </>
  );
}
