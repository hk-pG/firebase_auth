import { Box, Typography } from '@material-ui/core';
import { FC } from 'react';

type TabPanelProps = {
  children?: React.ReactNode;
  index: any;
  value: any;
};

const TabPanel: FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export { TabPanel };
