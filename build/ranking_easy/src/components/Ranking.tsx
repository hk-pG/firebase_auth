import { FC, useState, useEffect } from 'react';
import UserCard from './UserCard';
import '../App.css';
import { db } from '../config.rnk';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getData = () => {
	console.log('でーた取得');

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	db.collection('profiles')
		.get()
		// @ts-ignore
		.then((doc) => {
			// @ts-ignore
			doc.forEach((user) => {
				console.log(user.data());
			});
		})
		// @ts-ignore
		.catch((error) => {
			console.log('エラッたお', error);
		});
};

const Ranking: FC = () => {
	const [data, setData] = useState([{ name: '', score: '' }]);

	useEffect(() => {
		// @ts-ignore
		const unSub = db.collection('profiles').onSnapshot((snapshot) => {
			setData(
				// @ts-ignore
				snapshot.docs.map((doc) => ({
					name: doc.data().name,
					score: doc.data().score,
				}))
			);
		});
		return () => unSub();
	}, []);
	return (
		<>
			<div>
				{data.map((doc, i) => (
					<UserCard
						className="user-card"
						key={i}
						name={doc.name}
						score={doc.score}
					/>
				))}
			</div>
		</>
	);
};

export default Ranking;
