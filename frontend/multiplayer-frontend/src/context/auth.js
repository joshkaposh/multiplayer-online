export default function useAuth() {
	let state;

	const test = (user) => {
		try {
			if (user.username && user._id) {
				state = true;
			}
		} catch (error) {}

		state = false;
	};

	return [state, test];
	// const ctx = useContext(UserContext);
}
