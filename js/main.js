window.addEventListener("DOMContentLoaded", async () => {
        const app = document.getElementById("app");

        //try {
                const res = await fetch(findPageFileName(window.location.pathname));
                const data = await res.json();

                renderPage(app, data);
        //} //catch(err) {
          //      console.error("Loading error :(");
          //      const test = document.createElement("div"); 
          //      test.innerHTML = "404";
          //      container.appendChild(test);
       // }
});

horizontalElements = 0

function renderPage(container, data) {
//        const test = document.createElement("div");
//        test.innerHTML = findPageFileName(window.location.pathname);
//        container.appendChild(test);	
	customElements.define('special-div', SpecialDiv, { extends: 'div' });

	
        for (const key of Object.keys(data)) {
                console.log(key);
        }

        for (const key of Object.keys(data.meta)) {
                console.log(key, data.meta[key]);
        }

	for (const item of data.content) {
		if(item["type"] == "header" || item["type"] == "pageStack") {
			horizontalElements++;	
		}
	}
	console.log(horizontalElements);

        for (const item of data.content) {
                //console.log(item);
                //for (const key of Object.keys(item)) {
                //        console.log(key, item[key]);
                //}
                renderFunctions[item["type"]](container, item["data"]);
        }


}

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

function header(container, data) {
        console.log("creating header..");
        const header = document.createElement("div", { is: "special-div" });
        container.appendChild(header);
        header.style.position = "relative";
        header.style.left = "-4px";
        header.style.right = "-4px"
        header.style.top = "-4px";
        header.style.height = "75px";

        let textDiv;
        for (const item of data) {
                //console.log(key);
                if (item["type"] == "text") { 
                        textDiv = renderFunctions[item["type"]](header, item["data"]);
                } else {
//                        renderFunctions[item["type"]](header, item["data"]);
                }
        }

        if (textDiv) {
                textDiv.style.position = "absolute";
                textDiv.style.height = "50%";
                textDiv.style.width = "75%";
                textDiv.style.top = "25%";
                textDiv.style.left = "12.5%";
                textDiv.style.textAlign = "center";
                textDiv.style.verticalAlign= "middle";
                textDiv.style.lineHeight =  "32px";
//                textDiv.style.background = "linear-gradient(in oklch longer hue, oklch(0.7 0.1011 230.69), oklch(0.8325 0.1406 96.22))"
//                textDiv.style.webkitBackgroundClip = "text";
//                textDiv.style.backgroundClip = "text";
//                textDiv.style.webkitTextFillColor = "transparent";
        }

	header.reload();

        console.log("Header complete");
        return header;
}

function pageStack(container, data) {
        console.log("creating pageStack..");
	const box = document.createElement("div", { is: "special-div" });   
	container.appendChild(box);
	box.style.position = "absolute";
	let wideWidth = "calc(25% - 4px)"
	let narrowWidth = "0px";
	if (parseInt(container.offsetWidth, 10) >= 700) {
		box.style.width = wideWidth;
	} else {
		box.style.width = narrowWidth;
	}
	box.style.left = "0px";
	box.style.top = "80px"; 
	box.style.bottom = "0px";
	box.reload();

		

	window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 700) {
			box.style.width = wideWidth;
			box.reload();
		} else {
			box.style.width = narrowWidth;
			box.reload(); 
		}
	});
}

function body(container, data) {
        console.log("creating body..");
        const body = document.createElement("div", { is: "special-div" });   
        container.appendChild(body);
        body.style.position = "absolute";
	let wideWidth = "calc(75% - 4px)";
	let narrowWidth = "calc(100%)";
	if (parseInt(container.offsetWidth, 10) > 700) {
		body.style.width = wideWidth;
	} else {
		body.style.width = narrowWidth;
	}
        body.style.right = "0px";
        body.style.top = "80px";
        body.style.bottom = "0px";
	let footer_allow = true
	body.reload();
        for (const item of data) {
                console.log(item);
		if (item["type"] == "footer" && footer_allow) { 
			body.style.bottom = "42px";
			body.reload();
			const footer = document.createElement("div");
			container.appendChild(footer);
			footer.style.position = "absolute";
			if (parseInt(container.offsetWidth, 10) >= 700) {
				footer.style.width = wideWidth;
			} else {
				footer.style.width = narrowWidth;
			}
			footer.style.right = "10px";
			footer.style.bottom = "8px";
			footer.style.height = "28px";
			
			footer_allow = false;

			window.addEventListener("resize", () => {
				if (parseInt(container.offsetWidth, 10) >= 700) {
					footer.style.width = wideWidth;
				} else {
					footer.style.width = narrowWidth; 
				}
			});	

			for (const footer_item of item["data"]) {
                		renderFunctions[footer_item["type"]](footer, footer_item["data"]);
			}
		} else {
                	renderFunctions[item["type"]](body, item["data"]);
		}
        }       
        window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) >= 700) {
			body.style.width = wideWidth;
			body.reload();
		} else {
			body.style.width = narrowWidth;
			body.reload(); 
		}
	});
	console.log("done rendering body");
}

