function addCenter(container, data, name, isAnimated) {
        //console.log("centering..");
	const body = document.createElement("div");
	body.id = assignName(name);
	body.style.textAlign = "center";
	body.style.display = "inline-block";
	body.style.width = "100%";
	//body.style.height = "100%";	
	container.appendChild(body);
	generateChildren(body, data, isAnimated);	
}

function removeCenter(element, isAnimated) {
	console.log("removing center");
	statusHash.set(element.id, "removing");	
	return new Promise(async (resolve, reject) => {	
		let content = element;
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

		statusHash.delete(element.id);
		element.remove();
		resolve();
	});
}

async function updateCenter(element, newContent, isAnimated) {
	console.log("updating center");
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

