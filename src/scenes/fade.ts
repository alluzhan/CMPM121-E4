import Phaser from "phaser";

const FADE_OUT_MS = 450;
const FADE = { r: 4, g: 2, b: 12 };

const leaving = new WeakSet<Phaser.Scene>();

export function isLeaving(scene: Phaser.Scene): boolean {
  return leaving.has(scene);
}

export function fadeIn(scene: Phaser.Scene, ms = 400): void {
  scene.cameras.main.fadeIn(ms, FADE.r, FADE.g, FADE.b);
}

export function fadeTo(
  scene: Phaser.Scene,
  key: string,
  data?: object,
): void {
  if (leaving.has(scene)) return;
  leaving.add(scene);
  scene.events.once("shutdown", () => leaving.delete(scene));
  const camera = scene.cameras.main;
  camera.fadeOut(FADE_OUT_MS, FADE.r, FADE.g, FADE.b);
  camera.once("camerafadeoutcomplete", () => {
    scene.scene.start(key, data);
  });
}
