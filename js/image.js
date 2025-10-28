function addImg(container, data, name) {
        //console.log("creating image..");
	const img = document.createElement("img");
	img.id = assignName(name);
	img.src = data["file"];
	img.title = data["en_hover"];
	img.alt = data["en_hover"];
	img.style.display = "block";
	img.style.width = Math.min(container.offsetWidth * 0.8 * data["width"], 560) + "px";
	if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
		img.style.float = "none";
		img.style.margin = "1em auto";
	} else {	
		img.style.float = data["location"];
		img.style.margin = "1em 1em 1em 1em";
	}
	img.style.borderRadius = "12px";
	container.appendChild(img);

	window.addEventListener("resize", () => {
		img.style.width = container.offsetWidth * 0.8 * data["width"] + "px";
		if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
			img.style.float = "none";
			img.style.margin = "1em auto";
		} else {	
			img.style.float = data["location"];
			img.style.margin = "1em 1em 1em 1em";
		}
	});
}

async function removeImg(index) {
	let element = document.getElementById(index);
	console.log(element);
	console.log(element.isConnected + " " + index);
	if (!element) { console.log("No such image"); return; }
	if (statusHash.get(element.id) == "removing"){ console.log("double removal being neglected"); return; }
	console.log("removing image " + element.id);
	statusHash.set(element.id, "removing");
	const wdth = parseInt(element.style.width);
	await interpolate(0, wdth, 0, 0, 1000, (value) => {
//console.log(element.isConnected);
	console.log(element.isConnected + " " + index);
		element.style.width = Math.floor(Math.abs(wdth-value)) + "px"; //this is only being recognized in scope not outside this function unless called on its own
		console.log(Math.floor(Math.abs(wdth-value)) + " " + parseInt(element.style.width));
	});
	element.remove();
	statusHash.set(element.id, "removed");
}

async function updateImg(element) {
	console.log("updating image");
	return;
}