function text(container, data) {
        console.log("creating text..");
        const text = document.createElement("div");
        container.appendChild(text);
	if (data["all"] != undefined) {
		text.innerHTML = data["all"];
	} else if (data["en"] != undefined) {
        	text.innerHTML = data["en"];
	} else if (data["zh"] != undefined) {
		text.innerHTML = data["zh"];
	}
        return text;
}

function center(container, data) {
        console.log("centering..");
	const body = document.createElement("div");
	body.style.textAlign = "center";
	for (const item of data) {
		renderFunctions[item["type"]](body, item["data"]);
	}
}

function icon(container, data) {
        console.log("creating icon.. unsupported");
}

function img(container, data) {
        console.log("creating image..");
	const img = document.createElement("img");
	img.src = data["file"];
	img.title = data["en_hover"];
	img.alt = data["en_hover"];
	img.style.display = "block";
	img.style.float = "left";
	img.style.margin = "1em 1em 1em 1em";
	img.style.height = '30%';
	//img.style.objectFit = "cover";
	img.style.borderRadius = "12px";
	container.appendChild(img);

	window.addEventListener("resize", () => {
		if (parseInt(container.offsetWidth, 10) > 700) {
			img.style.float = "left";
			img.style.margin = "1em 1em 1em 1em";
		} else {	
			img.style.float = "none";
			img.style.margin = "1em auto";
		}
	});
}

function toggle(container, data) {
        console.log("creating toggle..");
	
}

function footer(container, data) {
        console.log("creating footer.. unsupported");
}

const renderFunctions = {
        header,
        pageStack,
        body,
        text,
        center,
        icon,
        img,
        toggle,
	footer
}


class SpecialDiv extends HTMLDivElement {
	constructor() {
		super();
		//this.style.padding = "4px";

		this.content = document.createElement("div");
		this.appendChild(this.content);
		this.content.style.position = "absolute";
		this.content.style.width = "calc(100% - 16px)";
		this.content.style.height = "calc(100% - 16px)";
		this.content.style.top = "8px";
		this.content.style.right = "8px";
		this.content.style.padding = "10px 10% 10px 10%";
		this.content.style.overflow = "auto";
		this.content.style.textAlign = "justify";
		
		this.frame = document.createElement("div");
		this.appendChild(this.frame);
		this.frame.style.position = "absolute";
		this.frame.style.width = "100%";
		this.frame.style.height = "100%";
		this.frame.style.pointerEvents = "none";

		this.parentAppend = this.appendChild.bind(this);
        	this.appendChild = function(child) {
			this.content.appendChild(child);
		}	

		this.reload();
		window.addEventListener("resize", () => this.reload());
	}


 

	reload() {
		this.#render_box(this.clientWidth, this.clientHeight, 12, 3, 150);
	}	

	#box_svg(width, height, offst, weight, left, top, color) { 	
		const offset = Math.min(offst, Math.min(width/2, height/2));
		const handle = 2.2;
		const right = weight/2;
		const bottom = weight/2;

		let box = {};
		
