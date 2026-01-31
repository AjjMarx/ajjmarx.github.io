function addBody(container, data, name, isAnimated) {
        //console.log("creating body..");
        const body = document.createElement("special-div");
	body.id = assignName(name);   
	container.appendChild(body);
        body.style.position = "absolute";
	let wideWidth = "692px";
	let wideLeft = "calc((100% - 1000px) / 2 + 302px)";
	let narrowWidth = "calc(100% - 8px)";
	let narrowLeft = "0px";
	if (parseInt(container.offsetWidth, 10) > 1000) {
		body.style.width = wideWidth;
		body.style.left = wideLeft; 
	} else {
		body.style.width = narrowWidth;
		body.style.left = narrowLeft;
	}
	body.style.padding = "4px 4px 4px 4px";
        body.style.top = "4em";
        body.style.bottom = "10px";
	body.style.minWidth = "592px";
	body.content.style.textAlign = "left";
	body.toggleAbberation();
	let footer_allow = true
	body.reload();
        for (const item of data) {
                //console.log(item);
		if (item["type"] == "footer" && footer_allow) { 
			body.style.bottom = "42px";
			body.reload();
			const footer = document.createElement("div");
			footer.id = assignName(item.id);
			body.footerId = footer.id;
			typeHash.set(parseInt(footer.id, 16), "footer");
			container.appendChild(footer);
			footer.style.position = "absolute";
			if (parseInt(container.offsetWidth, 10) >= 1000) {
				footer.style.width = wideWidth;
				footer.style.left = wideLeft; 
			} else {
				footer.style.width = narrowWidth;
				footer.style.left = narrowLeft;
			}
			footer.style.bottom = "8px";
			footer.style.height = "1.5em";
			
			footer_allow = false;

			window.addEventListener("resize", () => {
				if (parseInt(container.offsetWidth, 10) >= 1000) {
					footer.style.width = wideWidth;
					footer.style.left = wideLeft; 
				} else {
					footer.style.width = narrowWidth; 
					footer.style.left = narrowLeft;
				}
			});	

			generateChildren(footer, item["data"], isAnimated);
		} else {
			//typeHash.set(parseInt(id, 16), item["type"]);
			//spawnFunctions[item["type"]](body, item["data"], id, false);  
		}
        }      
	generateChildren(body, data, isAnimated); 

	let isWide = true;
        window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 1000 && !isWide) {
			body.style.width = wideWidth;
			body.style.left = wideLeft;
			body.reload();
			isWide = true;
		} else if (parseInt(container.offsetWidth, 10) < 1000) {
			body.style.width = narrowWidth;
			body.style.left = narrowLeft;
			body.reload(); 
			isWide = false;
		} 
	});
	//console.log("done rendering body");
}

async function removeBody(element, isAnimated) {
	//console.log("removing body"); 
	//console.log(element);
	if (!element) { return; }
	let botm = parseInt(element.style.bottom);
	await interpolate(0, parseInt(element.getBoundingClientRect().height, 10), -0.5, 4, 400, (value) => {
		//console.log(value);
		element.style.bottom = (botm + value) + "px";
		//console.log((botm + value) + "px");
		element.reload();
	}, () => {return true;});
	
	if (document.getElementById(element.footerId)) { document.getElementById(element.footerId).remove(); }
	element.remove();
	statusHash.set(element.id, "none");	
}	

async function updateBody(element, newContent, isAnimated) {
	//console.log("updating body", isAnimated);
	statusHash.set(element.id, "updating");	
	return new Promise(async (resolve, reject) => {	
		let content = element.content
		for (child of Array.from(content.children).reverse()) {
		//	console.log(child.id, child.localName, typeHash.get(parseInt(child.id)));
			if (typeHash.get(parseInt(child.id)) in supportedFuctions && supportedFuctions[typeHash.get(parseInt(child.id))]) {
		//		console.log(child);
				if (isAnimated && child.getBoundingClientRect().top < element.getBoundingClientRect().bottom) {
					await removalFunctions[typeHash.get(parseInt(child.id))](child, true);
				} else {
					await removalFunctions[typeHash.get(parseInt(child.id))](child, false);
				}
			}
		}
		await generateChildren(element,newContent, isAnimated)

		statusHash.set(element.id, "idle");	
		resolve();
	});
}
