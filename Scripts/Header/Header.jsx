import React from "react";
import useProjectStore from "../hooks/ProjectStore.js";

const Header = () => {
	const addProject = useProjectStore(state => state.addProject);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const data = {};

		formData.forEach((value, key) => {
			data[key] = value;
		});

		addProject(data);
		event.target.clear();
	};

	return (
		<header>
			<h1>Project Manager</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Name..." name="name" />
				<input type="text" placeholder="Path..." name="path" />
				<input type="text" placeholder="Port..." name="port" />
				<button type="submit">Add</button>
			</form>
		</header>
	);
};

export default Header;