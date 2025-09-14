window.addEventListener("DOMContentLoaded", async () => {
        const app = document.getElementById("app");

        try {
                const res = await fetch(findPageFileName(window.location.pathname));
                const data = await res.json();

                renderPage(app, data);
        } catch(err) {
                console.error("Loading error :(");
                const test = document.createElement("div"); 
                test.innerHTML = "404";
                container.appendChild(test);
        }
});

function renderPage(container, data) {
//        const test = document.createElement("div");
//        test.innerHTML = findPageFileName(window.location.pathname);
//        container.appendChild(test);

        for (const key of Object.keys(data)) {
                console.log(key);
        }

        for (const key of Object.keys(data.meta)) {
                console.log(key, data.meta[key]);
        }

        for (const item of data.content) {
                //console.log(item);
                //for (const key of Object.keys(item)) {
                //        console.log(key, item[key]);
                //}
                renderFunctions[item["type"]](container, item["data"]);
        }


}

function findPageFileName(name) {
        if(name == "/") {
                return "pages/home.json";
        } 
        return "pages" + name + ".json";
}

function header(container, data) {
        console.log("creating header..");
        const header = document.createElement("div");
        container.appendChild(header);
        header.style.position = "absolute";
        header.style.left = "-4px";
        header.style.right = "-4px"
        header.style.top = "-4px";
        header.style.height = "75px";
        header.style.borderRadius = "0px 0px 2em 2em";
        header.style.border = "4px solid black";

        let textDiv;
        for (const item of data) {
                //console.log(key);
                if (item["type"] == "text") { 
                        textDiv = renderFunctions[item["type"]](header, item["data"]);
                } else {
//                        renderFunctions[item["type"]](header, item["data"]);
                }
        }

        if (textDiv) {
                textDiv.style.position = "relative";
                textDiv.style.height = "50%";
                textDiv.style.width = "50%";
                textDiv.style.top = "25%";
                textDiv.style.left = "25%";
                textDiv.style.textAlign = "center";
                textDiv.style.verticalAlign= "middle";
                textDiv.style.lineHeight =  "32px";
//                textDiv.style.background = "linear-gradient(in oklch longer hue, oklch(0.7 0.1011 230.69), oklch(0.8325 0.1406 96.22))"
//                textDiv.style.webkitBackgroundClip = "text";
//                textDiv.style.backgroundClip = "text";
//                textDiv.style.webkitTextFillColor = "transparent";
        }

        console.log("Header complete");
        return header;
}

function pageStack(container, data) {
        console.log("creating pageStack..");
        const box = document.createElement("div");   
        container.appendChild(box);
        box.style.position = "absolute";
        box.style.width = "25%";
        box.style.left = "4px";
        box.style.top = "75px"; 
        box.style.bottom = "4px";
        box.style.borderRadius = "2em 2em 2em 2em";
        box.style.border = "4px solid black";
}

function body(container, data) {
        console.log("creating body..");
        const body = document.createElement("div");
        container.appendChild(body);
        body.style.position = "absolute";
        body.style.width = "calc(75% - 12px)";
        body.style.right = "4px";
        body.style.top = "75px";
        body.style.bottom = "4px";
        body.style.borderRadius = "2em 2em 2em 2em";
        body.style.border = "4px solid black";
        for (const item of data) {
                //console.log(key);
 //               renderFunctions[item["type"]](container, item["data"]);
        }       
        console.log("done rendering body");
}

function text(container, data) {
        console.log("creating text..");
        const text = document.createElement("div");
        container.appendChild(text);
        text.innerHTML = data;
        return text;
}

function center(container, data) {
        console.log("centering..");
        console.log("done centering");
}

function icon(container, data) {
        console.log("creating icon..");
}

function img(container, data) {
        console.log("creating image..");
}

function toggle(container, data) {
        console.log("creating toggle..");
}

const renderFunctions = {
        header,
        pageStack,
        body,
        text,
        center,
        icon,
        img,
        toggle
}



