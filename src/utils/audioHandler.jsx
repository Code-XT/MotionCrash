import * as Tone from "tone";
let bgPlayer;
let lowPass;

export async function playBG(distort) {
  if (!bgPlayer) {
    bgPlayer = new Tone.Player({
      url: "/loop-bg.aac",
      loop: true,
    }).toDestination();

    lowPass = new Tone.Filter(400, "lowpass").toDestination();

    await Tone.loaded();
    bgPlayer.start();
  }

  if (distort) {
    bgPlayer.disconnect().chain(lowPass);
  } else {
    bgPlayer.disconnect(lowPass).toDestination();
  }
}

export async function playFX() {
  const fxPlayer = new Tone.Player({
    url: "/car-crash.wav",
    loop: false,
  }).toDestination();

  await Tone.loaded();
  fxPlayer.start();
}
