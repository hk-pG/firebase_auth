import { FC } from 'react';
import { AppBar, Typography, Toolbar, makeStyles } from '@material-ui/core';
import './App.css';
import Ranking from './components/Ranking';

const useStyles = makeStyles(() => ({
	header: {
		width: '100%',
	},
}));

const App: FC = () => {
	const classes = useStyles();
	return (
		<div>
			<AppBar position='static' className={classes.header}>
				<Toolbar>
					<Typography variant='h6'>ランキング</Typography>
				</Toolbar>
			</AppBar>
			<Ranking />
		</div>
	);
};

export default App;
