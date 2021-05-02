import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children, usr }) => {
	const [user, setUser] = useState(usr || null);

	const update = (obj) => {
		setUser({ ...obj });
	};

	return (
		<UserContext.Provider value={{ user, update }}>
			{children}
		</UserContext.Provider>
	);
};

export const UserConsumer = UserContext.Consumer;

export default function useUser() {
	return useContext(UserContext);
}
