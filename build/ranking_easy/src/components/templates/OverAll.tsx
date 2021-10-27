import { FC, useEffect, useState } from 'react';
import { db } from '../../config.rnk';
import { maxRound } from '../../specialGlobal';
import { UserCard } from '../organisms/UserCard';

const OverAll: FC = () => {
	const [data, setData] = useState([{ name: '', score: 0, life: 0, round: 0 }]);
	const profRef = db.collection('profiles');

	useEffect(() => {
		profRef
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
				return (
					<UserCard
						key={i}
						className={`user-card number-${i + 1}`}
						index={i}
						name={doc.name}
						score={doc.score}
						life={doc.life}
						round={doc.round}
						maxRound={maxRound}
					/>
				);
			})}
		</>
	);
};

export { OverAll };
