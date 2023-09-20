import { rgbToHex } from "./color-manager.js";
import * as inducators from "./inducators.js"
import { Rectangle } from "./rect.js";
import { add_resisers,remove_resisers } from "./resizers.js";
import { update_properties } from "./property-manager.js";
import { dragElement } from "./editor-drag-handler.js";

//default colors for editor
let default_div_color = "blue";
let default_div_border_color = "black";
let default_text_color = "black";

//element to prevent now when something is being added in the editor
let adding_element = false;
let editor = document.getElementById("editor");


//editor_client_rect
let edcr = editor.getClientRects()
let editor_scale = [edcr.x,edcr.y,edcr.width,edcr.height]


let rightclickmenu = document.getElementById("rightclick");

//debuger_prints when only in debug mode
let debug_mode = true;
let dragging_elements = false;
//currently selected object
let selected_object;

let selector = document.getElementById("selectedbody")

let property_menu_open = false;

let first_clicked = false;

let snapping_enabled = true;

//this key is changed every keybored press to the keycode of the key pressed
let key;

let snap_radius = 50;
let snapThreshold = 20;

//for side grab selectors
let bottom_right_grab = document.getElementById("bottom_right")


let quadtree = new Quadtree(new Rectangle(0, 0,editor_scale[2] , editor_scale[3]));

//silly me will be deleted later
export function debugger_print(text) {
  if (debug_mode == true) {
    console.log(
      "you are seeing these text because debug mode is enabled disable it in event.js"
    );
    console.log(text);
  }
}

//preventing defult rightclick
//updates preventing right click only on editor
//some bug is affecting rightclick menu: bug Replication:unknown(press the right click 
//and press the editor a bunch of times till the menu closes and suddenly when you open the
//rightclick menu up it closes instantly when you move the mouse)

editor.addEventListener("contextmenu", function (e) {
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
  rightclickmenu.addEventListener("mouseover", function() {
    rightclickmenu.style.display = "block";
  });
});

export function add_element(type,color) {
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
export function call_add(type) {
  adding_element = true;
  add_element(type,"cyan");
}
export function add_menu_open(){
  document.getElementById("props").style.display = "none"
  document.getElementById("addmenu").style.display = "block"
}

editor.addEventListener("click", function (e) {
  if (e.target && e.target !== editor) {

    //bottom right grabber feature not complete
    //bottom_right_grab.style.display = "block"
    //bottom_right_grab.style.top = selected_object.getBoundingClientRect().y + selected_object.getBoundingClientRect().height - 10 +"px"
    //bottom_right_grab.style.left = selected_object.getBoundingClientRect().x + selected_object.getBoundingClientRect().width - 10 +"px"
    
    selected_object.width = selected_object.getBoundingClientRect().x - bottom_right_grab.getBoundingClientRect().x + "px"
    selected_object.classList.remove('selectedobj');
    remove_resisers(selected_object)
    selected_object = null;
    selected_object = e.target;
    bottom_right_grab = add_resisers(selected_object)
    dragElement(bottom_right_grab,selector,quadtree)
    selected_object.classList.add('selectedobj');
    update_properties(inducators,selected_object)
  } else {
    remove_resisers(selected_object)
    selected_object.style.border = "none";
    selected_object.classList.remove('selectedobj');
    selected_object = editor;
  }
});


if(adding_element == false){
editor.addEventListener("click",function(e){
    dragElement(selected_object,selected_object,quadtree)
    //feature not complete
    //dragElement(bottom_right_grab)
})}



//export function bottomright_drag_dimensions(){
//  selected_object.style.width = bottom_right_grab.getClientRects().x +"px"
//  selected_object.style.height = bottom_right_grab.getClientRects().y + "px"
//
//}
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


export function change(what){
  if(what === "id"){selected_object.id = inducators.ID_inducator.value}
  if(what === "background_color"){selected_object.style.background = inducators.background_color.value}
  if(what === "width"){selected_object.style.width = inducators.width_ind.value}
  if(what === "height"){selected_object.style.height = inducators.height_ind.value}
  if(what === "top"){selected_object.style.top = inducators.top_ind.value}
  if(what === "left"){selected_object.style.left = inducators.left_ind.value}
  if(what === "margin_all"){selected_object.style.margin = inducators.margin_all_ind.value}
  if(what === "padding_all"){selected_object.style.padding = inducators.padding_all_ind.value}
  if(what === "font_size"){selected_object.style.fontSize = inducators.font_size_ind.value}
  if(what === "text_color"){selected_object.style.color = inducators.text_color_ind.value}
  if(what === "text_color_text"){selected_object.style.color = inducators.text_color_text_ind.value}
  if(what === "font_family"){selected_object.style.fontFamily = inducators.font_family_ind.value}
  if(what === "text_decor"){selected_object.style.textDecoration = inducators.text_decoration_ind.value}
  if(what === "font_weight"){selected_object.style.fontWeight = inducators.font_weight_ind.value}
  if(what === "text_align"){selected_object.style.textAlign = inducators.text_align_ind.value}
  if(what === "content"){selected_object.innerText = content.innerText}
}

//export function to encode rgb into hex
//moved: color-manager.js
//export function rgbToHex(rgb) {
//  let a = rgb.split("(")[1].split(")")[0];
//  a = a.split(",");
//  let b = a.map(export function(x){
//      x = parseInt(x).toString(16);
//      return (x.length==1) ? "0"+x : x;
//  });
//  return "#" + b.join("");
//}

//implement shortcut detection here using key codes
document.addEventListener("keydown",function(e){
  key = e.keyCode || e.charCode;
  if(key === 8 || key === 46){
    selected_object.remove()
  }else if(key === 83){
    console.log(editor.innerHTML)
  }
})






