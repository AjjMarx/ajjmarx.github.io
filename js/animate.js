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
//	console.log(st + " " + tg + " " +M + " " + mid + " " + corr);

	function step(time) {
		let secant = time - startTime;
		if (secant < mili) {   
			
			if (secant < M) {
				value = st + corr/2 * secant*secant + Aslope*secant; 
//				console.log(Math.floor(secant) + " a" + M + "  " + value);
				//console.log(st + corr/2 * secant*secant + Aslope*secant);
			} else {
				value = mid - (corr/2) * secant*secant + (corr*mili + Bslope) * secant;
//				console.log(Math.floor(secant) + ' d'+ M + "  " + value);
				//console.log((-corr/2) * secant*secant + (corr*mili + Bslope) * secant); 
			}
			//if (updateFunc) { updateFunc() };
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
	//console.log(HTML.innerHTML);
	//let text = HTML.innerHTML;
	let iter = HTML.innerHTML.length-1;
	let InTag = false;
	let tally = Math.max(0, Math.min(HTML.innerHTML.length, length));
	while (iter != 0 && tally > 0) {
		//console.log(iter + " " + tally);
		if (HTML.innerHTML[iter] == '>') { InTag = true; }
		if (!InTag) {  
			tally--; 
			//console.log(HTML.innerHTML[iter] + " : " + tally);
			HTML.innerHTML = HTML.innerHTML.slice(0, iter) + HTML.innerHTML.slice(iter + 1);
		}
		if (HTML.innerHTML[iter] == '<') { InTag = false; }		
		iter--;
		if (tally < 1) { break; }
	}

	//now clean up
	iter = 0;
	let currentTag = "";
	let lastTag = "";
	InTag = false
	while (iter != HTML.innerHTML.length-1) {
		if (HTML.innerHTML[iter] == '<') { InTag = true; }
		if (InTag) { currentTag += HTML.innerHTML[iter]; }
		if (HTML.innerHTML[iter] == '>') { 
			InTag = false;
			console.log(lastTag + "  " + currentTag);
			lastTag = currentTag; 
			currentTag = ""; 
		}
		iter++;
	} 
}

function taglessLength(HTML) {
	let iter = HTML.innerHTML.length - 1;
	let InTag = false;
	let tally = 0;
	while (iter != 0) {
		if (HTML.innerHTML[iter] == '>') { InTag = true; }
		if (!InTag) { tally++; }
		if (HTML.innerHTML[iter] == '<') { InTag = false; }		
		iter--;
	} 
	return tally
}
