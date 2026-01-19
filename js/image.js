async function addImg(container, data, name, isAnimated) {
        //console.log("creating image..");
	const img = document.createElement("img");
	img.id = assignName(name);
	img.src = data["file"];
	img.title = data["en_hover"];
	img.alt = data["en_hover"];
	img.style.display = "block";
	img.style.width = 80 * data["width"] + "%";
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
		if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
			img.style.float = "none";
			img.style.margin = "1em auto";
		} else {	
			img.style.float = data["location"];
			img.style.margin = "1em 1em 1em 1em";
		}
	});
	return new Promise((resolve, reject) => {
		if (isAnimated) {
			const wdth = 80 * data["width"];
			interpolate(wdth, 0, 0, 0, 50, (value) => {
				img.style.width = Math.floor(Math.abs(wdth-value)) + "%"; 
			}, () => { resolve(); });
		} else {
			img.style.width = 80 * data["width"] + "%";
			resolve(); 
		}
	});

	
}

async function removeImg(element, isAnimated) {
	return new Promise(async (resolve, reject) => { 
		if (!element) { console.log("No such image"); return; }
		if (statusHash.get(element.id) == "removing"){ console.log("double removal being neglected"); return; }
		
		//console.log("removing image " + element.id);
		statusHash.set(element.id, "removing");
		const wdth = parseInt(element.style.width);
		if (isAnimated) {
			await interpolate(0, wdth, 0, 0, 100, (value) => {
				element.style.width = Math.floor(Math.abs(wdth-value)) + "%"; 
			}, () => {});
		}
		element.remove();
		statusHash.set(element.id, "removed");
		resolve();
	});
}

async function updateImg(element, content) {
	console.log("updating image");
	return;
}


