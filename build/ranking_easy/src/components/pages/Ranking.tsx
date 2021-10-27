import { FC } from 'react';
import { Card } from '@material-ui/core';
import { CenterTabs } from '../templates/CenterTabs';

const Ranking: FC = () => {
  return (
    <>
      <div className="user-list">
        <Card className="card-container">
          <CenterTabs />
        </Card>
      </div>
    </>
  );
};

export { Ranking };
