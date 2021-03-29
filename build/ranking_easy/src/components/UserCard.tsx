import { FC } from 'react';
import { Paper, Card, CardContent, ListItem } from '@material-ui/core';
import './UserCard.css';

type Props = {
	className: string;
	name: string;
	score: string;
};

const UserCard: FC<Props> = (props) => {
	const { className, name, score } = props;

	return (
		<Paper className={className}>
			<Card>
				<ListItem button>
					<CardContent className="card-contents">
						<div className="name">NAME :{name}</div>
						<div className="score">SCORE :{score}</div>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

export default UserCard;
