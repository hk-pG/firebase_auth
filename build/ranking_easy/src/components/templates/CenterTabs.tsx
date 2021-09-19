import { FC, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel } from '../organisms/TabPanel';
import { DataDisplay } from './DataDisplay';

const a11yProps = (index: any) => {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
};

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}));

const CenterTabs: FC = () => {
	const classes = useStyles();
	const [value, setValue] = useState(0);
	const collectionNames = ['profiles', 'hamako-fes'];

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static" color="transparent">
				<Tabs value={value} onChange={handleChange} centered>
					<Tab label="常設ランキング" {...a11yProps(0)} />
					<Tab label="浜工祭特設ランキング" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			{collectionNames.map((name, i) => {
				return (
					<TabPanel value={value} index={i} key={i}>
						{/* nつ目のタブを押したときに出て来る要素 */}
						<DataDisplay collectionName={name} />
					</TabPanel>
				);
			})}
		</div>
	);
};

export { CenterTabs };
