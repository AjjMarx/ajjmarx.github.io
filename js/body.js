function addBody(container, data, name) {
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
	body.style.minWidth = "calc(100vh * (0.5) - 8px)";
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

			generateChildren(footer, item["data"], false);
		} else {
			const id = assignName(item.id);
			typeHash.set(parseInt(id, 16), item["type"]);
			spawnFunctions[item["type"]](body, item["data"], id, false);  
		}
        }       
        window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 1000) {
			body.style.width = wideWidth;
			body.style.left = wideLeft;
			body.reload();
		} else {
			body.style.width = narrowWidth;
			body.style.left = narrowLeft;
			body.reload(); 
		}
	});
	//console.log("done rendering body");
}

async function removeBody(element) {
	console.log("removing body"); 
	//console.log(element);
	if (!element) { return; }
	let botm = parseInt(element.style.bottom);
	await interpolate(0, parseInt(element.getBoundingClientRect().height, 10), -0.5, 4, 400, (value) => {
		//console.log(value);
		element.style.bottom = (botm + value) + "px";
		//console.log((botm + value) + "px");
		element.reload();
	});
	
	if (document.getElementById(element.footerId)) { document.getElementById(element.footerId).remove(); }
	element.remove();
	statusHash.set(element.id, "none");	
}	

async function updateBody(element, newContent) {
	console.log("updating body");
	statusHash.set(element.id, "updating");	
	return new Promise(async (resolve, reject) => {	
		let body = element;
		let content = element.content
		let lastChild = deepest(content, (element) => { return (element && typeof element.getBoundingClientRect === "function"); });
		
		//remove out of sight elements
		while (parseInt(lastChild.getBoundingClientRect().top) > parseInt(element.getBoundingClientRect().height) + 50) {
			lastChild.remove();
			lastChild = deepest(content, (element) => { return (element && typeof element.getBoundingClientRect === "function"); });
		}

		let last = taglessLength(content);
		let now = last;
		let change = 0;
		let sum = 0;
		const len = last;

		//animate removal

		async function update(value) {
			let i = 0;
			while ((1 - value) * len < taglessLength(content) && i < 3) {
			change = taglessLength(content) - Math.floor((1 - value) * len);
				await HTMLsnip(content, change);
				i++;
			}	
		}
		
		await interpolate(0, 1, 0, 0, 300, update, () => { return;});
		
		content.innerHTML = "";
		let footer_allow = false;
		let animating = true;
		for (const item of newContent) {
			//console.log(item);
			if (item["type"] == "footer" && footer_allow) { 
				//generateChildren(footer, item["data"]);
			} else {
				const id = assignName(item.id);
				typeHash.set(parseInt(id, 16), item["type"]);
				await spawnFunctions[item["type"]](body, item["data"], id, animating);  
			}
			if (content.scrollHeight > parseInt(element.getBoundingClientRect().height)) { animating = false; }
		}
		statusHash.set(element.id, "idle");	
		resolve();
	});
}
