import { FC } from "react";
import "./App.css";
import { Card, CardContent, Button } from "@material-ui/core";

import firebase from "./plugins/index";

const db = firebase.firestore();
// const auth = firebase.auth();

const App: FC = () => {
	const i = 0;

	return (
		<>
			<Card>
				<CardContent>
					<Button
						onClick={() => {
							db.collection("profiles")
								.doc("sample2")
								.set({
									name: "success",
								})
								.catch((err) => {
									console.log("えらー", err);
								});
						}}
					>
						{i}
					</Button>
				</CardContent>
			</Card>
		</>
	);
};
export default App;
