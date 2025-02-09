// Allow file drop
function allowDrop(event) {
    event.preventDefault();
}

// Handle file drop for Blur Card
function handleDropForBlur(event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) {
        alert("Please drop an image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const inputContent = e.target.result;
        displayBlurOutput(event.target, inputContent);
    };
    reader.readAsDataURL(file); // Read file as Data URL
}

// Handle file drop for Border Card
function handleDropForBorder(event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) {
        alert("Please drop an image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const inputContent = e.target.result;
        displayBorderOutput(event.target, inputContent);
    };
    reader.readAsDataURL(file); // Read file as Data URL
}

// Display blurred image
function displayBlurOutput(inputBox, content) {
    const card = inputBox.closest(".card");
    const outputBox = card.querySelector(".output-box");

    const img = new Image();
    img.src = content;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = "blur(5px)"; // Default blur level
        ctx.drawImage(img, 0, 0);

        const blurredDataUrl = canvas.toDataURL("image/png");
        outputBox.style.backgroundImage = `url(${blurredDataUrl})`;
        outputBox.style.backgroundSize = "cover";
        outputBox.style.backgroundPosition = "center";
        outputBox.textContent = "";

        createBlurControls(card, img, outputBox, canvas, ctx);
    };
}

// Display image with border
function displayBorderOutput(inputBox, content) {
    const card = inputBox.closest(".card");
    const outputBox = card.querySelector(".output-box");

    const img = new Image();
    img.src = content;

    img.onload = function () {
        let borderWidth = 5; // Default border width
        let borderColor = "#000000"; // Default border color

        const borderedDataUrl = createBorderedImage(img, borderWidth, borderColor);
        outputBox.style.backgroundImage = `url(${borderedDataUrl})`;
        outputBox.style.backgroundSize = "contain";
        outputBox.style.backgroundPosition = "center";
        outputBox.textContent = "";

        createBorderControls(card, img, outputBox, borderWidth, borderColor);
    };
}

// Create blurred image controls
function createBlurControls(card, img, outputBox, canvas, ctx) {
    let blurSlider = card.querySelector(".blur-slider");
    if (!blurSlider) {
        blurSlider = document.createElement("input");
        blurSlider.type = "range";
        blurSlider.min = 0;
        blurSlider.max = 20;
        blurSlider.value = 5; // Default blur value
        blurSlider.className = "blur-slider";
        card.appendChild(blurSlider);
    }

    const downloadButton = card.querySelector(".download-blur-button") || document.createElement("button");
    downloadButton.textContent = "Download Blurred Image";
    downloadButton.className = "download-blur-button";
    card.appendChild(downloadButton);

    blurSlider.oninput = function () {
        ctx.filter = `blur(${blurSlider.value}px)`;
        ctx.drawImage(img, 0, 0);
        const blurredDataUrl = canvas.toDataURL("image/png");
        outputBox.style.backgroundImage = `url(${blurredDataUrl})`;
    };

    downloadButton.onclick = function () {
        const blurredDataUrl = canvas.toDataURL("image/png");
        downloadImage(blurredDataUrl, "blurred-image.png");
    };
}

// Create bordered image controls
function createBorderControls(card, img, outputBox, borderWidth, borderColor) {
    const widthInput = card.querySelector(".border-width") || document.createElement("input");
    widthInput.type = "number";
    widthInput.min = 0;
    widthInput.value = borderWidth;
    widthInput.className = "border-width";
    widthInput.placeholder = "Border Width";
    card.appendChild(widthInput);

    const colorInput = card.querySelector(".border-color") || document.createElement("input");
    colorInput.type = "color";
    colorInput.value = borderColor;
    colorInput.className = "border-color";
    card.appendChild(colorInput);

    const downloadButton = card.querySelector(".download-border-button") || document.createElement("button");
    downloadButton.textContent = "Download Image with Border";
    downloadButton.className = "download-border-button";
    card.appendChild(downloadButton);

    widthInput.oninput = function () {
        borderWidth = parseInt(widthInput.value) || 0;
        updateBorder(outputBox, img, borderWidth, borderColor);
    };

    colorInput.oninput = function () {
        borderColor = colorInput.value;
        updateBorder(outputBox, img, borderWidth, borderColor);
    };

    downloadButton.onclick = function () {
        const borderedDataUrl = createBorderedImage(img, borderWidth, borderColor);
        downloadImage(borderedDataUrl, "bordered-image.png");
    };
}

// Update border dynamically
function updateBorder(outputBox, img, borderWidth, borderColor) {
    const updatedImage = createBorderedImage(img, borderWidth, borderColor);
    outputBox.style.backgroundImage = `url(${updatedImage})`;
}

// Generate bordered image
function createBorderedImage(img, borderWidth, borderColor) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width + borderWidth * 2;
    canvas.height = img.height + borderWidth * 2;

    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, borderWidth, borderWidth);

    return canvas.toDataURL("image/png");
}

// Download utility
function downloadImage(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
}
