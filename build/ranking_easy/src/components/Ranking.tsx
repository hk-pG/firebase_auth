import { FC, useState, useEffect } from 'react';
import UserCard from './UserCard';
import { db } from '../config.rnk';
// import "./Ranking.css";

const Ranking: FC = () => {
	const [data, setData] = useState([{ name: '', score: 0 }]);

	useEffect(() => {
		// @ts-ignore
		const unSub = db
			.collection('profiles')
			.orderBy('score', 'desc')
			.onSnapshot((snapshot) => {
				setData(
					snapshot.docs.map((doc) => ({
						name: doc.data().name,
						score: doc.data().score,
					}))
				);
				console.log('データ取得', data);
			});
		return () => unSub();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className="user-list">
				{data.map((doc, i) => (
					<UserCard
						className="user-card"
						key={i}
						index={i}
						name={doc.name}
						score={doc.score}
					/>
				))}
			</div>
		</>
	);
};

export default Ranking;
