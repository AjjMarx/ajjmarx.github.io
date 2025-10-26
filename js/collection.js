const supportedFuctions = {
        "header"   : true,
        "pageStack": true,
        "body"     : true,
        "text"     : true,
        "center"   : true,
        "icon"     : true,
        "img"      : true,
        "toggle"   : true,
	"footer"   : true
}

const spawnFunctions = {
        "header"   : addHeader,
        "pageStack": addPageStack,
        "body"     : addBody,
        "text"     : addText,
        "center"   : addCenter,
        "icon"     : addIcon,
        "img"      : addImg,
        "toggle"   : addToggle,
	"footer"   : addFooter
}
/*to be added
const updateFunctions = {
        "header"   : updateHeader,
        "pageStack": updatePageStack,
        "body"     : updateBody,
        "text"     : updateText,
        "center"   : updateCenter,
        "icon"     : updateIcon,
        "img"      : updateImg,
        "toggle"   : updateToggle,
	"footer"   : updateFooter
}
*/
const removalFunctions = {
        "header"   : removeHeader,
        "pageStack": removePageStack,
        "body"     : removeBody,
        "text"     : removeText,
        "center"   : removeCenter,
        "icon"     : removeIcon,
        "img"      : removeImg,
        "toggle"   : removeToggle,
	"footer"   : removeFooter
}



