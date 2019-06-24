"use strict"
window.onload = function() {
    console.log("Loaded");
    document.getElementById("loader").style.left = "200%";
    let headings = document.getElementsByClassName("heading");
    for (let heading of headings) {
        makeLonger(heading);
    }
    myp5 = new p5(sketch)
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
    elem.style.left = `-${elem.getElementsByClassName('highlight')[0].offsetLeft - (window.innerWidth < 1024 ? 50 : 100)}px`;
}