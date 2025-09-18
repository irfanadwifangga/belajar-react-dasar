import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FetchUser from './components/fetching/FetchUser';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<FetchUser />
	</StrictMode>
);
