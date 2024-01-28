document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  let drawing = false;
  let history = [];
  let historyIndex = -1;

  // Set initial stroke size
  let strokeSize = 3;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.lineWidth = strokeSize;
  context.lineCap = "round";
  context.strokeStyle = "#000";

  const canvasContainer = document.getElementById("canvas-container");
  canvasContainer.style.height = `${window.innerHeight}px`;

  console.log(canvasContainer.style.height);
  console.log(canvas.height);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Prevent the right-click context menu
  });

  window.addEventListener("resize", () => {
    // Resize canvas when the window is resized
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.putImageData(imageData, 0, 0);

    // Adjust canvas container height on resize
    canvasContainer.style.height = `${window.innerHeight}px`;

    redrawHistory();
  });

  document.getElementById("clear").addEventListener("click", clearCanvas);
  document.getElementById("undo").addEventListener("click", undoDrawing);
  document.getElementById("redo").addEventListener("click", redoDrawing);

  const strokeSelect = document.getElementById("stroke");
  strokeSelect.addEventListener("change", updateStrokeSize);

  function handleMouseDown(e) {
    if (e.button === 0) {
      // Left mouse button is pressed
      startDrawing(e);
    } else if (e.button === 2) {
      canvas.style.cursor = "grabbing";
      canvas.addEventListener("mouseup", function () {
        canvas.style.cursor = "default";
      });
    }
  }

  function startDrawing(e) {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);

    // Clear redo history when starting a new drawing
    if (historyIndex < history.length - 1) {
      history.splice(historyIndex + 1);
    }
  }

  function stopDrawing() {
    if (drawing) {
      drawing = false;
      // Save the current state to the history
      saveDrawing();
    }
  }

  function draw(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    historyIndex = -1;
  }

  function undoDrawing() {
    if (historyIndex > 0) {
      historyIndex--;
      redrawHistory();
    }
  }

  function redoDrawing() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      redrawHistory();
    }
  }

  function saveDrawing() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    history.push(imageData);
    historyIndex = history.length - 1;
  }

  function redrawHistory() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(history[historyIndex], 0, 0);
  }

  function updateStrokeSize() {
    strokeSize = parseInt(strokeSelect.value);
    context.lineWidth = strokeSize;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      canvasContainer.style.height = `${canvas.height + 50}px`;
      canvas.height = canvas.height + 50;
      console.log(canvasContainer.style.height);
      console.log(canvas.height);
    }
  });
});
