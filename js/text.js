async function addText(container, data, name, isAnimated) {
        return new Promise((resolve, reject) => {
		const text = document.createElement("a");
        	container.appendChild(text);
		text.id = assignName(name);
		let toAdd = "";
		if (data["all"] != undefined) {
			toAdd = data["all"];
		} else if (data["en"] != undefined) {
        		toAdd = data["en"];
			} else if (data["zh"] != undefined) {
			toAdd = data["zh"];
		}

		if (isAnimated) {

			let i = 0;
			const dupe = document.createElement("div");
			dupe.innerHTML = toAdd;	
			let len = taglessLength(dupe);
			async function update(value) {
				text.innerHTML = dupe.innerHTML; //reset
				await HTMLsnip(text, Math.floor(len - value * len));
			}
			interpolate(0, 1, 0, 0, Math.max(len/10, 40), update, () => {
				text.innerHTML = dupe.innerHTML ;
				dupe.remove();
				resolve();
			});
		} else {	
			text.innerHTML = toAdd;
			resolve();
		}
	});
}

async function removeText(element, isAnimated) {
	if (element) {
		return new Promise(async (resolve, reject) => {
			if (isAnimated) {
				const len = taglessLength(element);
				async function update(value) {
					HTMLsnip(element, taglessLength(element) - Math.floor((1-value)*len));
				}
				await interpolate(0, 1, 0, 0, Math.max(len/10, 40), update, () => {});
			}	
			element.remove();
			resolve();
		});
	}
}

async function updateText(element, content) {
	console.log("updating text");
	return;
}

