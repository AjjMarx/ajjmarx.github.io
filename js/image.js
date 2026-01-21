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



//Icon

iconSize = {
	"small" : 1.75,
	"normal" : 2.5,
	"large" : 3.5,
	"huge" : 4
}

marginSize = {
	"small" : 0,
	"normal" : 0.5,
	"large" : 1,
	"huge" : 1
}

async function addIcon(container, data, name, isAnimated) {
	return new Promise(async (resolve, reject) => {		
		const intake = await fetch(`media/Icons/${data["name"]}.svg`);
		let svgRaw = await intake.text();
		svgRaw = svgRaw.replace(/fill:#000000/g, `fill:${data["color"]}`);
		const parser = new DOMParser();
		const svgDOM = parser.parseFromString(svgRaw, "image/svg+xml").firstChild;
		//console.log(svgDOM.firstChild);
		svgDOM.id = assignName(name);
		svgDOM.alt = data["name"] ?? "untitled icon";
		svgDOM.href = data["link"] ?? "";
		svgDOM.style.margin = marginSize[data["size"] ?? "normal"] + "em";
		svgDOM.style.width = iconSize[data["size"] ?? "normal"] + "em";

		const link = document.createElement('a');
		link.href = data["link"] ?? "none";
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		container.appendChild(link);

		if (isAnimated) {
			svgDOM.style.width = "0em";
			await link.appendChild(svgDOM);
			const wdth = iconSize[data["size"] ?? "normal"];
			interpolate(0, 1, 0, 0, 100, (value) => {
				svgDOM.style.width = (value) * wdth + "em";
				svgDOM.style.margin = (1-value) * wdth/2 + marginSize[data["size"] ?? "normal"] + "em";
			}, () => {});
			svgDOM.style.width = wdth;
			svgDOM.style.margin = marginSize[data["size"] ?? "normal"] + "em";	
		} else {
			await link.appendChild(svgDOM);
		}
		resolve();
	});
}

async function removeIcon(element, isAnimated) {
	return new Promise(async (resolve, reject) => { 
		if (!element) { console.log("No such symbol"); return; }
		if (statusHash.get(element.id) == "removing"){ console.log("double removal being neglected"); return; }
		
		//console.log("removing image " + element.id);
		statusHash.set(element.id, "removing");
		const wdth = parseInt(element.style.width);
		if (isAnimated) {
			await interpolate(0, 1, 0, 0, 50, (value) => {
				element.style.width = (1-value) * wdth + "em";
				element.style.margin = (value) * wdth/2 + 1 + "em";
			}, () => {});
		}
		element.remove();
		statusHash.set(element.id, "removed");
		resolve();
	});
}

async function updateIcon(element, content) {
	console.log("updating image");
	return;
}
