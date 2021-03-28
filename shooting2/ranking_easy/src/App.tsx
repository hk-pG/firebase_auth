import { FC } from 'react';
import { Button, Paper, CardContent, CardActions } from '@material-ui/core';
import './App.css';
import { db } from './firebase';
import Counter from './components/Counter';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getData = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	db.collection('profiles')
		.get()
		.then((doc) => {
			// @ts-ignore
			doc.forEach((profile) => {
				console.log(profile.data());
			});
		})
		.catch((error) => {
			console.log('エラッたお', error);
		});
};

const App: FC = () => {
	return (
		<>
			<Counter />
			<Paper className="paperBlock" elevation={3}>
				<CardContent>
					<h1>データ取得</h1>
					<CardActions>
						<Button variant="contained" color="default" onClick={getData}>
							データを取得（したい）
						</Button>
					</CardActions>
				</CardContent>
			</Paper>
		</>
	);
};

export default App;
