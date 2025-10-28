let typeHash = new Map();
let statusHash = new Map();

window.addEventListener("DOMContentLoaded", async () => {
        const app = document.getElementById("app");
	customElements.define('special-div', SpecialDiv);
	const filePath = findPageFileName(window.location.hash.slice(1));
        //console.log(findPageFileName(window.location.hash.slice(1)));
	//try {
                const res = await fetch(filePath);
                const data = await res.json();
	
                renderPage(app, data);
        //} //catch(err) {
          //      console.error("Loading error :(");
          //      const test = document.createElement("div"); 
          //      test.innerHTML = "404", 16;
          //      container.appendChild(test);
       // }
});

window.addEventListener("hashchange", async() => {
	const path = window.location.hash.slice(1) || '/';
	const app = document.getElementById("app");
	const res = await fetch(findPageFileName(path));
	const data = await res.json();
	updatePage(app, data);
});

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

function generateChildren(container, content) {
	for (const item of content) {
		const id = assignName(item.id);
		typeHash.set(id, item["type"]);
		spawnFunctions[item["type"]](container, item["data"], id);
	}
}

horizontalElements = 0

function renderPage(container, data) {
	console.log(findPageFileName(window.location.hash.slice(1)));

	for (const item of data.content) {
		if(item["type"] == "header" || item["type"] == "pageStack") {
			horizontalElements++;	
		}
	}
        generateChildren(container, data.content);
}

function updatePage(container, data) { //for swapping out JSONs, not general updates, I just use DOM for that
//Start by matching up trees by ID, 
//Matching nodes get transition animations
//Fade out originals with no match
//Fade in any new elements with no match
	//console.log(container);
	console.log("Locating live elements in container that have valid IDs");
	const oldHTML = new Map(typeHash);
	console.log(oldHTML);
	console.log("Locating elements in " + findPageFileName(window.location.hash.slice(1)) + " with valid IDs");
	
	let newJSON = new Map();
	JSONrecurse(data, newJSON);
	console.log(newJSON);

	//Given how small these arrays are it makes most sense to just do a number of linear searches
	console.log("Shared elements:");
	let intersection = new Map();
	let complement = new Map(oldHTML);
	let toAdd = new Map(newJSON);
	for (const [HTMLid, HTMLtype] of oldHTML) {
		for(const [JSONid, JSONtype] of newJSON) {
			if (HTMLid == JSONid && HTMLtype == JSONtype) {
				intersection.set(HTMLid, HTMLtype);
				complement.delete(HTMLid);
				toAdd.delete(JSONid);
				break;
			}
		} 
	}
	let complementTop = new Map();
	for (const [id, type] of complement) {
		for (const child of container.children) {
			if (id == child.id) {
				complementTop.set(id, type);
			}
		}
	}
	console.log(intersection);
	console.log("Elements to be removed");
	console.log(complement);
	console.log("Top children to be removed");
	console.log(complementTop)
	console.log("Fresh elements to add");
	console.log(toAdd);
	
	console.log("Removing undesired elements..");
	for (const [id, type] of complementTop) {
		const elem = document.getElementById(id)
		if (supportedFuctions[type]) {
			//console.log(type);
			removalFunctions[type](elem);
		}
	}

	console.log("Updating elements..");
	for (const [id, type] of intersection) {
		const elem = document.getElementById(id)
		if (supportedFuctions[type]) {
			updateFunctions[type](elem);
		}
	} 
}

function JSONrecurse(data, map) {
	if (!data) return map;
	if (data.id && data.id != "0" && data.id != 0) { map.set(parseInt(data.id, 16), data["type"]); }
	if (Array.isArray(data.content)){
		data.content.forEach(child => JSONrecurse(child, map));
	}
	if (Array.isArray(data.data)){
		data.data.forEach(child => JSONrecurse(child, map));
	}
	return map
}

