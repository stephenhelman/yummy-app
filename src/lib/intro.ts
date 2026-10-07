const INTRO_KEY = 'lmy-intro-played';

/** True once per browser session, so the sheet rise and logo scale-in only play on the first load. */
const play = (() => {
  try {
    if (sessionStorage.getItem(INTRO_KEY)) return false;
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // no session storage: play the intro, it is harmless
  }
  return true;
})();

export function shouldPlayIntro(): boolean {
  return play;
}
