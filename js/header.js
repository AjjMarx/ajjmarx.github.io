function addHeader(container, data, name) {
        //console.log("creating header..");
	const header = document.createElement("div");
        const title = document.createElement("special-div");
        header.id = assignName(name);
	container.appendChild(header);
	header.style.position = "absolute";
	header.style.top = "0px";
	header.style.left = "0px";
	header.style.width = "100%";
	header.style.height = "4em";
	header.style.minWidth = "calc(100vh * (0.5))";

	header.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' + '<line x1="0px" y1="calc(50% - 1.5px)" x2="100%" y2="calc(50% - 1.5px)" stroke="oklch(0.75 0.225 240)" stroke-width="3px"/>' + '<line x1="0px" y1="calc(50% + 1.5px)" x2="100%" y2="calc(50% + 1.5px)" stroke="oklch(0.75 0.225 60)" stroke-width="3px"/>' + '<line x1="0px" y1="50%" x2="100%" y2="50%" stroke="black" stroke-width="3px"/>' + '</svg>'; 

	header.appendChild(title);
	title.id = assignName(0);
        title.style.position = "absolute";
        title.style.top = "8px";
	title.style.width = "396px";
        title.style.height = "3.5em";
	title.content.style.height = "100%";
	title.content.style.overflow = "hidden";
	title.style.left = "calc(50% - 196px)"
	title.content.style.padding = "0px 0px 0px 0x";	
	title.style.padding = "0px 0px 0px 0x";	

	//title.content.style.display = "flex";
	title.content.style.height = "3em";
	title.content.style.top = "-4px";
	//title.content.style.justifyContent = "center";
	//title.content.style.alignItems = "center";
	title.content.innerHTML += data.find(item => item["type"] == "text")["data"]["all"];

	title.reload();

        //console.log("Header complete");
        return header;
}

