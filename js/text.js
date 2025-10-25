function addText(container, data, name) {
        //console.log("creating text..");
        const text = document.createElement("div");
        container.appendChild(text);
	text.id = assignName(name);
	if (data["all"] != undefined) {
		text.innerHTML = data["all"];
	} else if (data["en"] != undefined) {
        	text.innerHTML = data["en"];
	} else if (data["zh"] != undefined) {
		text.innerHTML = data["zh"];
	}
        return text;
}


