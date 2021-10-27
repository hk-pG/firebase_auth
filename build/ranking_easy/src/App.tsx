import { FC } from 'react';
import './App.css';
import { Title } from './components/organisms/Title';
import { Ranking } from './components/pages/Ranking';

const App: FC = () => {
	return (
		<>
			<Title title="ランキング" />
			<Ranking />
		</>
	);
};

export default App;
