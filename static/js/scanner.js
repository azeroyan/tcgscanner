const URL = "/static/model/";
const historyStoreKey = "tcgScannerHistory";

let model, webcam, labelContainer, maxPredictions, className;
let lastStoredClass = null;
let lastStoredTime = 0;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const constraints = {
        facingMode: "environment"
    };

    // Convenience function to setup a webcam
    const flip = false; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(constraints); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    className = document.getElementById("class-name");

    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

function addHistoryEntry(card, probability) {
    const now = new Date().toISOString();
    const history = JSON.parse(localStorage.getItem(historyStoreKey) || "[]");

    if (card === lastStoredClass && Date.now() - lastStoredTime < 5000) {
        return;
    }

    history.unshift({
        card,
        probability,
        time: now
    });

    localStorage.setItem(historyStoreKey, JSON.stringify(history.slice(0, 50)));
    lastStoredClass = card;
    lastStoredTime = Date.now();
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability.toFixed(2) > 0.95) {
            className.innerHTML = prediction[i].className;
            addHistoryEntry(prediction[i].className, parseFloat(prediction[i].probability.toFixed(2)));
        }
    }
}