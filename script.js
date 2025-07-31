document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // Crear 32 velitas al azar
  for (let i = 0; i < 32; i++) {
    const left = Math.random() * (cake.offsetWidth - 20);
    const top = Math.random() * (cake.offsetHeight - 40);
    addCandle(left, top);
  }

  function blowOutCandles() {
    candles.forEach((candle) => {
      if (!candle.classList.contains("out")) {
        candle.classList.add("out");
        const flame = candle.querySelector(".flame");
        if (flame) flame.style.display = "none";
      }
    });
    updateCandleCount();
  }

  function detectBlow() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Tu navegador no soporta entrada de micrófono.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function analyze() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (volume > 50) {
          blowOutCandles();
        }

        requestAnimationFrame(analyze);
      }

      analyze();
    });
  }

  detectBlow();
});
