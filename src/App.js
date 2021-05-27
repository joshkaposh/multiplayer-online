import { Switch, BrowserRouter as Router } from "react-router-dom";
import Pages from "./components/pages/Pages";

function App() {
	return (
		<Router>
			<div className="App"></div>
			<Switch>
				<Pages />
			</Switch>
		</Router>
	);
}

export default App;
