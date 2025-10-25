let globalIDCounter = 0;
function uniqueID() {
	globalIDCounter += Math.floor(Math.random()*15) + 1;
	return globalIDCounter + 65536
}

function assignName(name) {
	if (!name || name == "0" || name == 0 || name == "0x0") { return uniqueID(); }
	if (typeof(name) == "number") { return name; }
	return parseInt(name,16);
}
