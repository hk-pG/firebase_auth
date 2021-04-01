import { FC, useState, useEffect } from 'react';
import { Card } from '@material-ui/core';
import { db } from '../config.rnk';
import UserCard from './UserCard';
import ExampleCard from './ExampleCard';

const Ranking: FC = () => {
	const [data, setData] = useState([{ name: '', score: 0, life: 0 }]);

	useEffect(() => {
		// @ts-ignore
		const unSub = db
			.collection('profiles')
			.orderBy('score', 'desc')
			.onSnapshot((snapshot) => {
				setData(
					snapshot.docs.map((doc) => ({
						name: doc.data().name,
						life: doc.data().life,
						score: doc.data().score,
					}))
				);
			});
		return () => unSub();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className="user-list">
				<Card className="card-container">
					<ExampleCard />
					{data.map((doc, i) => (
						<UserCard
							className={`user-card number-${i + 1}`}
							key={i}
							index={i}
							name={doc.name}
							score={doc.score}
							life={doc.life}
						/>
					))}
				</Card>
			</div>
		</>
	);
};

export default Ranking;
