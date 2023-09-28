import { jsFunctions } from "./js-keyword-list.js";
let lastWord;
let code_area = document.getElementById("code_area")


export function initsuggestions( code_area) {
    code_area.addEventListener("input", function () {
    let input = code_area.value;
    let words = input.split(" ");
    lastWord = words[words.length - 1].toLowerCase();

    let suggestions = jsFunctions.filter((word) =>
      word.toLowerCase().startsWith(lastWord)
    );

    // Clear the "sug" element here
    document.getElementById("sug").innerHTML = "";

    suggestions.forEach((element) => {
      let newElement = document.createElement("button");
      newElement.textContent = element;
      document.getElementById("sug").appendChild(newElement);
    });
  });
  document.getElementById("sug").addEventListener("click", function (event) {
    // Check if a button was clicked
    if (event.target.tagName === "BUTTON") {
      // Get the clicked button
      let clickedButton = event.target;

      // Update the input field
      code_area.value += clickedButton.textContent.slice(
        lastWord.length
      );
    let occ = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    
    // Dispatch the event
    code_area.dispatchEvent(occ);
    }})}
