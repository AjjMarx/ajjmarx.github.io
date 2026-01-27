function addKatex (container, data, name, isAnimated) {
	console.log("adding KaTeX");
	const wrapper = document.createElement("div");
	wrapper.id = assignName(name);
	container.appendChild(wrapper);
	wrapper.style.width = "1px";
	wrapper.style.whiteSpace = "nowrap"
	katex.render(data["tex"], wrapper, {throwOnError: false});
	if (wrapper.firstChild) { wrapper.firstChild.style.fontSize = data["size"] + "em" }
}

function updateKatex(element, content, isAnimated) {
	console.log("updating KaTeX");
}

function removeKatex(element, isAnimated) {
	console.log("removing KaTeX");
	element.remove();
}
