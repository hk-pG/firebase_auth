import { FC } from 'react';
import { Paper, ListItem, CardContent, Card } from '@material-ui/core';
import './UserCard.css';

const ExampleCard: FC = () => {
	return (
		<Paper className="user-card">
			<Card className="card-in-button">
				<ListItem button disabled>
					<CardContent className="card-contents">
						<div className="rank">順位　↓</div>
						<section className="user-info">
							<div className="name-container container">
								<div className="name">NAME : </div>
								<div className="inName">名前</div>
							</div>
							<div className="isClear">クリア状況</div>
							<div className="score-container container">
								<div className="score">SCORE :</div>
								<div className="inScore">スコア</div>
							</div>
						</section>
					</CardContent>
				</ListItem>
			</Card>
		</Paper>
	);
};

export default ExampleCard;
