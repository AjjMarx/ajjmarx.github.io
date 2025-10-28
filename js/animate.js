function interpolate(start, target, Aslope, Bslope, mili, onUpdate) {
	return new Promise((resolve) => {
	const startTime = performance.now();
	const st = parseInt(start);
	const tg = parseInt(target);

	const diff = Math.abs(st-tg);
	const d2= mili*mili;
	const ApB = Aslope + Bslope;
	const BmA = Bslope - Aslope;
	const corr = 2*(diff - mili*(ApB/2) + Math.sqrt(d2*((ApB * ApB)/4 + (BmA * BmA)/4) - mili*ApB*diff + diff*diff))/d2;
	const M = (Bslope + corr*mili - Aslope)/(2 * corr);
	const mid = st + (corr/2) * M*M + Aslope*M + (corr/2) * M*M - (corr*mili + Bslope)*M
	
	let value = st;

	function step(time) {
		let secant = time - startTime;
		if (secant < mili) {   
			
			if (secant < M) {
				value = st + corr/2 * secant*secant + Aslope*secant; 
			} else {
				value = mid - (corr/2) * secant*secant + (corr*mili + Bslope) * secant;
			}
			onUpdate(value);
			requestAnimationFrame(step);
		} else {
			onUpdate(tg);
			resolve();
		}
	}

	requestAnimationFrame(step);
	});
}

function HTMLsnip(HTML, length) { //HTML only
	let iter = HTML.innerHTML.length-1;
	let InTag = false;
	let tally = Math.max(0, Math.min(HTML.innerHTML.length, length));
	while (iter != 0 && tally > 0) {
		if (HTML.innerHTML[iter] == '>') { InTag = true; }
		if (!InTag) {  
			tally--; 
			HTML.innerHTML = HTML.innerHTML.slice(0, iter) + HTML.innerHTML.slice(iter + 1);
		}
		if (HTML.innerHTML[iter] == '<') { InTag = false; }		
		iter--;
		if (tally < 1) { break; }
	}

	//now clean up
	let repeat = true;
	let ids = new Map();
		repeat = false;
		iter = HTML.innerHTML.length - 1;
		let currentTag = "";
		let lastTag = "";
		let distance = 0;
		let followingText = 0;
		InTag = false
		while (iter > 0) {
			if (HTML.innerHTML[iter] == '>') { InTag = true; }
			if (InTag) { currentTag = HTML.innerHTML[iter] + currentTag; }
			else { distance++; followingText++;}
			if (HTML.innerHTML[iter] == '<') {
				InTag = false;
				if (lastTag.slice(2) == currentTag.slice(1) && distance == 0) { 
					HTML.innerHTML = HTML.innerHTML.slice(0, iter) + HTML.innerHTML.slice(iter + currentTag.length + lastTag.length);
				}
				if (lastTag == "<br>" && distance == 0) {
					HTML.innerHTML = HTML.innerHTML.slice(0, iter + currentTag.length ) + HTML.innerHTML.slice(iter + currentTag.length + lastTag.length);
				}
				
				if (lastTag.indexOf("id=\"") != -1 && 
				    followingText == 0) {
					let it = lastTag.indexOf("id=\"");
					let index = lastTag.slice(it + 4,  it+ 15);
					index = index.slice(0, index.indexOf('\"'));
					return index;
				}
				lastTag = currentTag;
				distance = 0;
				currentTag = "";
			}
			iter--;
		} 
	return null;
}

function taglessLength(HTML) {
	let iter = HTML.innerHTML.length - 1;
	let InTag = false;
	let tally = 0;
	while (iter > 0) {
		if (HTML.innerHTML[iter] == '>') { InTag = true; }
		if (!InTag) { tally++; }
		if (HTML.innerHTML[iter] == '<') { InTag = false; }		
		iter--;
	} 
	return tally
}
