import toc from "./chapters/toc.html?raw";
import chapter1 from "./chapters/01.html?raw";
import chapter2 from "./chapters/02.html?raw";
import chapter3 from "./chapters/03.html?raw";
import { setupDeck } from "./deck";
import { hideToc } from "./toc";

const tocSource = "./chapters/toc.html?raw";
const chapterSources = [
  "./chapters/01.html?raw",
  "./chapters/02.html?raw",
  "./chapters/03.html?raw",
];

const chapters = [
  chapter1,
  chapter2,
  chapter3,
];

function insertToc(toc) {
  document.querySelector(".toc").innerHTML = `<div>${toc}</div>`;
}

function attachEventListenersToTocChapters(deck) {
  // attach event listeners to table of content chapter previews
  const tocChapters = document.querySelectorAll(".toc section");
  const chapterDeckSlides = document.querySelectorAll(
    ".reveal .slides > section.deck-slide"
  );
  const allToplevelSlides = document.querySelectorAll(
    ".reveal .slides > section"
  );
  tocChapters.forEach((chapter, index) => {
    const chapterDeckSlide = chapterDeckSlides[index];
    if (!chapterDeckSlides) {
      console.error(`Could not find deck slide for chapter ${index + 1}`);
      return;
    }
    allToplevelSlides.forEach((slide, topLevelIndex) => {
      if (chapterDeckSlide === slide) {
        chapter.addEventListener("click", () => {
          hideToc();
          deck.slide(topLevelIndex, 0, 0);
        });
      }
    });
  });
}

const combinedChapters = chapters.join("");
document.querySelector(
  ".slides-container"
).innerHTML = `<div class="reveal"><div class="slides">${combinedChapters}</div></div>`;
insertToc(toc);

const [deepLinkHorizontalSlide, deepLinkVerticalSlide] = location.hash
  .split("/")
  .slice(1);
const slideDeck = await setupDeck();
if (deepLinkHorizontalSlide) {
  slideDeck.slide(deepLinkHorizontalSlide, deepLinkVerticalSlide ?? 0);
  hideToc();
}
attachEventListenersToTocChapters(slideDeck);

// add hot reloading (in dev mode)
// https://vitejs.dev/guide/api-hmr.html#hot-accept-cb
if (import.meta.hot) {
  // hot reload table of contents
  import.meta.hot.accept(tocSource, (newRawToc) => insertToc(newRawToc));

  // hot reload chapters
  import.meta.hot.accept(chapterSources, (newRawChapters) => {
    document.querySelector(".slides").innerHTML = newRawChapters.join("");
    slideDeck.sync();
    slideDeck.getPlugin("highlight").hljs.highlightAll();
  });
}
