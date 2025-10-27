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
	while (repeat) {
		repeat = false;
		iter = 0;
		let last4 = "";
		let currentTag = "";
		let lastTag = "";
		let distance = 0;
		InTag = false
		while (iter < HTML.innerHTML.length) {
			if (HTML.innerHTML[iter] == '<') { InTag = true; }
			if (InTag) { currentTag += HTML.innerHTML[iter]; }
			else { distance++; }
			if (HTML.innerHTML[iter] == '>') { 
				InTag = false;
				if (lastTag.slice(1) == currentTag.slice(2) && distance == 0) { 
					HTML.innerHTML = HTML.innerHTML.slice(0, iter - currentTag.length - lastTag.length) + HTML.innerHTML.slice(iter);
					repeat = true;
				}
				if (lastTag == "<br>" && distance == 0) {
					HTML.innerHTML = HTML.innerHTML.slice(0, iter - currentTag.length - lastTag.length + 1) + HTML.innerHTML.slice(iter - currentTag.length + 1);
				}
				if (lastTag.indexOf("id=\"") != -1 && 
				    (lastTag.slice(1, 4) == currentTag.slice(2,5)) && 
				    distance == 0) {
					let it = lastTag.indexOf("id=\"");
					let index = HTML.innerHTML.slice(it + 4,  it+ 10);
					index = index.slice(0, index.indexOf('\"'));
					let toRemove = document.getElementById(index);
					if (toRemove && toRemove.innerHTML == "") { 
				//		console.log("div or img to remove: " + index );
				//		console.log(toRemove);
						toRemove.remove();
				//		console.log("removed"); 
					}
				}
				//console.log("a"); 
				lastTag = currentTag;
				distance = 0;
				currentTag = "";
			}
			iter++;
		} 
	}
//	console.log(HTML.innerHTML);
	//console.log(ids);
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
