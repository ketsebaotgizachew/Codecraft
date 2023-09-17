//default colors for editor
let default_div_color = "blue";
let default_div_border_color = "black";
let default_text_color = "black";

//element to prevent now when something is being added in the editor
let adding_element = false;
let editor = document.getElementById("editor");
let rightclickmenu = document.getElementById("rightclick");

//debuger_prints when only in debug mode
let debug_mode = true;
let dragging_elements = false;
//currently selected object
let selected_object;

let selector = document.getElementById("selectedbody")

let property_menu_open = false;

function debugger_print(text) {
  if (debug_mode == true) {
    console.log(
      "you are seeing these text because debug mode is enabled disable it in event.js"
    );
    console.log(text);
  }
}
//preventing defult rightclick
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  //move rightclick menu to position before displaying
  rightclickmenu.style.top = e.clientY + "px";
  rightclickmenu.style.left = e.clientX + "px";
  //display rightclick menu
  rightclickmenu.style.display = "block";

  //start a timeout to close rightclick menu
  rightclickmenu.addEventListener("mouseleave", function () {
    setTimeout(() => {
      rightclickmenu.style.display = "none";
    }, 1500);
  });
  rightclickmenu.addEventListener("mouseover", function () {
    rightclickmenu.style.display = "block";
  });
});
let first_clicked = false;

function add_element(type,color) {
  let start_pos_x = 0;
  let start_pos_y = 0;
  let end_pos_x = 0;
  let end_pos_y = 0;
  let created_element;
  function firstclick(e) {
    start_pos_x = e.clientX;
    start_pos_y = e.clientY;

    //init div element
    created_element = document.createElement(type);

    created_element.style.position = "absolute";
    created_element.style.top = start_pos_y + "px";
    created_element.style.left = start_pos_x + "px";
    //defult colors
    created_element.style.background = color;
    if (selected_object) {
      selector.style.display = "none"
    }
    selected_object = created_element;
    selected_object.classList.add('selectedobj');
    //let c = document.getElementById("dejd").getclientrect.y

    editor.appendChild(created_element);
    first_clicked = true;
    secondclick();
  }
  editor.addEventListener("click", firstclick);
  function secondclick() {
    if (first_clicked == true) {
      editor.removeEventListener("click", firstclick);
      debugger_print("second_click_wait_for_scales: STARTED");
      let width = 0;
      let height = 0;
      function move(e) {
        end_pos_x = e.clientX;
        end_pos_y = e.clientY;
        width = end_pos_x - start_pos_x;
        height = end_pos_y - start_pos_y;

        //todo: fix negeative values for width and height
        if (end_pos_x - start_pos_x >= 0) {
          created_element.style.width = width + "px";
        } else if (end_pos_x - start_pos_x < 0) {
          [start_pos_x, end_pos_x] = [end_pos_x, start_pos_x];
        }
        if (end_pos_y - start_pos_y >= 0) {
          created_element.style.height = height + "px";
        } else if (end_pos_x - start_pos_x < 0) {
          [start_pos_y, end_pos_y] = [end_pos_y, start_pos_y];
        }
      }
      editor.addEventListener("mousemove", move);
      //todo:know the proper place to remove this event listner

      editor.addEventListener("click", function () {
        editor.removeEventListener("mousemove", move);
        //todo: the px shouldnt be hard coded
        
      });
    }
  }
}
//adding div when button clicked
function call_add(type) {
  adding_element = true;
  add_element(type,"cyan");
}
function add_menu_open(){
  document.getElementById("props").style.display = "none"
  document.getElementById("addmenu").style.display = "block"
}
editor.addEventListener("click", function (e) {
  if (e.target && e.target !== editor) {
    selected_object.style.border = "none";
    selected_object.classList.remove('selectedobj');
    selected_object = null;
    selected_object = e.target;
    selected_object.classList.add('selectedobj');
    update_props()
  } else {
    selected_object.style.border = "none";
    selected_object.classList.remove('selectedobj');
    selected_object = editor;
  }
});


