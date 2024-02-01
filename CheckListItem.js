class ChecklistItem {

    message
    type
    promise

    parentContainer = document.querySelector(".results");
    checklistItem = document.createElement("div");
    indicator = document.createElement("div");
    loader = document.createElement("div");
    span = document.createElement("span");
    checkmark = document.createElement("div");
    img = document.createElement("img");
    checklistText = document.createElement("div");

    constructor(checklistObject){

        let {
            message,
            type,
            promise,
        } = checklistObject;

        this.message = message;
        this.type = type;
        this.promise = promise;
    
    }

    start(wait) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.promise();
                setTimeout(() => {
                    this.loader.style.opacity = "0";
                    this.checkmark.style.opacity = "1";
                    resolve(result);
                }, wait);
            }
            catch(error) {
                reject(error);
                this.checklistText.textContent += " (Something went wrong)";
            }
    
        });
    }
    
    attach(){    

        this.checklistItem.className = "checklist-item";
        this.indicator.className = "indicator";
        this.loader.className = "loader-waiting";
        this.loader.appendChild(this.span);

        this.checkmark.className = "checkmark";
        this.img.src = "check.png";
        this.img.alt = "checkmark"
        this.checkmark.appendChild(this.img);

        this.indicator.appendChild(this.loader);
        this.indicator.appendChild(this.checkmark);

        this.checklistText.className = "checklist-text";
        this.checklistText.textContent = this.message;

        this.checklistItem.appendChild(this.indicator);
        this.checklistItem.appendChild(this.checklistText);
        this.parentContainer.appendChild(this.checklistItem);
    }

    load() {
        this.loader.className = "loader";
    }
}