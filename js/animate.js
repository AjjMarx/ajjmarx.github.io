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

	async function step(time) {
		let secant = time - startTime;
		if (secant < mili) {   
			
			if (secant < M) {
				value = st + corr/2 * secant*secant + Aslope*secant; 
			} else {
				value = mid - (corr/2) * secant*secant + (corr*mili + Bslope) * secant;
			}
			await onUpdate(value);
			requestAnimationFrame(step);
		} else {
			await onUpdate(tg);
			resolve();
		}
	}

	requestAnimationFrame(step);
	});
}

async function HTMLsnip(HTML, length) { //HTML only
	let node = deepest(HTML, (nothing) => { return true; });
	let ticker = length;

	while (ticker > 0) {
		if ((node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) && node.localName != 'img') {
			if (node.textContent.length <= length) {
				node.remove();
				ticker -= node.textContent.length;	
			} else {
				node.textContent = node.textContent.substring(0, node.textContent.length - length); 
				ticker = 0;	
			}
		} else if (true) {
			if (node.id && supportedFuctions[node.localName]) {
				await removalFunctions[node.localName](node.id);
			} else { node.remove(); }
		} 
		node = deepest(HTML, (nothing) => { return true; })
		ticker--;
	}
	//console.log(node);
	//return null;
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

function deepest(HTML, condition) {
	let cpy = HTML
	while (cpy && cpy.lastElementChild && condition(cpy.lastChild) === true) {
		cpy = cpy.lastChild;
	}
	return cpy;
}
