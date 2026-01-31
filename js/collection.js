const supportedFuctions = {
        "header"   : true,
        "pageStack": true,
        "body"     : true,
        "text"     : true,
        "center"   : true,
	"span"     : true,
        "icon"     : true,
        "img"      : true,
        "toggle"   : false,
	"footer"   : true,
	"line"     : true,
	"graph"	   : true,
	"citation" : false,
	"katex"    : true
}

const spawnFunctions = {
        "header"   : addHeader,
        "pageStack": addPageStack,
        "body"     : addBody,
        "text"     : addText,
        "center"   : addCenter,
	"span"	   : addSpan,
        "icon"     : addIcon,
        "img"      : addImg,
        "toggle"   : addToggle,
	"footer"   : addFooter,
	"line"     : addLine,
	"graph"	   : addGraph,
	"katex"	   : addKatex
}

const updateFunctions = {
        "header"   : updateHeader,
        "pageStack": updatePageStack,
        "body"     : updateBody,
        "text"     : updateText,
        "center"   : updateCenter,
	"span"	   : updateSpan,
        "icon"     : updateIcon,
        "img"      : updateImg,
        "toggle"   : updateToggle,
	"footer"   : updateFooter,
	"line"     : updateLine,
	"graph"	   : updateGraph,
	"katex"	   : updateKatex
}

const removalFunctions = {
        "header"   : removeHeader,
        "pageStack": removePageStack,
        "body"     : removeBody,
        "text"     : removeText,
        "center"   : removeCenter,
	"span"	   : removeSpan,
        "icon"     : removeIcon,
        "img"      : removeImg,
        "toggle"   : removeToggle,
	"footer"   : removeFooter,
	"line"     : removeLine,
	"graph"	   : removeGraph,
	"katex"    : removeKatex
}



