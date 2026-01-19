function interpolate(start, target, Aslope, Bslope, mili, onUpdate, onComplete) {
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
			await onComplete();
			resolve();
		}
	}

	requestAnimationFrame(step);
	});
}

async function HTMLsnip(HTML, length) { //HTML only
	let node = deepest(HTML, (x) => { return true; });
	let ticker = length;

	while (ticker > 0 && node && node != HTML) {
		//console.log(node.sType);
		if ((node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) && node.localName != 'img' && node.localName != 'svg') {
			if (node.textContent.length <= ticker) {
				node.remove();
				ticker -= node.textContent.length;	
			} else {
				node.textContent = node.textContent.substring(0, node.textContent.length - ticker); 
				ticker = 0;	
			}
		} else if (true) {
			if (node.id && supportedFuctions[node.localName]) {
				await removalFunctions[node.localName](node.id);
			} else if (node != HTML) { 
				node.remove(); 
			}
		} 
		node = deepest(HTML, (nothing) => { return true; })
		ticker--;
	}
}

function taglessLength(HTML) {
	let tally = 0;
	//console.log(HTML);
	tally += HTML.innerHTML.length;
	Array.from(HTML.children).forEach((child) => {tally += taglessLength(child);});
	return tally
}

function deepest(HTML) {
	if (!HTML.hasChildNodes()) { return HTML; }
	return deepest(HTML.lastChild);
}
