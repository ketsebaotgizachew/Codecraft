let code_area = document.getElementById("code_area")
let highlight = document.getElementById("highlight")
let lines_count = 0;
let lines_top_list = [24.5]

function input_keydown(e) {
    if(e.key === "Enter") {
        code_area.style.height = code_area.getBoundingClientRect().height + 35 + "px"
        highlight.style.top = highlight.getBoundingClientRect().y + 35 + "px"
        lines_count++;
        lines_top_list.push(highlight.getBoundingClientRect().y + 35)
    }
}

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


code_area.addEventListener("keydown",input_keydown)
code_area.addEventListener("mousedown", input_cliked)