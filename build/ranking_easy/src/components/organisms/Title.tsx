import { AppBar, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { FC } from "react";

type Props = {
  title: string;
};

const Title: FC<Props> = (props: Props) => {
  const { title } = props;
  const classes = useStyles();
  return (
    <>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

const useStyles = makeStyles(() => ({
  header: {
    width: "100%",
  },
}));

export { Title };
