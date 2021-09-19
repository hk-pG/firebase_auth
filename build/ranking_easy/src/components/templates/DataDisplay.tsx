import { FC, useEffect, useState } from 'react';
import { db } from '../../config.rnk';
import { maxRound } from '../../specialGlobal';
import { UserCard } from '../organisms/UserCard';

type Props = {
	collectionName: string;
};

const DataDisplay: FC<Props> = (props) => {
	const { collectionName } = props;
	const [data, setData] = useState([
		{ name: '...', score: 0, life: 0, round: 0 },
	]);

	const collection = db.collection(collectionName);

	useEffect(() => {
		collection
			.orderBy('round', 'desc')
			.orderBy('life', 'desc')
			.orderBy('score', 'desc')
			.onSnapshot((snapshot) => {
				console.log('useEffect process');
				setData(
					snapshot.docs.map((doc) => ({
						name: doc.data().name,
						life: doc.data().life,
						score: doc.data().score,
						round: doc.data().round,
					}))
				);
			});
	}, []);

	return (
		<>
			{data.map((doc, i) => {
				console.log(`${i}: ${doc}`);
				return (
					<UserCard
						className={`user-card number-${i + 1}`}
						key={i}
						index={i}
						{...doc}
						maxRound={maxRound}
					/>
				);
			})}
		</>
	);
};

export { DataDisplay };
