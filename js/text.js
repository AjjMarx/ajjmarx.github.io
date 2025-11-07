async function addText(container, data, name, isAnimated) {
        //console.log("creating text..");
        return new Promise((resolve, reject) => {
		const text = document.createElement("div");
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
			//console.log(dupe);
			dupe.innerHTML = toAdd;	
			let len = taglessLength(dupe);
			//console.log(text.isConnected);
			//text.innerHTML = dupe.innerHTML;
			async function update(value) {
				//console.log(text.isConnected);
				text.innerHTML = dupe.innerHTML; //reset
				//await console.log(text.innerHTML);
				//while (taglessLength(text) > value * len && i < 3) { 
				await HTMLsnip(text, Math.floor(len - value * len));
				//	i++;
				//}
			//	await console.log(text.innerHTML);
			}
			interpolate(0, 1, 0, 0, 100, update, () => {
				//console.log(dupe.innerHTML);
				//console.log(text.innerHTML);
				//co/nsole.log(text.isConnected);
				text.innerHTML = dupe.innerHTML;
				dupe.remove();
				//console.log("finished"); 
				resolve();
			});
		} else {	
			text.innerHTML = toAdd;
			resolve();
		}
	});
}

function removeText(element) {
	if (element) { element.remove(); }
}

async function updateText(element, content) {
	console.log("updating text");
	return;
}

