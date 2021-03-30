import { FC } from "react";
import { Paper, Card, CardContent, ListItem } from "@material-ui/core";
import "./UserCard.css";

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
						<div className="name">NAME :{name}</div>
						<div className="score">Score :{score}</div>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

export default UserCard;
