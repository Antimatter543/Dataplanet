let infoModal = document.getElementById("information-modal");
let helpModal = document.getElementById("help-modal");
let fomBTN = document.getElementById("find-out-more");
let helpBTN = document.getElementById("how-you-can-help");
let infoModalSpan = document.getElementsByClassName("close")[0];
let helpModalSpan = document.getElementsByClassName("close")[1];

fomBTN.onclick = function() {
    infoModal.style.display = "block";
}

helpBTN.onclick = function() {
    helpModal.style.display = "block";
}

infoModalSpan.onclick = function() {
    infoModal.style.display = "none";
}

helpModalSpan.onclick = function() {
    helpModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }

    if (event.target == helpModal) {
        helpModal.style.display = "none";
    }
}