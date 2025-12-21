async function addPageStack(container, data, name, isAnimated) {
        console.log("creating pageStack..", data["list"]);
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

	let tp = 33;
	let list = [];

	//generate pagelist
	try {
		await fetch(data["list"])
		.then(response => response.text())
		.then(async text => {
			lines = text.split(/\n/).filter(line => line.trim() !== '');
			for (let line of lines) {
				//console.log(line[0]);
				if (line[0] == '-') {
					//console.log(line.substring(1));
					const res = await fetch(line.substring(1));
					const data = await res.json();
					console.log(res);
					console.log(data["meta"]["en_title"]);
					list.push({
						page: "#/" + line.substring(7, line.length - 5),
						title : `<p style="font-size: 22px;">` + String(data["meta"]["en_title"]) + "</p>",
						subtitle : `<p style="color: #575757;">` + String(data["meta"]["en_subtitle"]) + "</p>",
						star : (data["meta"]["star"] ?? false)
					});
				}
			}	
		}
		);
	} catch(err) {
		console.log(err);
	}

	console.log(list);

	for (let i = 0; i < list.length; i++) {
		const hyperLink = document.createElement('a');
		hyperLink.href = list[i]["page"];
		box.appendChild(hyperLink);
		const pg = document.createElement("special-div");
		//pg.style.backgroundColor = "blue";
		pg.id = assignName(0);
		typeHash.set(parseInt(pg.id, 16), "Page Stack Element");
		pg.style.position = "absolute";
		pg.style.width = (wideWidth - 14) + "px";
		pg.style.left = "14px";
		pg.style.height = "5.5em";
		pg.style.top = tp + "px";
		pg.style.overflowY = "none";
		tp = tp + 92;
		//pg.style.padding = "4px 4px 4px 4px";
		hyperLink.appendChild(pg);
		const title = document.createElement("div");
		title.style.position = "absolute";
		title.style.left = "16px";
		title.style.top = "8px";
		title.innerHTML = list[i]["title"];
		pg.appendChild(title);
		const subtitle = document.createElement("div");
		subtitle.style.position = "absolute";
		subtitle.style.left = "16px";
		subtitle.style.top = "38px";
		subtitle.innerHTML = list[i]["subtitle"];
		pg.appendChild(subtitle);
		if (list[i]["star"]) {
			const star = document.createElement("div");
			star.style.position = "absolute";
			star.style.top = "10px";
			star.style.right = "16px";
			star.title = "Important Page";
			star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#DA954B"><path d="M782.79-407q20.79-20 48.67-20 27.87 0 47.54 20l53 52q20 21.18 20 48.59Q952-279 931.86-258q-20.15 20-48 20Q856-238 836-258l-53-53q-20-20.4-20-48.2 0-27.8 19.79-47.8ZM827-865.21q20 19.79 20 47.67 0 27.87-20 48.54l-53 53q-19.4 20-47.2 20-27.8 0-48.8-19.79-20-20.79-20-48.67 0-27.87 20-47.54l53-53q20.18-21 48.09-21Q807-886 827-865.21Zm-694.21.21q19.79-21 47.67-21 27.87 0 48.54 21l53 52q20 21.18 20 48.59Q302-737 282.21-716q-20.79 20-48.67 20-27.87 0-47.54-20l-53-53q-20-20.4-20-48.2 0-27.8 19.79-47.8ZM178-407.21q20 19.79 20 47.67 0 27.87-20 48.54l-53 53q-20.4 20-48.2 20Q49-238 29-257.79 9-278.58 9-306.46 9-334.33 29-354l53-53q20.18-20 47.59-20Q157-427 178-407.21ZM411-359l69-43 70 43-19-79 64-55-82.89-8.03L480-576l-31.82 75.92L366-493l64 55-19 79Zm69-108Zm0 224-136 84q-20 12-40.36 10.12-20.35-1.87-35.5-13Q252-174 244.5-192.5T242-233l37-156-123-108q-17-14.06-22-34.03t1-37.97q6-18 21.5-31.5T195-615l160.07-14.3L417-778q9-22 26-32t37-10q20 0 37 10t26 32l61.93 148.7L766-615q23 1 38 14.5t21 31.5q6 18 1.5 38T805-497L682-389l37 157q5 22-2.63 40.37-7.63 18.38-23.37 30.82-15.18 11.07-35.59 12.94Q637-146 617-158l-137-85Z"/></svg>`;	
			pg.appendChild(star);
		}
	}	

	window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 1000) {
			//box.style.width = (wideWidth) + "px";
			//box.style.left = wideLeft;
			box.style.display = "block";
	//		box.reload();
		} else if (parseInt(container.offsetWidth, 10) < 1000) {
			//box.style.width = narrowWidth;
			//box.style.left = narrowLeft;
			box.style.display = "none";
	//		box.reload(); 
		}
	});
}

function removePageStack(element) {
	if (element) { element.remove(); }
}

async function updatePageStack(element, content) {
	console.log("updating page stack");
	return;
}

