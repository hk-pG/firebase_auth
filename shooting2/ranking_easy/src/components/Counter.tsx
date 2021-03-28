import { FC, useState } from 'react';
import {
	Paper,
	CardContent,
	Button,
	CardActions,
	makeStyles,
	createStyles,
} from '@material-ui/core';
import '../index.css';

const useStyles = makeStyles(() =>
	createStyles({
		buttonRed: {
			backgroundColor: 'red',
			color: 'white',
			'&:hover': {
				backgroundColor: 'red',
			},
		},
		center: {
			textAlign: 'center',
		},
		centerBlock: {
			margin: '0 auto',
		},
	})
);

const Counter: FC = () => {
	const [count, setCount] = useState(0);
	const { buttonRed, centerBlock } = useStyles();

	const increment = () => setCount((oldCount) => oldCount + 1);
	const decrement = () => setCount((oldCount) => oldCount - 1);

	return (
		<>
			<Paper className="paperBlock" elevation={3}>
				<CardContent>
					<h1>{count}</h1>
					<CardActions className={centerBlock}>
						<Button
							variant="contained"
							className={buttonRed}
							onClick={increment}
						>
							+
						</Button>
						<Button variant="contained" color="primary" onClick={decrement}>
							-
						</Button>
					</CardActions>
				</CardContent>
			</Paper>
		</>
	);
};

export default Counter;
