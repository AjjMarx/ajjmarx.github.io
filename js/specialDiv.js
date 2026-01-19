class SpecialDiv extends HTMLElement {
	constructor() {
		super();
		//this.style.padding = "4px";

		this.content = null;
		this.frame = null;
			
	}

	connectedCallback() {
		this.content = document.createElement("div");
		this.content.id = 0;
		this.appendChild(this.content);
		this.content.style.position = "absolute";
		this.content.style.width = "calc(100% - 6px)";
		this.content.style.height = "calc(100% - 0px)";
		this.content.style.top = "0px";
		this.content.style.left = "4px";//"12px";
//		this.content.style.right = "8px";
		this.content.style.padding = "48px 10% 48px 10%";
		this.content.style.overflow = "auto";
		this.content.style.textAlign = "justify";
		this.content.style.backgroundColor = "white";
		
		this.frame = document.createElement("div");
		this.frame.id = 0;
		this.appendChild(this.frame);
		this.frame.style.position = "absolute";
		this.frame.style.width = "100%";
		this.frame.style.height = "100%";
		this.frame.style.pointerEvents = "none";

		this.hasAbberation = false;
		this.topAbb;

		this.parentAppend = this.appendChild.bind(this);
        	this.appendChild = (child) => {
			return this.content.appendChild(child);
		};

		this.reload();
		window.addEventListener("resize", () => this.reload());
	}

	#scroll() {
		return this.content.scrollTop;
	}
 

	reload() {
		//console.log(this.clientWidth, this.clientHeight);
		this.frame.style.width = this.getBoundingClientRect().width + "px";
		this.frame.style.height = this.getBoundingClientRect().height + "px";
		this.#render_box(this.clientWidth, this.clientHeight, 24, 3, 150);
		if (this.hasAbberation) { this.updateAbberation(); }
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

	toggleAbberation() {
		this.hasAbberation = true;
		this.topAbb = document.createElement("canvas");
		this.topAbb.style.position = "absolute";
		this.topAbb.style.pointerEvents = "none";
		this.topAbb.style.display = "none";
		
		this.topAbb.style.top = this.frame.getBoundingClientRect().top + "px";;	
		this.topAbb.style.left = "100%";//this.frame.getBoundingClientRect().left + "px";	
	
		this.parentElement.appendChild(this.topAbb);

		this.filter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		
		this.parentElement.appendChild(this.filter);

		const tempID = uniqueID();

		this.filter.innerHTML = `
		<filter id="abberate${tempID}" x="0" y="0" width="120%" height="100%" color-interpolation-filters="sRGB">
			<feImage 
				id="abberate${tempID}Image"
				color-interpolation-filters="sRGB"
				xlink:href="media/abberate.png"
				result="map"
				preserveAspectRatio = "none"
			/>
			<feDisplacementMap  
				in="SourceGraphic" 
				in2="map"
				scale="40"
				xChannelSelector="R"
				yChannelSelector="G"
				result="redDisp"
			/>		
			<feColorMatrix in="map" result="mapNeutral" type="matrix" values = "0 0 0 0 0.5
											    0 1 0 0 0	
											    0 0 1 0 0
											    0 0 0 1 0"/>
			<feDisplacementMap  
				in="SourceGraphic" 
				in2="mapNeutral"
				scale="40"
				xChannelSelector="R"
				yChannelSelector="G"
				result="greenDisp"
			/>
			<feDisplacementMap  
				in="SourceGraphic" 
				in2="map"
				scale="40"
				xChannelSelector="B"
				yChannelSelector="G"
				result="blueDisp"
			/>
			<feColorMatrix in="redDisp" result="redChannel" type="matrix" values = "0.5804 0 0 0 0
												0 0.2431 0 0 0
												0 0 0.28235 0 0
												0 0 0 1 0"/>
			<feColorMatrix in="greenDisp" result="greenChannel" type="matrix" values = "0.255 0 0 0 0
													0 0.3843 0 0 0
													0 0 0.0980 0 0
													0 0 0 1 0"/>
			<feColorMatrix in="blueDisp" result="blueChannel" type="matrix" values = "0.164 0 0 0 0
												  0 0.3725 0 0 0
												  0 0 0.61908 0 0
												  0 0 0 1 0"/>
			<feComposite 
				in="redChannel" 
				in2="blueChannel" 
				operator="arithmetic" 
				k1="0" k2="1" k3="1" k4="0"
				result="RBMix"
			/>
			<feComposite 
				in="RBMix"
				in2="greenChannel"
				operator="arithmetic" 
				k1="0" k2="1" k3="1" k4="0"
			/>
		</filter>`;

	
		this.updateAbberation();	
		
	}
	
	updateAbberation() {
		const tempID = this.filter.firstChild.nextElementSibling.id;


		this.topAbb.height = this.getBoundingClientRect().height + 28;
		this.topAbb.width = this.getBoundingClientRect().width;
		this.topAbb.style.height = this.getBoundingClientRect().height + 28 + "px";
		this.topAbb.style.width = this.getBoundingClientRect().width + "px";
		this.topAbb.style.top = this.frame.getBoundingClientRect().top - 16 + "px";;	
		this.topAbb.style.left = this.frame.getBoundingClientRect().left + "px";
		this.topAbb.style.zIndex = "100";
		
		let ctx = this.topAbb.getContext("2d");
		let topTexture = document.createElement("img");
		let botTexture = document.createElement("img");
		topTexture.src = "media/abberate.png";
		botTexture.src = "media/abberateB.png";
		
		botTexture.addEventListener("load", (e) => { 
			ctx.fillStyle = "#7F7F7F";
			ctx.fillRect(0, 0, 10000, this.topAbb.height);
			ctx.fill();
			ctx.drawImage(topTexture, 0, 20, this.topAbb.width, 20);
			ctx.fillStyle = "#0000FF";
			ctx.fillRect(0, 0, this.topAbb.width, 20);
			ctx.drawImage(botTexture, 0, this.topAbb.height-40, this.topAbb.width, 20);
			ctx.fillStyle = "#FFFF00";
			ctx.fillRect(0, this.topAbb.height-20, this.topAbb.width, this.topAbb.height);
			const abbURL = this.topAbb.toDataURL("image/png");
			document.getElementById(`${tempID}Image`).setAttribute("xlink:href", abbURL);
			this.content.style.filter = `url(#${tempID})`;
			this.content.style.height = "calc(100% + 28px)";
			this.content.style.top = "-10px";

			ctx.clearRect(0, 0, this.topAbb.width, this.topAbb.height);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 40, this.topAbb.width, this.topAbb.height - 74);
			ctx.fillRect(22, 20, this.topAbb.width - 44, this.topAbb.height - 34);
			ctx.beginPath();
			ctx.arc(22, 40, 20, 0, 2 * Math.PI);
			ctx.arc(this.topAbb.width - 22, 40, 20, 0, 2 * Math.PI);
			ctx.arc(this.topAbb.width - 22, this.topAbb.height-34, 20, 0, 2 * Math.PI);
			ctx.arc(22, this.topAbb.height - 34, 20, 0, 2 * Math.PI);
			ctx.fill();

			const maskURL = this.topAbb.toDataURL("image/png");
			this.content.style.maskImage = `url(${maskURL})`;
			this.content.style.maskRepeat = "no-repeat";
			//this.content.style.maskPosition = "center";
		});
	}

}


