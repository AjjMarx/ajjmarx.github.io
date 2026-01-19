async function addLine(container, data, name, isAnimated) {
        //console.log("creating image..");
	const line = document.createElement("div");
	line.id = assignName(name);
	line.style.position = "relative";
	line.style.width = "00%";
	line.style.height = "3px";
	line.style.top = "-10px";
	line.style.left = (100-data["width"])/2 + "%";
	
	line.innerHTML = '<svg width="' + String(data["width"]) + '%" height="3px" xmlns="http://www.w3.org/2000/svg">' + '<line x1="0px" y1="1.5px" x2="100%" y2="1.5px" stroke="#000000" stroke-width="3px"/>' + '</svg>';
	line.firstChild.style.position = "absolute";
	
	container.appendChild(line);

	return new Promise((resolve, reject) => {
		if (isAnimated) {
		//	const wdth = Math.min(container.offsetWidth * 0.8 * data["width"], 560);
			interpolate(0, 1, 0, 0, 70, (value) => {
				line.style.width = (value * 100) + "%";
				line.style.left = 50*(1-value) + value*(100-data["width"])/2 + "%";
			}, () => {
				line.style.width = "100%";
				line.style.left = (100-data["width"])/2 + "%"; 
				resolve(); 
			});
		} else {
		//	line.style.width = Math.min(container.offsetWidth * 0.8 * data["width"], 560) + "px"; 
			line.style.width = "100%";
			line.style.left = (100-data["width"])/2 + "%";
			resolve(); 
		}
	});
}

async function removeLine(element, isAnimated) {
	return new Promise (async (resolve, reject) => { 
		console.log("Removing line");
		if (!element) { console.log("No such line"); reject(); }
		if (statusHash.get(element.id) == "removing"){ console.log("double removal being neglected"); reject(); }
		
		statusHash.set(element.id, "removing");
		const wdth = parseInt(element.style.width);
		console.log(wdth)
		if (isAnimated) {
			await interpolate(0, 1, 0, 0, 70, (value) => {
				element.style.width = (100 - value * 100) + "%";
				element.style.left = 50*(value) + (1 - value)*(100-wdth)/2 + "%";
			}, () => {});
		}
		element.remove();
		statusHash.set(element.id, "removed");
		resolve();
	});
}

async function updateLine(element, content) {
	console.log("updating image");
	return;
}

