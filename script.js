document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = `${left}px`;
    candle.style.top = `${top}px`;

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
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
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
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

  // 🕓 Esperar un poco a que el pastel tenga tamaño antes de generar las velas
  setTimeout(() => {
    const cakeWidth = cake.offsetWidth;
    const cakeHeight = cake.offsetHeight;

    for (let i = 0; i < 32; i++) {
      const left = Math.random() * (cakeWidth - 20);
      const top = Math.random() * (cakeHeight - 40);
      addCandle(left, top);
    }
  }, 100); // Espera 100ms antes de crear velas

  detectBlow();
});
