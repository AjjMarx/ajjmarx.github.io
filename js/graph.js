async function addGraph(container, data, name, isAnimated){
	console.log("Adding graph");
	console.log(data);
	const graphWrapper = document.createElement("div");
	graphWrapper.id = assignName(name);
	graphWrapper.style.position = "relative";

	const graph = document.createElement("special-div");
	graph.id = assignName(name);
	graph.style.position = "absolute";
	graph.style.top = "0px";
	graph.style.width = "100%";
	graph.style.height = "100%";
	graph.style.dispay = "none";
	
	graphWrapper.style.aspectRatio = data["aspect_ratio"];
	if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
		graphWrapper.style.float = "none";
		graphWrapper.style.margin = "0.5em auto";
	} else {
		graphWrapper.style.float = data["location"];
		graphWrapper.style.margin = "0.5em 0.5em 0.5em 0.5em";
	}

	container.appendChild(graphWrapper);
	graphWrapper.appendChild(graph);

	window.addEventListener("resize", () => {
		if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
			graphWrapper.style.float = "none";
			graphWrapper.style.margin = "0.5em auto";
		} else {	
			graphWrapper.style.float = data["location"];
			graphWrapper.style.margin = "0.5em 0.5em 0.5em 0.5em";
		}
	});

	graph.content.style.padding = "0px 0px 0px 0px";

	const vis = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	vis.style.position = "absolute";
	vis.style.left = "0%";
	vis.style.top = "0%";
	vis.style.width = "100%";
	vis.style.height = "100%";
	vis.style.transform ="scaleY(-1)";
	vis.setAttribute("width", "100%");
	vis.setAttribute("height", "100%");
	vis.setAttribute("viewBox", String(data.x[0] + " " + data.y[0] + " " +  data.x[1] + " " + data.y[1]));
	vis.setAttribute("preserveAspectRatio", "none");
	vis.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	for (let i = data.y[0] - data.y[0]%data["lineSpacing"]; i < data.y[1]; i += data["lineSpacing"]) { 
		vis.innerHTML += `<polyline points="${data.x[0]},${i} ${data.x[1]},${i}" /fill="none" stroke="#D0D0D0" stroke-width="1", vector-effect="non-scaling-stroke">`; 
	}
	for (let i = data.x[0] - data.x[0]%data["lineSpacing"]; i < data.x[1]; i += data["lineSpacing"]) { 
		vis.innerHTML += `<polyline points="${i},${data.y[0]} ${i},${data.y[1]}" /fill="none" stroke="#D0D0D0" stroke-width="1", vector-effect="non-scaling-stroke">`; 
	}
	vis.innerHTML += `<polyline points="${data.x[0]},0 ${data.x[1]},0" /fill="none" stroke="oklch(0.75 0.225 330)" stroke-width="2", vector-effect="non-scaling-stroke">`;
	vis.innerHTML += `<polyline points="0,${data.y[0]} 0,${data.y[1]}" /fill="none" stroke="oklch(0.75 0.225 240)" stroke-width="2", vector-effect="non-scaling-stroke">`;
	for (let i = 0; i < data.equations.length; i++) {
		let eq = data.equations[i];
		let col = data.eqColors[i] ?? "Black";
		function evaluateFormula(x) {
			return eval(eq);
		}
		let temp = `<polyline points="`;
		let delta = 0;
		let x = data.x[0];
		let loop = 0;
		let pointCount = 0
		let nonEmpty = false;
		while (loop < 10000 && pointCount < 2000 && x < data.x[1]) {
			let xp = Math.trunc(x*100)/100;
			if (!isNaN(evaluateFormula(x)) || evaluateFormula(x) > data.y[1] || evaluateFormula(x) < data.y[0]) {
				if (evaluateFormula(xp) < data.y[1] + 1 && evaluateFormula(xp) > data.y[0] -1) {
					temp += `${xp},${Math.trunc(evaluateFormula(xp)*100)/100} `;
				}
				pointCount++;
				nonEmpty = true;
				if (!isNaN(evaluateFormula(x+0.01))) {
					x += 0.1 / Math.sqrt(Math.pow((evaluateFormula(x)-evaluateFormula(x+0.01))/0.01, 2)+ 1);
				} else { x += 0.01; }
			} else if (nonEmpty) {
				temp += `" /fill="none" stroke="${col}" stroke-width="2", vector-effect="non-scaling-stroke"></polyline><polyline points="`;
				nonEmpty = false;
				x += 0.1;
			} else { x += 0.01;}
			loop++;
		}
		//console.log(loop);
		temp += `" /fill="none" stroke="${col}" stroke-width="2", vector-effect="non-scaling-stroke">`;
		vis.innerHTML += temp;
	}
	for (let i = 0; i < data.points.length; i++) {
		let p = data.points[i];
		let col = data.pColors[i];
		vis.innerHTML += `<polyline points="${p[0]},${p[1]} ${p[0]+0.01},${p[1]}" /fill="none" stroke="${col}" stroke-width="8", stroke-linecap="round" vector-effect="non-scaling-stroke">`;
		vis.innerHTML += `<polyline points="${p[0]},${p[1]} ${p[0]+0.01},${p[1]}" /fill="none" stroke="white" stroke-width="4", stroke-linecap="round" vector-effect="non-scaling-stroke">`;
	}
	
	//'<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">'
	await graph.content.appendChild(vis);

	console.log(graph.content);	
	return new Promise((resolve, reject) => {
		if (isAnimated) {
			const wdth = 80 * data["width"];
			graphWrapper.style.width = "0%";
			graph.reload();
			interpolate(wdth, 0, 0, 0, 70, (value) => {
				graphWrapper.style.width = Math.floor(Math.abs(wdth-value)) + "px";
				graph.reload(); 
			}, () => {
				graphWrapper.style.width = 80 * data["width"] + "%";
				graph.style.display = "auto";
				graph.reload(); 
				resolve(); 
			});
		} else {	
			graphWrapper.style.width = 80 * data["width"] + "%";
			graph.style.display = "auto";
			graph.reload();
			resolve(); 
		}
	});
	

	return;
}

async function removeGraph(element, isAnimated) {
	return new Promise (async (resolve, reject) => {
		if (!element) { console.log("No such graph"); return; }
		if (statusHash.get(element.id) == "removing"){ console.log("double removal being neglected"); return; }
		console.log(element);
		//console.log("removing image " + element.id);
		statusHash.set(element.id, "removing");
		const wdth = parseInt(element.style.width);
		console.log(wdth);
		if (isAnimated) {
			await interpolate(0, wdth, 0, 0, 100, (value) => {
				element.style.width = Math.floor(Math.abs(wdth-value)) + "%";
				element.firstChild.reload();
			}, () => { return;});
		}
		element.remove();
		statusHash.set(element.id, "removed");
		resolve();
	});
}

async function updateGraph(element, content) {
	console.log("Updating graph");
	return;
}

