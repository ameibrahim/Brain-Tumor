const resultsContainer = document.querySelector(".results");
const imageContainer = document.querySelector(".image-container");
const detectionButton = document.querySelector(".detection-button");
const imagePlaceholder = document.querySelector(".image-placeholder");

let selectedFile;
let liveCheckListItems = [];
let checklistObjects = [
    {
        message: "Waiting For User To Select an Image",
        type: "",
        promise: () => new WaitPromise(0)
    },
    {
        message: "Waiting For User To Click Start Detection",
        type: "",
        promise: () => new WaitPromise(0)
    },
    {
        message: "Uploading MRI Image",
        type: "",
        promise: () => {}
    },
    {
        message: "Loading Model",
        type: "",
        promise: () => new WaitPromise(2200)
    },
    {
        message: "Starting Model",
        type: "",
        promise: () => new WaitPromise(4200)
    },
    {
        message: "Resizing Image",
        type: "",
        promise: () => new WaitPromise(1800)
    },
    {
        message: "Predicting Result From MRI Image",
        type: "",
        promise: () => {}
    },

];

resetElements();

function startCheckListEngine(){

    liveCheckListItems = [];

    checklistObjects.forEach(item => {
        const newItem = new ChecklistItem(item);
        newItem.attach();
        liveCheckListItems.push(newItem);
    });

    liveCheckListItems[0].load();
}

function resetElements(){
    resultsContainer.innerHTML = "";
    imageContainer.style.borderWidth = "3px";
    detectionButton.style.display = "block";
    imagePlaceholder.src = "";

    startCheckListEngine();
}

function loadFile(event){
    imagePlaceholder.src = URL.createObjectURL(event.target.files[0]);
    selectedFile = event.target.files[0];
    imagePlaceholder.onload = () => {
        URL.revokeObjectURL(imagePlaceholder.src);
    }

    imageContainer.style.borderWidth = "0px";

    liveCheckListItems[0].start();
    liveCheckListItems[1].load();
}

async function startDetection() {

    detectionButton.style.display = "none";

    liveCheckListItems[1].start();
    liveCheckListItems[2].load();

   try {
        liveCheckListItems[2].promise = () => uploadFile();
        let imageName = await liveCheckListItems[2].start(3000);

        // Load more checklists
        for(let i = 3; i < 6; i++){
            await liveCheckListItems[i].load();
            await liveCheckListItems[i].start();
        }


        liveCheckListItems[6].load();
        liveCheckListItems[6].promise = () => detectWithImageName(imageName.newFilename);
        let results = await liveCheckListItems[6].start(2000);

        updateViewWithResults(results);
        showRestartButton();
   }
   catch(error){
        console.log(error)
   }

}

function showRestartButton() {

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const restartButton = document.createElement("div");
    restartButton.className = "button restart-button";
    restartButton.textContent = "Restart";

    const saveResultsButton = document.createElement("div");
    saveResultsButton.className = "button save-button";
    saveResultsButton.textContent = "Save Results";

    restartButton.addEventListener("click", () => {
        resetElements();
    });

    saveResultsButton.addEventListener("click", () => {
        // showSavePopup();
        console.log("Saving...")
    });

    buttonContainer.appendChild(restartButton);
    buttonContainer.appendChild(saveResultsButton);
    resultsContainer.appendChild(buttonContainer);
}

async function detectWithImageName(imageName){

    console.log(imageName);

    let url = `http://braintumor.aiiot.live:3033/predict/?imageName=${imageName}`

    try {
        let result = await fetch(url, { method: 'GET' });

        let JSONResult = await result.json();
        let prediction = JSONResult.prediction
        let accuracy = JSONResult.accuracy

        return {
            prediction,
            accuracy
        }
    }
    catch(error){
        return {
            prediction: "Error",
            accuracy: "Error"
        }
    }
}

function uploadFile() {

    if(!selectedFile){
        return false;
    }

    return new Promise((resolve, reject) => {

        let myFormData = new FormData();
        myFormData.append("file", selectedFile);

        let http = new XMLHttpRequest();
        http.open("POST", "upload.php", true);

        http.upload.addEventListener("progress", (event) => {
            let percent = (event.loaded / event.total ) * 100;
            // document.querySelector("progress").value = Math.round(percent);
        })

        http.onload = function(){
            if(this.status == 200){

                console.log("name2: ",this.responseText);

                resolve({
                    filename: selectedFile.name,
                    newFilename: this.responseText,
                })
            }
            else{
                reject("error");
            }
        }

        http.send(myFormData);
    })
}

function updateViewWithResults(results) {

    let {
        prediction,
        accuracy
    } = results

    predictionValue = prediction == 0 ? "No Tumor" : "Has Tumor"

    const tumorResult = document.createElement("div");
    tumorResult.className = "tumor-result";
    tumorResult.innerHTML =  `
            <p>Prediction: </p>
            <p class="prediction-placeholder">${predictionValue}</p>
        `;

    

    const accuracyResult = document.createElement("div");
    accuracyResult.className = "accuracy";
    accuracyResult.innerHTML = `
            <p>Prediction Accuracy: </p>
            <p class="accuracy-placeholder">${accuracy}</p>
        `;

    resultsContainer.appendChild(tumorResult);
    resultsContainer.appendChild(accuracyResult);

    
}

function uniqueID(){
    const date = Date.now();
    const dateReversed = parseInt(String(date).split("").reverse().join(""));

    const base36 = number => (number).toString(36);

    return base36(dateReversed) + base36(date);
}

function AJAXCall(callObject){

    let {
        phpFilePath,
        rejectMessage,
        params,
        type,
    } = callObject;

    return new Promise((resolve,reject) => {

        let xhr = new XMLHttpRequest();
        xhr.open("POST", phpFilePath, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onload = function(){
            if( this.status == 200 ){

                let result = type == "fetch" ? 
                JSON.parse(this.responseText) : this.responseText ;

                //TODO: Take a look one more time
                if(result.length < 1 && type != "fetch") reject(rejectMessage || "SQLError");
                else { resolve(result) }
            }
            else{
                reject("Error With PHP Script");
            }
        }

        xhr.send(params);

    });

}