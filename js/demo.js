const players = [];

export function stopDemos() {
  for (const player of players) {
    player.remove();
  }
  players.length = 0;
}

export function mountDemo(host, lottieFile, label) {
  const player = document.createElement("dotlottie-wc");
  player.setAttribute("src", `vendor/lottie/${lottieFile}.lottie`);
  player.setAttribute("loop", "");
  player.setAttribute("mode", "normal");
  player.setAttribute(
    "autoplay",
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "false" : "",
  );
  player.setAttribute("aria-label", `Animation of ${label}`);
  host.append(player);
  players.push(player);
}
