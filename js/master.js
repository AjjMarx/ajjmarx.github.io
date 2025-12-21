let typeHash = new Map();
let statusHash = new Map(); //adding, removing, updating, idle, none

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

let updateHash = "";
let updating = false
async function updateRoutine(hash) {
	console.log("Hash change");
	if (updating) {
		console.log("Can't load new page during an update. Logging for later");
		updateHash = window.location.hash; 
		return; 
	}
	updating = true;
	let hashCpy = hash;
	if (!hash) { hashCpy = window.location.hash; }
	console.log(hashCpy);
	try {
		const path = hashCpy.slice(1) || '/';
		const app = document.getElementById("app");
		const res = await fetch(findPageFileName(path));
		const data = await res.json();
		await updatePage(app, data);
	} catch (err) {
		console.log(err.message);
	} finally {
		updating = false;
		if (updateHash != "") {
			const cpy = updateHash;
			updateHash = "";
			await updateRoutine(cpy);
		}
	}
}

window.addEventListener("hashchange", () => {updateRoutine();});

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

function generateChildren(container, content, isAnimated) {
	for (const item of content) {
		const id = assignName(item.id);
		typeHash.set(id, item["type"]);
		spawnFunctions[item["type"]](container, item["data"], id, false, isAnimated);
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

async function updatePage(container, data) { //for swapping out JSONs, not general updates, I just use DOM for that
	return new Promise(async (resolve, reject) => {
	const oldHTML = new Map(typeHash);
	let newJSON = new Map();
	JSONrecurse(data, newJSON);

	let intersection = new Map();
	let complement = new Map(oldHTML);
	let toAdd = new Map(newJSON);
	for (const [HTMLid, HTMLtype] of oldHTML) {
		for(const [JSONid, JSONtype] of newJSON) {
			if (HTMLid == JSONid && HTMLtype == JSONtype[0]) {
				intersection.set(HTMLid, JSONtype);
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
	
	for (const [id, type] of complementTop) {
		const elem = document.getElementById(id)
		if (supportedFuctions[type]) {
			removalFunctions[type](elem);
		}
	}

	const promises = [];
	for (const [id, type] of intersection) {
		const elemId = document.getElementById(id)
		if (supportedFuctions[type[0]]) {	
			promises.push( updateFunctions[type[0]](elemId, type[1]) );
		}
	}
	await Promise.all(promises);
	
	console.log("done");
	resolve();
	
	}); 
	//console.log(statusHash);
}

function JSONrecurse(data, map) {
	if (!data) return map;
	if (data.id && data.id != "0" && data.id != 0) { map.set(parseInt(data.id, 16), [data["type"], data["data"]]); }
	if (Array.isArray(data.content)){
		data.content.forEach(child => JSONrecurse(child, map));
	}
	if (Array.isArray(data.data)){
		data.data.forEach(child => JSONrecurse(child, map));
	}
	return map
}

async function pathExists(path) {
	try {
		const res = await fetch(path, {method: 'HEAD'});
		if (res.ok == true) { return true; }
		return false;
	} catch (err) {
		console.error("File does not exist, this is expected");
		return false;
	}
}
