import { FC } from "react";
import { Card } from "@material-ui/core";
import ExampleCard from "../organisms/ExampleCard";
import { OverAll } from "../templates/OverAll";

const Ranking: FC = () => {
  return (
    <>
      <div className="user-list">
        <Card className="card-container">
          <ExampleCard />
          <OverAll />
        </Card>
      </div>
    </>
  );
};

export default Ranking;
