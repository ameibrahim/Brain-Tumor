const largeTitleContainer = document.querySelector(".large-title-container");
const imageTitleContainer = document.querySelector(".image-upload-container");
const finalResultsContainer = document.querySelector(".final-result-container");
// const largeTitleContainer = document.querySelector(".large-title-container");
// const imageContainer = document.querySelector(".image-container");
let educationPage = document.querySelector(".education-page");
let educationLink = document.querySelector("#education-link");
let predictorLink = document.querySelector("#predictor-link");

let isPredictorLinkOpen = false;
let isEducationLinkOpen = false;

function slideRight(){
    largeTitleContainer.style.left = "-100%";
    imageTitleContainer.style.left = "-200%";
    finalResultsContainer.style.left = "-200%";
    imageContainer.style.width = "80%";
}

function slideLeft(){
    largeTitleContainer.style.left = "0%";
    imageTitleContainer.style.left = "0%";
    finalResultsContainer.style.left = "0%";
    imageContainer.style.width = "30%";
}

class WaitPromise {

    constructor(time = 1000){
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("Done");
            }, time);
        })
    }

}

function deactivateMenubarLinks(){
    let menuBarItems = document.querySelectorAll(".menu-item");
    
    for (let index = 0; index < menuBarItems.length; index++) {
        const element = menuBarItems[index];
        element.className = "menu-item";
    }
}

function slideEducationPage(){

    if(isEducationLinkOpen){
        deactivateMenubarLinks();
        slideDownEducationPage();
        slideLeft();
    }
    else{
        educationPage.style.top = "0px";
        deactivateMenubarLinks();
        educationLink.className += " active";
        isEducationLinkOpen = true;
    }

}

function slideDownEducationPage(){
    educationPage.style.top = "100vh";
    isEducationLinkOpen = false;
}

function goToPredictor(){

    deactivateMenubarLinks();
    slideDownEducationPage();

    if(isPredictorLinkOpen){
        slideLeft();
        isPredictorLinkOpen = false;
    }
    else{
        predictorLink.className += " active";
        slideRight();
        isPredictorLinkOpen = true;
    }
} 