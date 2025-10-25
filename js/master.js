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
          //      test.innerHTML = "404";
          //      container.appendChild(test);
       // }
});

window.addEventListener("hashchange", async() => {
	const path = window.location.hash.slice(1) || '/';
	const app = document.getElementById("app");
	const res = await fetch(findPageFileName(path));
	const data = await res.json();
	//console.log(typeof(app.innerHTML));
	//app.innerHTML = "";
	updatePage(app, data);
});

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

horizontalElements = 0

function renderPage(container, data) {
//        const test = document.createElement("div");
//        test.innerHTML = findPageFileName(window.location.pathname);
//        container.appendChild(test);	
	console.log(findPageFileName(window.location.hash.slice(1)));
	
        for (const key of Object.keys(data)) {
                //console.log(key);
        }

        for (const key of Object.keys(data.meta)) {
                //console.log(key, data.meta[key]);
        }

	for (const item of data.content) {
		if(item["type"] == "header" || item["type"] == "pageStack") {
			horizontalElements++;	
		}
	}
	//console.log(horizontalElements);

        for (const item of data.content) {
                //console.log(item);
                //for (const key of Object.keys(item)) {
                //        console.log(key, item[key]);
                //}
                spawnFunctions[item["type"]](container, item["data"], item.id);
        }

	//console.log(window.location.pathname);
}

function updatePage(container, data) { //for swapping out JSONs, not general updates, I just use DOM for that
//Start by matching up trees by ID, 
//Matching nodes get transition animations
//Fade out originals with no match
//Fade in any new elements with no match
	//console.log(container);
	specialDivs = Array.from(container.getElementsByTagName('special-div'));
	normalDivs = specialDivs.concat(Array.from(container.getElementsByTagName('div')));
	const divs = normalDivs.concat(Array.from(container.getElementsByTagName('img')));
	console.log("Locating live elements in container that have valid IDs");
	let oldHTML = [];
	for (const elm of divs) {
		if (elm.id && elm.id != "0" && elm.id != 0) { //console.log(parseInt(elm.id).toString(16)); }
			oldHTML.push(parseInt(elm.id));
		}
	}
	console.log(oldHTML);
	console.log("Locating elements in " + findPageFileName(window.location.hash.slice(1)) + " with valid IDs");
	
	let newJSON = [];
	JSONrecurse(data, newJSON);
	console.log(newJSON);

	//Given how small these arrays are it makes most sense to just do a number of linear searches
	console.log("Shared elements:");
	let intersection = [];
	for (const HTMLnum of oldHTML) {
		for(const JSONnum of newJSON) {
			if (HTMLnum == JSONnum) {
				intersection.push(HTMLnum);
				//oldHTML.splice(oldHTML.indexOf(HTMLnum), 1);
				//newJSON.splice(newJSON.indexOf(JSONnum), 1);
				break;
			}
		} 
	}
	console.log(intersection);
}

function JSONrecurse(data, arr) {
	if (!data) return arr;
	if (data.id && data.id != "0" && data.id != 0) { arr.push(parseInt(data.id,16)); }
	if (Array.isArray(data.content)){
		data.content.forEach(child => JSONrecurse(child, arr));
	}
	if (Array.isArray(data.data)){
		data.data.forEach(child => JSONrecurse(child, arr));
	}
	return arr
}

