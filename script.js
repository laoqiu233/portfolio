"use strict"
window.onload = function() {
    console.log("Loaded");
    document.getElementById("loader").style.left = "200%";
    let about_heading = document.getElementById("about");
    let skills_heading = document.getElementById("skills");
    let links_heading = document.getElementById("linksheader");
    makeLonger(about_heading);
    makeLonger(skills_heading);
    makeLonger(links_heading);
};

function makeLonger(elem) {
    let width = elem.offsetWidth;
    let original = elem.innerHTML;
    let string = "";
    for (let i = 0; i < window.innerWidth / width + 1; i++) {
        if (i == 1) {
            string += `<span class=\"highlight\" style=\"border-bottom: 5px solid #b43fbd\">${original}</span>`;
        } else {
            string += ` ${original} `;
        }
    }
    elem.innerHTML = string;
    elem.style.left = `-${width*0.8}px`;
}