if(adding_element == false){
editor.addEventListener("click",function(e){
    // Make the DIV element draggable:
    let divs = document.querySelectorAll("div")
    let inputs = document.querySelectorAll("input")
    dragElement(selected_object)

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else{
    if(elmnt !== editor){
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    }
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
}})}
document.getElementById("menu").addEventListener("click",function(){
  document.getElementById("addmenu").style.display = "none"
  if(property_menu_open == false){
    document.getElementById("props").style.display = "block"
    property_menu_open = true
  }else{
    document.getElementById("props").style.display = "none"
    property_menu_open = false
  }
})
//properties
let ID_inducator = document.getElementById("ID_inducator")
let background_color = document.getElementById("background_color")
let position_ind = document.getElementById("position")
let width_ind = document.getElementById("width")
let height_ind = document.getElementById("height")
let top_ind = document.getElementById("top")
let left_ind = document.getElementById("left")
let margin_all_ind = document.getElementById("margin_all")
let padding_all_ind = document.getElementById("padding_all")

//text eligable tags
let txt_eligable_tags = ["span","h1","h2","h3","h4","h5","h6","h7","input","text-area"]
//this properties are for text only objects
let font_size_ind = document.getElementById("font_size")
let text_color_text_ind = document.getElementById("text_color_text")
let text_color_ind = document.getElementById("text_color")
let font_family_ind = document.getElementById("font_family")
let text_decoration_ind = document.getElementById("text_decoration")
let font_weight_ind = document.getElementById("font_weight")
let text_align_ind = document.getElementById("text_align")
let content = document.getElementById("content")

function update_props(){
  ID_inducator.value = selected_object.id
  background_color.value = rgbToHex(window.getComputedStyle(selected_object).backgroundColor)
  position_ind.value = selected_object.style.position
  width_ind.value = selected_object.style.width
  height_ind.value = selected_object.style.height
  top_ind.value = selected_object.style.top
  left_ind.value = selected_object.style.left
  margin_all_ind.value = selected_object.style.margin
  padding_all_ind.value = selected_object.style.padding
  //text only feutures
  if(selected_object && txt_eligable_tags.includes(selected_object.tagName.toLowerCase())){
    font_size_ind.value = window.getComputedStyle(selected_object).fontSize
    text_color_text_ind.value = window.getComputedStyle(selected_object).color
    text_color_ind.value = rgbToHex(window.getComputedStyle(selected_object).color)
    font_family_ind.value = window.getComputedStyle(selected_object).fontFamily
    text_decoration_ind.value = window.getComputedStyle(selected_object).textDecoration
    font_weight_ind.value = window.getComputedStyle(selected_object).fontWeight
    text_align_ind.value = window.getComputedStyle(selected_object).textAlign

  }else{
    //todo: Disable each of these elements if selectedobj is not text type
    console.log("todo: code(4)")
  }
}

function change(what){
  if(what === "id"){selected_object.id = ID_inducator.value}
  if(what === "background_color"){selected_object.style.background = background_color.value}
  if(what === "width"){selected_object.style.width = width_ind.value}
  if(what === "height"){selected_object.style.height = height_ind.value}
  if(what === "top"){selected_object.style.top = top_ind.value}
  if(what === "left"){selected_object.style.left = left_ind.value}
  if(what === "margin_all"){selected_object.style.margin = margin_all_ind.value}
  if(what === "padding_all"){selected_object.style.padding = padding_all_ind.value}
  if(what === "font_size"){selected_object.style.fontSize = font_size_ind.value}
  if(what === "text_color"){selected_object.style.color = text_color_ind.value}
  if(what === "text_color_text"){selected_object.style.color = text_color_text_ind.value}
  if(what === "font_family"){selected_object.style.fontFamily = font_family_ind.value}
  if(what === "text_decor"){selected_object.style.textDecoration = text_decoration_ind.value}
  if(what === "font_weight"){selected_object.style.fontWeight = font_weight_ind.value}
  if(what === "text_align"){selected_object.style.textAlign = text_align_ind.value}
  if(what === "content"){selected_object.innerText = content.innerText}

}
//function to encode rgb into hex
function rgbToHex(rgb) {
  let a = rgb.split("(")[1].split(")")[0];
  a = a.split(",");
  let b = a.map(function(x){
      x = parseInt(x).toString(16);
      return (x.length==1) ? "0"+x : x;
  });
  return "#" + b.join("");
}

let key;
document.addEventListener("keydown",function(e){
  key = e.keyCode || e.charCode;
  if(key === 8 || key === 46){
    selected_object.remove()
  }else if(key === 83){
    console.log(editor.innerHTML)
  }
})
