import { FC } from 'react';
import { Paper, Card, CardContent, ListItem } from '@material-ui/core';
import './UserCard.css';

type Props = {
	className: string;
	index: number;
	name: string;
	score: number;
};

const UserCard: FC<Props> = (props) => {
	const { className, name, score, index } = props;

	return (
		<Paper className={className}>
			<Card>
				<ListItem button>
					<CardContent className="card-contents">
						<div className="rank">第{index + 1}位</div>
						<section className="user-info">
							<div className="name-container container">
								<div className="name">NAME : </div>
								<div className="inName">{name}</div>
							</div>
							<div className="score-container container">
								<div className="score">SCORE : </div>
								<div className="inScore">{score}</div>
							</div>
						</section>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

export default UserCard;
