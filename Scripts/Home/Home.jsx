import React, {useEffect, useState} from "react";
import Header from "../Header/Header.jsx";
import ProjectList from "../ProjectList/ProjectList.jsx";
import useProjectStore from "../hooks/ProjectStore.js";

const Home = () => {
	// const projectData = useProjectStore(state => state.projectData);
	// const updateProjectData = useProjectStore(state => state.updateProjectData);
	// const updateProject = useProjectStore(state => state.updateProject);

	useEffect(() => {
		// updateProjectData();
		// updateProject(3, {path: "D:\\Prince\\Web development\\Projects\\YouTube-player"});
		// deleteProject(2);
		// addProject({name: "Youtube Player", path: "D:\\Prince\\Web development\\Projects\\YouTube-player\\server.js", port: 3000});
	}, []);

	// // useEffect(() => {
	// // 	console.log("ProjectData:", projectData);
	// // }, [projectData]);

	return (
		<>
			<Header />
			<ProjectList />
		</>
	);
};

export default Home;