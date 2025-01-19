import React, {useState, useEffect} from "react";
import useProjectStore from "../hooks/ProjectStore.js";

const ProjectList = () => {
	const projectData = useProjectStore(state => state.projectData);
	const updateProjectData = useProjectStore(state => state.updateProjectData);
	const deleteProject = useProjectStore(state => state.deleteProject);
	const [activeProjects, setActiveProjects] = useState({});

	useEffect(() => {
		updateProjectData();
	}, []);

	const runProject = async (withConsole, projectInfo) => {
		const response = await fetch("/runProject", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({withConsole, projectInfo})
		});
		const data = await response.text();
		console.log(data);

		if (!withConsole) {
			const updatedActive = {...activeProjects};
			updatedActive[projectInfo.id] = 1;
			setActiveProjects(updatedActive);
		}
	};

	const stopProject = async (id) => {
		const response = await fetch("/stopProject", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({id: id})
		});
		const data = await response.text();
		console.log(data);

		const updatedActive = {...activeProjects};
		delete updatedActive[id];
		setActiveProjects(updatedActive);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const withConsole = formData.get("withConsole") === "on";
		const id = formData.get("id");

		if (activeProjects[id]) stopProject(id);
		else runProject(withConsole, {id: id, ...projectData[id]});
	};

	return (
		<ol>
			{console.log(activeProjects)}
			{Object.keys(projectData).map(id => (
				<li key={id}>
					<div>
						<div>{projectData[id].name}</div>
						<div>Path: {projectData[id].path}</div>
					</div>
					<form onSubmit={handleSubmit}>
						<input type="hidden" value={id} name="id" />
						<input type="checkbox" id={`withConsole${id}`} name="withConsole" />
						<label htmlFor={`withConsole${id}`}>Run with console</label><br />
						<button type="submit">{activeProjects[id] ? "Stop" : "Run"}</button>
					</form>
					<a href={`http://localhost:${projectData[id].port}`} target="_blank">Visit</a>
					<button onClick={() => deleteProject(id)}>Delete</button>
				</li>
			))}
		</ol>
	);
};

export default ProjectList;