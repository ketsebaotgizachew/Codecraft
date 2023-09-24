let code_area = document.getElementById("code_area")
let highlight = document.getElementById("highlight")
let line_display = document.getElementById("lines_count")
let lines_count = 1;
let lines_top_list = [24.5]

code_area.addEventListener('keypress', function(event) {
    if (event.key === '{') {
        // Timeout is needed to wait for the '{' to be actually added to the textarea
        setTimeout(() => {
            this.value += '}';
            // Move the cursor back in front of the closing bracket
            this.selectionStart = this.selectionEnd = this.value.length - 1;

            this.dispatchEvent(new Event('input'));
        }, 0);
    }if(event.key === '('){
        // Timeout is needed to wait for the '{' to be actually added to the textarea
        setTimeout(() => {
            this.value += ')';
            // Move the cursor back in front of the closing bracket
            this.selectionStart = this.selectionEnd = this.value.length - 1;

            this.dispatchEvent(new Event('input'));
        }, 0);
    }if(event.key === '\"'){
        // Timeout is needed to wait for the '{' to be actually added to the textarea
        setTimeout(() => {
            this.value += '\"';
            // Move the cursor back in front of the closing bracket
            this.selectionStart = this.selectionEnd = this.value.length - 1;

            this.dispatchEvent(new Event('input'));
        }, 0);
    }
    if(event.key === '\''){
        // Timeout is needed to wait for the '{' to be actually added to the textarea
        setTimeout(() => {
            this.value += '\'';
            // Move the cursor back in front of the closing bracket
            this.selectionStart = this.selectionEnd = this.value.length - 1;

            this.dispatchEvent(new Event('input'));
        }, 0);
    }
    if(event.key === "Enter"){
        let div = document.createElement("div")
        let linec = document.createElement("h1")
        linec.innerText = lines_count;
        div.appendChild(linec)
        line_display.appendChild(div)
        lines_count += 1;
    }
});

function input_cliked(e){
    console.log(e.clientY)
    
    highlight.style.top = findClosestNumber(lines_top_list,e.clientY) + "px"
}

function findClosestNumber(numbers, target) {
    // Filter out numbers greater than the target
    numbers = numbers.filter(num => num <= target);

    // If no numbers are less than or equal to the target, return null
    if (numbers.length === 0) {
        return null;
    }

    return numbers.reduce((prev, curr) => {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    });
}

let highlighted_code = document.getElementById("code")
let codetag = highlighted_code.querySelector("code")
code_area.addEventListener("mousedown", input_cliked)
code_area.addEventListener("input",function(){
    codetag.textContent = code_area.value
    hljs.highlightBlock(codetag);
})