import React, { useContext } from "react";

export default function useUser(init_state) {
	const UserContext = React.createContext(
		init_state || {
			username: "",
			_id: "",
		}
	);

	const Provider = UserContext.Provider;
	const Consumer = UserContext.Consumer;

	const ctx = useContext(UserContext);

	return { ctx, Consumer, Provider };
}
