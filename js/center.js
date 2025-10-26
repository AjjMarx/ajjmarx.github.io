function addCenter(container, data, name) {
        //console.log("centering..");
	const body = document.createElement("div");
	body.id = assignName(name);
	//body.style.textAlign = "center";
	body.style.display = "inline-block";
	//body.style.width = "100%";
	//body.style.height = "100%";	
	container.appendChild(body);
	for (const item of data) {
		const id = item.id ?? 0;
                spawnFunctions[item["type"]](container, item["data"], parseInt(id,16));
	}
}

function removeCenter(element) {
	if (element) { element.remove(); }
}

async function updateCenter(element) {
	console.log("updating center");
	return;
}

