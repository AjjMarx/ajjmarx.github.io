function addImg(container, data, name) {
        //console.log("creating image..");
	const img = document.createElement("img");
	img.id = assignName(name);
	img.src = data["file"];
	img.title = data["en_hover"];
	img.alt = data["en_hover"];
	img.style.display = "block";
	img.style.width = Math.min(container.offsetWidth * 0.8 * data["width"], 560) + "px";
	if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
		img.style.float = "none";
		img.style.margin = "1em auto";
	} else {	
		img.style.float = data["location"];
		img.style.margin = "1em 1em 1em 1em";
	}
	img.style.borderRadius = "12px";
	container.appendChild(img);

	window.addEventListener("resize", () => {
		img.style.width = container.offsetWidth * 0.8 * data["width"] + "px";
		if (0.8 * container.offsetWidth * 0.8 - container.offsetWidth * 0.8 * data["width"] < 150 || data["location"] == "center") {
			img.style.float = "none";
			img.style.margin = "1em auto";
		} else {	
			img.style.float = data["location"];
			img.style.margin = "1em 1em 1em 1em";
		}
	});
}

function removeImg(element) {
	if (element) { element.remove(); }
}

async function updateImg(element) {
	console.log("updating image");
	return;
}

