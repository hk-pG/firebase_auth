import React, { FC, useState, useEffect } from 'react';
import { Paper, Card, CardContent, ListItem } from '@material-ui/core';
import './UserCard.css';

type Props = {
	className: string;
	index: number;
	name: string;
	score: number;
	life: number;
	round: number;
	maxRound: number;
};

const UserCard: FC<Props> = (props) => {
	const { className, name, score, index, life, round = 0, maxRound } = props;
	const [clearInfo, setClearInfo] = useState('...');

	useEffect(() => {
		if (round <= 0) {
			setClearInfo(`ゲームオーバー`);
		} else if (round < maxRound) {
			setClearInfo(`ステージ${round}まで残機${life}でクリア`);
		} else if (round >= maxRound) {
			setClearInfo(`残機${life}でクリア`);
		}
	}, [round, maxRound, life]);

	return (
		<Paper className={className}>
			<Card className="card-in-button">
				<ListItem
					button
					onClick={() => {
						console.log(`My life is ${life}`);
					}}
				>
					<CardContent className="card-contents">
						<div className="rank">第{index + 1}位</div>
						<section className="user-info">
							<div className="name-container container">
								<div className="inName">{name}</div>
							</div>
							<div className="isClear">クリア状況 :{clearInfo}</div>
							<div className="score-container container">
								<div className="inScore">SCORE : {score} P</div>
							</div>
						</section>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

UserCard.displayName = 'UserCard';

export { UserCard };
