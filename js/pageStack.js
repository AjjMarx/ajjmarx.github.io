async function addPageStack(container, data, name, isAnimated) {
        //console.log("creating pageStack..", data);
	const box = document.createElement("div");
	box.id = assignName(name);   
	container.appendChild(box);
	box.style.position = "absolute";
	let wideWidth = 302;
	let wideLeft = "calc((100% - 1000px) / 2)";
	box.style.width = (wideWidth ) + "px";
	box.style.left = wideLeft;
	if (parseInt(container.offsetWidth, 10) >= 1000) {
		box.style.display = "block";
	} else {
		box.style.display = "none";
	}
	box.style.padding = "4px 4px 4px 4px";
	box.style.top = "calc(2em + 3px)"; 
	box.style.bottom = "0px";
	//box.style.backgroundColor = "yellow";
	box.style.overflow = "auto";	
	//box.reload();
	box.style.direction = 'rtl';
	box.directory = data["list"];

	let list = [];

	try {
		await fetch(data["list"])
		.then(response => response.text())
		.then(async text => {
			lines = text.split(/\n/).filter(line => line.trim() !== '');
			for (let line of lines) {
				if (line[0] == '-') {
					if (line.indexOf("*") != -1) {
						let i = 0;
						console.log(line.substring(1, line.indexOf("*")) + i + line.substring(line.indexOf("*")+1));
						while (i < 10000 && await pathExists(line.substring(1, line.indexOf("*")) + i + line.substring(line.indexOf("*")+1))) { i++; }
						i--;
						while (i >= 0 && await pathExists(line.substring(1, line.indexOf("*")) + i + line.substring(line.indexOf("*")+1))) {
							const lineP = line.substring(1, line.indexOf("*")) + i + line.substring(line.indexOf("*")+1);
							const res = await fetch(line.substring(1, line.indexOf("*")) + i + line.substring(line.indexOf("*")+1));
							const data = await res.json();
							list.push({
								page: "#/" + lineP.substring(6, lineP.length - 5),
								title : `<p style="font-size: 22px;">` + String(data["meta"]["en_title"]) + "</p>",
								subtitle : `<p style="color: #575757;">` + String(data["meta"]["en_subtitle"]) + "</p>",
								tags : (data["meta"]["tags"])
							});
							i--;
						}						
					} else {
						const res = await fetch(line.substring(1));
						const data = await res.json();
						console.log(data["meta"]);
						list.push({
							page: "#/" + line.substring(7, line.length - 5),
							title : `<p style="font-size: 22px;">` + String(data["meta"]["en_title"]) + "</p>",
							subtitle : `<p style="color: #575757;">` + String(data["meta"]["en_subtitle"]) + "</p>",
							tags : (data["meta"]["tags"])
						});
					}
				}
			}	
		}
		);
	} catch(err) {
		console.log(err);
	}

	//console.log(list);
	box.pgList = [];
	let tp = 2.1;

	for (let i = 0; i < list.length; i++) {
		const hyperLink = document.createElement('a');
		hyperLink.href = list[i]["page"];
		box.pgList.push(hyperLink);
		box.appendChild(hyperLink);
		const pg = document.createElement("special-div");
		//pg.style.backgroundColor = "blue";
		pg.id = assignName(0);
		typeHash.set(parseInt(pg.id, 16), "Page Stack Element");
		pg.style.position = "absolute";
		pg.style.right = "0px";
		pg.style.left = "14px";
		pg.style.height = "5.5em";
		pg.style.top = tp + "em";
		pg.style.overflowY = "none";
		tp = tp + 5.7;
		hyperLink.appendChild(pg);
		const title = document.createElement("div");
		title.style.position = "absolute";
		title.style.left = "16px";
		title.style.top = "14px";
		title.style.whiteSpace = "nowrap";
		title.style.overflow = "hiden";
		title.innerHTML = list[i]["title"];
		pg.appendChild(title);
		const subtitle = document.createElement("div");
		subtitle.style.position = "absolute";
		subtitle.style.left = "16px";
		subtitle.style.top = "44px";
		subtitle.style.whiteSpae = "nowrap",
		subtitle.style.overflow = "hidden",
		subtitle.innerHTML = list[i]["subtitle"];
		pg.appendChild(subtitle);
		if (list[i]["tags"]) {
			const badgeBar = document.createElement("div");
			badgeBar.style.position = "absolute";
			badgeBar.style.top = badgeBar.style.right = "8px";
			badgeBar.style.width = "4em";
			badgeBar.style.height = "1em";
			badgeBar.style.zIndex = "1";
			badgeBar.style.lineHeight = "0px";
			pg.appendChild(badgeBar);
			for (tagI in list[i]["tags"]) {
				const tag = list[i]["tags"][tagI];
				await addIcon(badgeBar,
					{
						"name" : tag,
						"size" : "small",
						"color" : convertedCols[(parseInt(tagI) + i) % 8],
					},
				0, false);
			}
		}
	}	

	window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 1000) {
			box.style.display = "block";
		} else if (parseInt(container.offsetWidth, 10) < 1000) {
			box.style.display = "none";
		}
	});
}

convertedCols = ["#F579A4", "#F5824A", "#C89C00", "#70B346", "#00B99F", "#00B0E7", "#7E9CFF", "#CC86EB"];

async function removePageStack(element) {
	if (element) {
	console.log("removing page stack");		
	return new Promise((resolve) => {
		interpolate(40, 302, 0, 0, 500, async (value) => {
			element.style.width = 302 - value + 40 + "px";
			for (chld of element.pgList) { if (chld.firstChild.tagName === 'SPECIAL-DIV') { chld.firstChild.reload(); } }
		}, () => {if (element) { element.remove(); resolve();}})
	});
	}
}

async function updatePageStack(element, content) {
	console.log("updating page stack");
	if (element.directory && element.directory == content["list"]) { console.log("unchanged page stack"); return; }		
	return new Promise(async (resolve) => {
		console.log("Changing Page Stack");
		let oldId = element.id;	
		let parentElement = element.parentElement;
		await addPageStack(parentElement, content, 999999, true);
		newElement = document.getElementById("999999");
		newElement.style.left = "";
		newElement.style.right = "calc((100% + 1000px) / 2 - 302px)";
		interpolate(40, 300, 0, 0, 500, async (value) => {
			element.style.width = 302 - value + "px";
			newElement.style.width = value + "px";
			for (chld of element.pgList) { if (chld.firstChild.tagName === 'SPECIAL-DIV') { chld.firstChild.reload(); } }
			for (chld of newElement.pgList) { if (chld.firstChild.tagName === 'SPECIAL-DIV') { chld.firstChild.reload(); } }
		}, () => {
			element.remove();
			newElement.id = oldId;
			newElement.style.right = "";
			newElement.style.width = "302px";
			newElement.style.left = "calc((100% - 1000px) / 2)";
			resolve();
		})
	});
}

