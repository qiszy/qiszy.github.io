(() => {
    const defaults = {
        enable: true,
        minSize: 14,
        maxSize: 32,
        spawnInterval: 140,
        minSpeed: 22,
        maxSpeed: 50,
        color: "#dff6ff",
    };

    const config = Object.assign({}, defaults, window.particlexLinksSnow || {});
    if (!config.enable) return;

    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    let layer = null;
    let timer = null;

    const createLayer = () => {
        if (layer) return;
        layer = document.createElement("div");
        layer.id = "links-snow-layer";
        document.body.appendChild(layer);
    };

    const spawnFlake = () => {
        if (!layer) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const size = randomBetween(config.minSize, config.maxSize);
        const speed = randomBetween(config.minSpeed, config.maxSpeed);
        const startX = Math.random() * (viewportWidth + 120) - 60;
        const driftX = randomBetween(-160, 160);
        const rotation = randomBetween(-180, 180);
        const distanceY = viewportHeight + 140;
        const duration = (distanceY / speed) * 1000;
        const opacity = randomBetween(0.45, 0.9);

        const flake = document.createElement("div");
        flake.className = "links-snowflake";
        flake.textContent = "❄";
        flake.style.left = `${startX}px`;
        flake.style.fontSize = `${size}px`;
        flake.style.color = config.color;
        flake.style.opacity = opacity.toFixed(2);
        flake.style.transitionDuration = `${Math.round(duration)}ms`;

        layer.appendChild(flake);

        window.requestAnimationFrame(() => {
            flake.style.transform = `translate3d(${driftX}px, ${distanceY}px, 0) rotate(${rotation}deg)`;
            flake.style.opacity = "0.15";
        });

        window.setTimeout(() => {
            flake.remove();
        }, duration + 400);
    };

    const startSnow = () => {
        if (timer !== null) return;
        const interval = clamp(config.spawnInterval, 80, 5000);
        timer = window.setInterval(spawnFlake, interval);
        spawnFlake();
    };

    const stopSnow = () => {
        if (timer === null) return;
        window.clearInterval(timer);
        timer = null;
    };

    const handleVisibility = () => {
        if (document.hidden) {
            stopSnow();
        } else {
            startSnow();
        }
    };

    window.addEventListener("load", () => {
        createLayer();
        startSnow();
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("beforeunload", stopSnow);
    });
})();
