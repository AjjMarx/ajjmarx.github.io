function addPageStack(container, data, name) {
        //console.log("creating pageStack..");
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

	for (let i = 0; i < 10; i++) {
		const pg = document.createElement("special-div");
		//pg.style.backgroundColor = "blue";
		pg.id = assignName(0);
		typeHash.set(pg.id, "Page Stack Element");
		pg.style.position = "absolute";
		pg.style.width = (wideWidth - 14) + "px";
		pg.style.left = "14px";
		pg.style.height = "6em";
		pg.style.top = tp + "px";
		tp = tp + 100;
		//pg.style.padding = "4px 4px 4px 4px";
		//pg.reload();
		box.appendChild(pg);
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

