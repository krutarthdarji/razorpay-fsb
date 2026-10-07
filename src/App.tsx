import { Navigate, Route, Routes } from 'react-router-dom';
import { DemoApp } from './DemoApp';
import { Landing } from './screens/Landing/Landing';
import { DemoProvider } from './state/demo';
import { paths } from './routes';

export function App() {
  return (
    <DemoProvider>
      <Routes>
        <Route path={paths.landing} element={<Landing />} />
        <Route path={`${paths.home}/*`} element={<DemoApp />} />
        <Route path="*" element={<Navigate to={paths.landing} replace />} />
      </Routes>
    </DemoProvider>
  );
}
