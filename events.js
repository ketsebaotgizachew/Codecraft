//default colors for editor
let default_div_color = "blue"
let default_div_border_color = "cyan"
let default_text_color = "black"

//element to prevent now when something is being added in the editor
let adding_element = false
let editor = document.getElementById("editor")
let rightclickmenu = document.getElementById("rightclick")

//debuger_prints when only in debug mode
let debug_mode = true

//currently selected object
let selected_object;
function debugger_print(text){
    if(debug_mode == true){
        console.log("you are seeing these text because debug mode is enabled disable it in event.js")
        console.log(text)
    }
}
//preventing defult rightclick
document.addEventListener("contextmenu",function(e){
    e.preventDefault()
    //move rightclick menu to position before displaying
    rightclickmenu.style.top = e.clientY + "px"
    rightclickmenu.style.left = e.clientX + "px"
    //display rightclick menu
    rightclickmenu.style.display = "block"

    //start a timeout to close rightclick menu
    rightclickmenu.addEventListener("mouseleave",function(){
        setTimeout(() => {
            rightclickmenu.style.display = "none"  
        }, 1500);
    })
    rightclickmenu.addEventListener("mouseover",function(){
        rightclickmenu.style.display = "block" 
    })  
})
let first_clicked = false

function add_element(type){
    let start_pos_x = 0
    let start_pos_y = 0
    let end_pos_x = 0
    let end_pos_y = 0
    let created_element;
    function firstclick(e){
        start_pos_x = e.clientX
        start_pos_y = e.clientY

        //init div element
        created_element = document.createElement(type)

        created_element.style.position = "absolute"
        created_element.style.top = start_pos_y + "px"
        created_element.style.left = start_pos_x + "px"
        //defult colors
        created_element.style.background = default_div_color
        if(selected_object){
            selected_object.style.border = "none"
        }
        selected_object = created_element

        //let c = document.getElementById("dejd").getclientrect.y


        editor.appendChild(created_element)
        first_clicked = true
        secondclick()
    }
    editor.addEventListener("click",firstclick)
    function secondclick(){

    if(first_clicked == true){
        editor.removeEventListener("click",firstclick)
        debugger_print("second_click_wait_for_scales: STARTED")
        let width = 0;
        let height = 0;
        function move(e){
            end_pos_x = e.clientX
            end_pos_y = e.clientY
            width = end_pos_x - start_pos_x
            height = end_pos_y - start_pos_y

            //todo: fix negeative values for width and height
            if((end_pos_x - start_pos_x) >= 0){
                created_element.style.width =  width + "px"
            }else if((end_pos_x - start_pos_x) < 0){
                [start_pos_x,end_pos_x] = [end_pos_x,start_pos_x]
            }
            if((end_pos_y - start_pos_y) >= 0){
                created_element.style.height = height + "px"
            }else if((end_pos_x - start_pos_x) < 0){
                [start_pos_y,end_pos_y] = [end_pos_y,start_pos_y]
            }
        }
        editor.addEventListener("mousemove", move)
        //todo:know the proper place to remove this event listner

        editor.addEventListener("click",function(){
            editor.removeEventListener("mousemove", move)
            //todo: make border dashed only for selected element
            selected_object.style.border = `4px dashed ${default_div_border_color}`
        })
        
    }
    }
}
//adding div when button clicked
document.getElementById("div").addEventListener("click",function(){
    adding_element = true
    add_element("div")
})

editor.addEventListener("click",function(e){
    if(e.target && e.target !== editor){
    selected_object.style.border = "none";
    selected_object = null
    selected_object = e.target
    selected_object.style.border = `4px dashed ${default_div_border_color}`
    }else{
        selected_object.style.border = "none"
        selected_object = editor
    }
})

let elements_in_view = editor.querySelectorAll("div")
elements_in_view.forEach(element => {
    dragElement(element)
});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}