		box.top = `
		    <line x1="${offset + left}" y1="${top}" x2="${width - offset - right}" y2="${top}" stroke="${color}" stroke-width="${weight}"/>
		    <path d="M ${width - right} ${offset + top} C ${width - right} ${offset/handle + top}, ${width - offset/handle - right} ${top}, ${width - offset - right} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${left} ${offset + top} C ${left} ${offset/handle + top}, ${offset/handle + left} ${top}, ${offset + left} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		`;
		 box.bottom = `
		    <line x1="${offset + left}" y1="${height - bottom}" x2="${width - offset - right}" y2="${height - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <path d="M ${width - right} ${height - offset - bottom} C ${width - right} ${height - offset/handle - bottom}, ${width - offset/handle - right} ${height - bottom}, ${width - offset - right} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${left} ${height - offset - bottom} C ${left} ${height - offset/handle - bottom}, ${offset/handle + left} ${height - bottom}, ${offset + left} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		`;
		 box.left = `
		    <line x1="${left}" y1="${offset + top}" x2="${left}" y2="${height - offset - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <path d="M ${left} ${offset + top} C ${left} ${offset/handle + top}, ${offset/handle + left} ${top}, ${offset + left} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${left} ${height - offset - bottom} C ${left} ${height - offset/handle - bottom}, ${offset/handle + left} ${height - bottom}, ${offset + left} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		`;
		 box.right = `
		    <line x1="${width - right}" y1="${offset + top}" x2="${width - right}" y2="${height - offset - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <path d="M ${width - right} ${offset + top} C ${width - right} ${offset/handle + top}, ${width - offset/handle - right} ${top}, ${width - offset - right} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${width - right} ${height - offset - bottom} C ${width - right} ${height - offset/handle - bottom}, ${width - offset/handle - right} ${height - bottom}, ${width - offset - right} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		`;
		 box.all = `
		    <line x1="${offset + left}" y1="${top}" x2="${width - offset - right}" y2="${top}" stroke="${color}" stroke-width="${weight}"/>
		    <line x1="${left}" y1="${offset + top}" x2="${left}" y2="${height - offset - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <line x1="${width - right}" y1="${offset + top}" x2="${width - right}" y2="${height - offset - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <line x1="${offset + left}" y1="${height - bottom}" x2="${width - offset - right}" y2="${height - bottom}" stroke="${color}" stroke-width="${weight}"/>
		    <path d="M ${width - right} ${offset + top} C ${width - right} ${offset/handle + top}, ${width - offset/handle - right} ${top}, ${width - offset - right} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${left} ${offset + top} C ${left} ${offset/handle + top}, ${offset/handle + left} ${top}, ${offset + left} ${top}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${width - right} ${height - offset - bottom} C ${width - right} ${height - offset/handle - bottom}, ${width - offset/handle - right} ${height - bottom}, ${width - offset - right} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		    <path d="M ${left} ${height - offset - bottom} C ${left} ${height - offset/handle - bottom}, ${offset/handle + left} ${height - bottom}, ${offset + left} ${height - bottom}" stroke="${color}" stroke-width="${weight}" fill="transparent" />
		`;

		return box;
	}

	#render_box(width, height, offst, weight, angle) {
		let lab = "oklch(0.75 0.225 ";
		let blk = this.#box_svg(width - weight/2, height - weight/2, offst - weight/2, weight, weight, weight, "black");
		let ylw = this.#box_svg(width - weight, height - weight/2, offst - weight/2, weight, weight/2, weight, lab + angle + ")");
		let grn = this.#box_svg(width - weight/2, height - weight, offst - weight/2, weight, weight, weight/2, lab + (angle+90) + ")");
		let blu = this.#box_svg(width , height - weight/2, offst - weight/2, weight, weight*1.5, weight, lab + (angle+180) + ")");
		let red = this.#box_svg(width - weight/2, height, offst - weight/2, weight, weight, weight*1.5, lab + (angle+270) + ")");
		this.frame.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' + ylw.left + ylw.right + grn.top + grn.bottom  + blu.left + blu.right + red.top + red.bottom + blk.all + '</svg>';
	//	console.log(this.innerHTML);
		//let temp = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
		//for (let i = 0; i < 360; i=i+10) {
	//		let L = Math.cos(i * 0.0174532925199) * weight/2;
//			let T = Math.sin(i * 0.0174532925199) * weight/2;
//			temp = temp + this.#box_svg(width - weight/2 + L, height - weight/2 + T, offst - weight/2, weight, weight + L, weight + T, lab + i + ")").all;
//		}
//		
//		temp += '</svg>';
//		this.innerHTML = temp;
//		console.log(this.innerHTML);
	}

}
