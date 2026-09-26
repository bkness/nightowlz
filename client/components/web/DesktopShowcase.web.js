import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

// Desktop presentation for the web build. Wide screens get a showcase page
// with the real app running in a phone-sized iframe. The iframe matters:
// SwipeCardDeck and MainTabs read Dimensions.get("window") at load, so
// the app must see a phone-sized window, not the desktop one. The frame
// loads the same page with ?frame=1 and shares localStorage (login).

const WIDE = 900;          // px — below this the app just fills the screen
const PHONE_W = 390;
const PHONE_H = 844;

export const isFramed = () =>
  typeof window !== "undefined" &&
  (window.self !== window.top || new URLSearchParams(window.location.search).has("frame"));

const REPO = "https://github.com/bkness/nightowlz";
const PORTFOLIO = "https://brandonkelly.vercel.app";

const css = `
.no-page {
  --night: #05010A; --plum: #0D0217; --amber: #FFB85C;
  --pink: #FF4FD8; --ice: #7BDFFF; --smoke: #B9B2C8;
  position: fixed; inset: 0; overflow: auto;
  background:
    radial-gradient(60rem 40rem at 78% 50%, rgba(255,79,216,.10), transparent 60%),
    radial-gradient(40rem 30rem at 20% 20%, rgba(255,184,92,.06), transparent 60%),
    var(--night);
  color: var(--smoke);
  font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  /* flex + margin:auto centers when there's room and scrolls (instead of
     clipping the top) when the content is taller than the window */
  display: flex;
}
.no-layout {
  display: grid; grid-template-columns: minmax(0, 30rem) auto;
  align-items: start; gap: clamp(3rem, 7vw, 7rem);
  margin: auto; padding: 3rem clamp(2rem, 5vw, 5rem); max-width: 72rem; width: 100%;
  box-sizing: border-box;
}
.no-sign {
  margin: 0 0 1.25rem; font: 400 clamp(3.4rem, 6vw, 5rem)/1 Pacifico, cursive;
  color: #FFE3BD;
  text-shadow: 0 0 .06em #fff, 0 0 .18em var(--amber), 0 0 .5em var(--amber), 0 0 1.1em var(--pink);
  animation: no-flicker 1.6s steps(1) 1 both;
}
@keyframes no-flicker {
  0% { opacity: .08; text-shadow: none; }
  12% { opacity: 1; } 16% { opacity: .15; text-shadow: none; }
  24% { opacity: 1; } 29% { opacity: .3; text-shadow: none; }
  34%, 100% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .no-sign { animation: none; } }
.no-pitch { margin: 0 0 2.25rem; font-size: 1.3rem; line-height: 1.45; color: #EDE7F6; max-width: 26ch; }
.no-block { margin: 0 0 1.75rem; max-width: 46ch; }
.no-block h2 { margin: 0 0 .5rem; font-size: 1rem; font-weight: 650; color: var(--amber); }
.no-block p, .no-block li { margin: 0; font-size: .95rem; }
.no-block ul { margin: 0; padding: 0; list-style: none; display: grid; gap: .45rem; }
.no-block strong { color: #EDE7F6; font-weight: 600; }
.no-note { font-size: .85rem; color: #8C85A0; }
.no-links { display: flex; gap: 1.5rem; margin-top: 2rem; }
.no-links a {
  color: var(--amber); font-weight: 600; text-decoration: none;
  border-bottom: 1px solid rgba(255,184,92,.35); padding-bottom: 2px;
}
.no-links a:hover { border-color: var(--amber); }
.no-links a:focus-visible, .no-page iframe:focus-visible { outline: 2px solid var(--ice); outline-offset: 4px; }
.no-phone-slot { position: sticky; top: 24px; }
.no-phone {
  /* size to the iframe, not the (already scaled-down) slot */
  width: max-content;
  border-radius: 48px; padding: 10px; background: #120522;
  box-shadow:
    inset 0 0 0 1px rgba(255,184,92,.35),
    -18px 0 60px -30px rgba(255,184,92,.55),
    0 30px 80px -20px rgba(0,0,0,.8),
    0 0 120px -40px rgba(255,79,216,.45);
}
.no-phone iframe { display: block; border: 0; border-radius: 38px; background: var(--night); }
`;

export default function DesktopShowcase({ children }) {
  const { height } = useWindowDimensions();
  // Decide once, at load: swapping between the plain app and the showcase
  // while running unmounts the whole app mid-use (a resize across the
  // breakpoint crashed a ScrollView teardown)
  const [wide] = useState(() => window.innerWidth >= WIDE);

  useEffect(() => {
    if (!isFramed()) document.title = "Night Owlz — find your night";
  }, []);

  if (isFramed() || !wide) return children;

  // Scale the phone to fit short laptop screens without cropping
  const scale = Math.min(1, Math.max(0.55, (height - 48) / (PHONE_H + 20)));
  const src = `${window.location.pathname}?frame=1`;

  return (
    <div className="no-page">
      <style>{css}</style>
      <main className="no-layout">
        <section aria-labelledby="no-title">
          <h1 id="no-title" className="no-sign">Night Owlz</h1>
          <p className="no-pitch">Find a bar, swipe to save it, and keep your night&apos;s shortlist in one place.</p>

          <div className="no-block">
            <h2>Try it</h2>
            <p>
              The app on the right is the real thing, built from the same code as the iPhone
              version. Create an account in a few seconds. Pick <strong>Owner</strong> to see the
              bar dashboard and event tools.
            </p>
          </div>

          <div className="no-block">
            <h2>How it&apos;s built</h2>
            <ul>
              <li><strong>React Native and Expo</strong> run one codebase on iOS, Android and this page.</li>
              <li><strong>Node, Express and MongoDB</strong> handle accounts, saved bars and owner events.</li>
              <li><strong>Apple MapKit and OpenStreetMap</strong> power bar search and maps.</li>
            </ul>
          </div>

          <p className="no-note">
            The server runs on a free tier, so the first search can take about 30 seconds while it wakes up.
          </p>

          <nav className="no-links" aria-label="Project links">
            <a href={REPO} target="_blank" rel="noreferrer">Source on GitHub</a>
            <a href={PORTFOLIO} target="_blank" rel="noreferrer">Brandon Kelly</a>
          </nav>
        </section>

        {/* transform doesn't shrink layout space, so size the slot to the
            scaled phone and scale the frame inside it from the top-left */}
        <div className="no-phone-slot" style={{ width: (PHONE_W + 20) * scale, height: (PHONE_H + 20) * scale }}>
          <div
            className="no-phone"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <iframe
              title="Night Owlz app"
              src={src}
              width={PHONE_W}
              height={PHONE_H}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
