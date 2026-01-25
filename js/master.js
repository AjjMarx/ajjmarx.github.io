let typeHash = new Map();
let statusHash = new Map(); //adding, removing, updating, idle, none

let mainIconManager;

window.addEventListener("DOMContentLoaded", async () => {
        const app = document.getElementById("app");
	customElements.define('special-div', SpecialDiv);
	console.log(window.location);
	console.log(window.location.pathname);
	const filePath = findPageFileName(window.location.pathname);
        //console.log(findPageFileName(window.location.hash.slice(1)));
	let res;
	try {
		console.log(filePath);
                res = await fetch(filePath);
		if (!res.ok) {
			console.log(filePath, "404");
			window.location.pathname = "/404";
			res = await fetch("pages/404.json");
		}
	} catch(err) {
		console.errorr(err);
	}
                const data = await res.json();
	try {

		const iconListRes = await fetch("media/icons/iconList.json");
		const iconListData = await iconListRes.json();

		window.mainIconManager = new IconManager("media/icons", iconListData.list);
	
                renderPage(app, data);
        } catch(err) {
                console.error("Loading error :", err);
                const test = document.createElement("div"); 
        }
});

let updateHash = "";
let updating = false
async function updateRoutine() {
	console.log("URL change");
	if (updating) {
		console.log("Can't load new page during an update. Logging for later");
		return; 
	}
	updating = true;
	const path = window.location.pathname;
	console.log(window.location.pathname);
	const app = document.getElementById("app");
	let res;

	try {
		res = await fetch(findPageFileName(path));
		if (!res.ok) {
			console.log("File does not exist");
			window.location.hash = "/404";
			res = await fetch('page/404.json');
		}
	} catch (err){
		console.error(err);
	}

	try {
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

window.addEventListener("popstate", () => {updateRoutine();});

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

async function generateChildren(container, content, isAnimated) {
	for (const item of content) {
		const id = assignName(item.id);
		typeHash.set(id, item["type"]);
		if (item["type"] in supportedFuctions && supportedFuctions[item["type"]]) {
			await spawnFunctions[item["type"]](container, item["data"], id, isAnimated);
		}
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
		if (type[0] in supportedFuctions && supportedFuctions[type[0]]) {	
			promises.push( updateFunctions[type[0]](elemId, type[1], true) );
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
