import { FC } from 'react';
import { Button } from '@material-ui/core';
import '../App.css';
import { db } from '../firebase';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getData = (arr: object[]) => {
	console.log('でーた取得');

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	db.collection('profiles')
		.get()
		.then((doc) => {
			// @ts-ignore
			arr = doc.map((profile) => {
				return profile;
			});
		})
		.catch((error) => {
			console.log('エラッたお', error);
		});
};

const Ranking: FC = () => {
	let users: object[];
	return (
		<>
			<Button
				onClick={() => {
					getData(users);
				}}
			>
				button
			</Button>
			<Button
				onClick={() => {
					console.log(users);
				}}
			>
				get
			</Button>
			{/* <Paper className='paperBlock' elevation={3}>
			<CardContent>
				<CardActions>1位　名前　：　レッツ剛田</CardActions>
			</CardContent>
		</Paper> */}
		</>
	);
};

export default Ranking;
