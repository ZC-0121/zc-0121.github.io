// checkMedia.js
import { startAnimation, stopAnimation } from './animation.js';

// Define the breakpoint. 
// Since your CSS changes at max-width: 425px, we want the animation 
// to run only when the screen is AT LEAST 426px wide.
const mediaQuery = window.matchMedia('(min-width: 426px)');

function handleScreenChange(e) {
  if (e.matches) {
    // Screen is big enough -> Run Animation
    console.log("Screen large: Starting Animation");
    startAnimation();
  } else {
    // Screen is too small -> Stop Animation and Clear Canvas
    console.log("Screen small: Stopping Animation");
    stopAnimation();
  }
}

// 1. Add listener for when the user resizes the window across the breakpoint
mediaQuery.addEventListener('change', handleScreenChange);

// 2. Run the check immediately on page load to set the initial state
document.addEventListener("DOMContentLoaded", () => {
    handleScreenChange(mediaQuery);
});