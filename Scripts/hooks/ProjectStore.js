import {create} from "zustand";

const useProjectStore = create((set, get) => ({
	projectData: {},

	updateProjectData: async () => {
		try {
			const response = await fetch("/getProjects", {method: "GET"});
			const data = await response.json();
		
			set(state => {
				const updatedProjectData = {...state.projectData};
				for (let project of data) {
					const id = project.id;
					delete project.id;

					updatedProjectData[id] = project;
				}

				console.log("projectData:", updatedProjectData);
				return {projectData: updatedProjectData};
			});
		}
		catch (err) {
			console.error(err);
		}
	},

	addProject: async (projectInfo) => {
		try {
			const response = await fetch("/addProject", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(projectInfo)
			});
			if (!response.ok) throw new Error(`Http error. Response status: ${response.status}`);

			const data = await response.json();
			console.log("In addProject", data.message);

			set(state => {
				const updatedProjectData = {...state.projectData};

				updatedProjectData[data.id] = projectInfo;
				return {projectData: updatedProjectData};
			});
		}
		catch (err) {
			console.error(err);
		}
	},

	deleteProject: async (id) => {
		try {
			const response = await fetch("/deleteProject", {
				method: "DELETE",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({id: id})
			});
			if (!response.ok) throw new Error(`Http error. Response status: ${response.status}`);

			const data = await response.text();
			console.log("In deleteProject:", data);

			set(state => {
				const updatedProjectData = {...state.projectData};

				if (updatedProjectData[id]) delete updatedProjectData[id];
				return {projectData: updatedProjectData};
			});
		}
		catch (err) {
			console.error(err);
		}

	},

	updateProject: async (id, updateData) => {
		// try {
			const response = await fetch(`/updateProject/${id}`, {
				method: "PATCH",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(updateData)
			});
			if (!response.ok) throw new Error(`Http error. Response status: ${response.status}`);

			const data = await response.text();
			console.log("In updateProject:", data);

			set(state => {
				const updatedProjectData = {...state.projectData};

				for (let key in updateData) {
					if (updatedProjectData[id]) updatedProjectData[id][key] = updateData[key];
				}

				return {projectData: updatedProjectData};
			});
		// }
		// catch (err) {
		// 	console.error(err);
		// }
	},
}));

export default useProjectStore;