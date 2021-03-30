import { FC, useState, useEffect } from "react";
import UserCard from "./UserCard";
import { db } from "../config.rnk";
// import "./Ranking.css";

const Ranking: FC = () => {
	const [data, setData] = useState([{ name: "初期値", score: 404 }]);
	const [sortedData, setSortedData] = useState([
		{ name: "初期値", score: 999 },
	]);

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
			console.log(data);
		});
		data.sort((a, b) => b.score - a.score);
		console.log("ソート1", data);

		return () => unSub();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const newData = data;
		setSortedData(newData);
		console.log("そーと2", newData);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className="user-list">
				{sortedData.map((doc, i) => (
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
