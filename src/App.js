import { Switch, BrowserRouter as Router } from "react-router-dom";
import Pages from "./components/ui/pages/Pages";

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Pages />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
