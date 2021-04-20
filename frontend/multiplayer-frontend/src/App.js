import EstablishConnection from "./components/establishConnection";
import { Switch, BrowserRouter as Router } from "react-router-dom";
function App() {
	return (
		<Router>
			<Switch>
				<div className="App">
					<EstablishConnection />
				</div>
			</Switch>
		</Router>
	);
}

export default App;
