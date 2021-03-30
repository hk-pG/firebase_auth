import { FC, useState, useEffect } from "react";
import UserCard from "./UserCard";
import "../App.css";
import { db } from "../config.rnk";

const Ranking: FC = () => {
	const [data, setData] = useState([{ name: "レッツ剛田", score: 1000 }]);

	useEffect(() => {
		// @ts-ignore
		const unSub = db.collection("profiles").onSnapshot((snapshot) => {
			setData(
				// @ts-ignore
				snapshot.docs.map((doc) => ({
					name: doc.data().name,
					score: doc.data().score,
				}))
			);
		});
		data.sort((a, b) => b.score - a.score);
		return () => unSub();
	}, [data]);

	useEffect(() => {
		const newData = data.map((doc) => doc);
		setData(newData);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div>
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
