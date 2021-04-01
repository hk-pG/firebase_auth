import { FC, useState, useEffect } from 'react';
import { Paper, Card, CardContent, ListItem } from '@material-ui/core';
import './UserCard.css';

type Props = {
	className: string;
	index: number;
	name: string;
	score: number;
	life: number;
};

const UserCard: FC<Props> = (props) => {
	const { className, name, score, index, life } = props;
	const [lifeInfo, setLifeInfo] = useState('...');
	useEffect(() => {
		console.log('更新');
		if (life < 0) {
			setLifeInfo('ゲームオーバー');
		} else if (life <= 5) {
			setLifeInfo(`残機 : ${life} でクリア`);
		}
	}, [life]);

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
								<div className="name">NAME : </div>
								<div className="inName">{name}</div>
							</div>
							<div className="isClear">{lifeInfo}</div>
							<div className="score-container container">
								<div className="score">SCORE : </div>
								<div className="inScore">{score} P</div>
							</div>
						</section>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

export default UserCard;
