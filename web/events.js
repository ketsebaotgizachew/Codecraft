import { rgbToHex } from "./color-manager.js";
import { identify } from "./inducators.js";
import { Rectangle } from "./rect.js";
import { add_resisers,remove_resisers } from "./resizers.js";
import { update_properties } from "./property-manager.js";
import { dragElement } from "./editor-drag-handler.js"; 

//let projects properties be here for now
let projectName;
let projectPlace;
let projectPages;

//if design mode is off elements will not be editable
let design_mode = true

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
  //right click menu height
  rightclickmenu.style.height = "505px"

  //display rightclick menu
  rightclickmenu.style.display = "block";

  //start a timeout to close rightclick menu
  rightclickmenu.addEventListener("mouseleave", function () {
    setTimeout(() => {
      rightclickmenu.style.display = "none";
      //closes after 1500miliseconds
    }, 1500);
  });
  //will not close if the right click menu is still in hover
  rightclickmenu.addEventListener("mouseover", function() {
    rightclickmenu.style.display = "block";
  });
});

//adds elements to editor
export function add_element(type,color) {
  //represent the starting point of the objects
  //the top let edge of any element
  //current way of adding elements in codecraft is using click and drags
  let start_pos_x = 0;
  let start_pos_y = 0;

  //where clicking and draging endes
  let end_pos_x = 0;
  let end_pos_y = 0;
  //generated element
  let created_element;

  function firstclick(e) {
    //register first click positions as starting points
    start_pos_x = e.clientX;
    start_pos_y = e.clientY;

    //create div element
    created_element = document.createElement(type);

    //position absolute to make able free movment
    created_element.style.position = "absolute";
    created_element.style.top = start_pos_y + "px";
    created_element.style.left = start_pos_x + "px";

    //defult background color applying 
    //for now every element has same color when created this should be changed in the neer feuture
    created_element.style.background = color;
    if (selected_object) {
      selector.style.display = "none"
    }

    //created element is automaticaly selected
    selected_object = created_element;
    //selected object special Class for selector psudo elements over it
    selected_object.classList.add('selectedobj');
    //let c = document.getElementById("dejd").getclientrect.y

    //adding created element to editor view
    editor.appendChild(created_element);

    //report first click has occurd on adding element
    first_clicked = true;
    secondclick();
  }

  //second click event listner initalized
  editor.addEventListener("click", firstclick);

  //handle second click
  function secondclick() {
    //check first if first click has occured before doing anything
    if (first_clicked == true) {
      //dispose of first click event listner as first click is over
      editor.removeEventListener("click", firstclick);

      //width and height of element calculated based on the x and y of second click
      let width = 0;
      let height = 0;

      //handle calculating width and height when mouse is moving and
      //second click has not occurd
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
        
      });
    }
  }
}

//calling add element and enabling adding element
export function call_add(type) {
  adding_element = true;
  add_element(type,"cyan");
}

//this will open the what to add prompt
export function add_menu_open(){
  document.getElementById("props").style.display = "none"
  document.getElementById("menu").style.right = "328px"
  document.getElementById("addmenu").style.display = "block"
}

//dbclick to also focus to element when done
editor.addEventListener("dblclick", function (e) {
  if (e.target && e.target !== editor) {

    //bottom right grabber feature not complete
    //bottom_right_grab.style.display = "block"
    //bottom_right_grab.style.top = selected_object.getBoundingClientRect().y + selected_object.getBoundingClientRect().height - 10 +"px"
    //bottom_right_grab.style.left = selected_object.getBoundingClientRect().x + selected_object.getBoundingClientRect().width - 10 +"px"
    
    //display selector
    selected_object.width = selected_object.getBoundingClientRect().x - bottom_right_grab.getBoundingClientRect().x + "px"
    selected_object.classList.remove('selectedobj');

    //remove prexisring resisers if any
    remove_resisers(selected_object)
    //replace selected object with doble clickd
    selected_object = null;
    selected_object = e.target;
    //selected object should is focused when double clicked
    selected_object.focus()
    //new resiser are added
    bottom_right_grab = add_resisers(selected_object)

    //efficency improvments
    //add deagable property only to selected elements
    //needs quadtree cause drag elements is going to handle snapping and going to check
    //for snap in close to me sphere to be more efficent
    dragElement(bottom_right_grab,selector,quadtree)
    selected_object.classList.add('selectedobj');

    //new elemnt cliked will up date every input in properties tab using this function
    update_properties(identify,selected_object,rgbToHex)
  } else {
    //only if editor is clicked
    rightclickmenu.style.visibility = "hidden"
    rightclickmenu.style.height = "0px"
    rightclickmenu.style.display = "none"
    remove_resisers(selected_object)
    selected_object.style.border = "none";
    selected_object.classList.remove('selectedobj');
    selected_object = editor;
  }
});

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
    update_properties(identify,selected_object,rgbToHex)
  } else {
    remove_resisers(selected_object)
    selected_object.style.border = "none";
    selected_object.classList.remove('selectedobj');
    selected_object = editor;
  }
});


//if not adding element then then will add dragelement to drag element
if(adding_element == false){
editor.addEventListener("click",function(e){
    dragElement(selected_object,selector,quadtree)
    //feature not complete
    //dragElement(bottom_right_grab)
})}



//export function bottomright_drag_dimensions(){
//  selected_object.style.width = bottom_right_grab.getClientRects().x +"px"
//  selected_object.style.height = bottom_right_grab.getClientRects().y + "px"
//
//}

//handle menu properties tabs
document.getElementById("menu").addEventListener("click",function(){
  document.getElementById("addmenu").style.display = "none"
  if(property_menu_open == false){
    document.getElementById("props").style.display = "block"
    document.getElementById("menu").style.right = "328px"
    property_menu_open = true
  }else{
    document.getElementById("props").style.display = "none"
    document.getElementById("menu").style.right = "0px"
    property_menu_open = false
  }
})


//function updates selected objects properties taking from properties
export function change(what){
  if(what === "id"){selected_object.id = identify.ID_inducator.value}
  if(what === "background_color"){selected_object.style.background = identify.background_color.value}
  if(what === "width"){selected_object.style.width = identify.width_ind.value}
  if(what === "height"){selected_object.style.height = identify.height_ind.value}
  if(what === "top"){selected_object.style.top = identify.top_ind.value}
  if(what === "left"){selected_object.style.left = identify.left_ind.value}
  if(what === "margin_all"){selected_object.style.margin = identify.margin_all_ind.value}
  if(what === "padding_all"){selected_object.style.padding = identify.padding_all_ind.value}
  if(what === "font_size"){selected_object.style.fontSize = identify.font_size_ind.value}
  if(what === "text_color"){selected_object.style.color = identify.text_color_ind.value}
  if(what === "text_color_text"){selected_object.style.color = identify.text_color_text_ind.value}
  if(what === "font_family"){selected_object.style.fontFamily = identify.font_family_ind.value}
  if(what === "text_decor"){selected_object.style.textDecoration = identify.text_decoration_ind.value}
  if(what === "font_weight"){selected_object.style.fontWeight = identify.font_weight_ind.value}
  if(what === "text_align"){selected_object.style.textAlign = identify.text_align_ind.value}
  if(what === "content"){selected_object.textContent = identify.content.value}
  //changeing inputs type property
  //if(what === "type"){selector.nodeType = }
}



//implement shortcut detection here using key codes
document.addEventListener("keydown",function(e){
  if (event.key === 'Delete') {
    selected_object.remove()
  }
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();  // Prevents the browser's default save action
    save_project()
  }
})

document.addEventListener("keydown",function(e){

})

//handles nav menus while not overlaping
let file_menu_open = false;
let edit_menu_open = false;
let view_menu_open = false;
let window_menu_open = false;
let help_menu_open = false;

export function open_nav_menu(nav_item){
  if(nav_item === "file"){
    document.getElementById("edit_menu").style.display = "none";
    document.getElementById("view_menu").style.display = "none";
    document.getElementById("window_menu").style.display = "none";
    document.getElementById("help_menu").style.display = "none";
    edit_menu_open = view_menu_open = window_menu_open = help_menu_open = false;

    if(file_menu_open === false){
      document.getElementById("file_menus").style.display = "flex";
      file_menu_open = true;
    } else {
      document.getElementById("file_menus").style.display = "none";
      file_menu_open = false;
    }
  } else if(nav_item === "edit"){
    document.getElementById("file_menus").style.display = "none";
    document.getElementById("view_menu").style.display = "none";
    document.getElementById("window_menu").style.display = "none";
    document.getElementById("help_menu").style.display = "none";
    file_menu_open = view_menu_open = window_menu_open = help_menu_open = false;

    if(edit_menu_open === false){
      document.getElementById("edit_menu").style.display = "flex";
      edit_menu_open = true;
    } else {
      document.getElementById("edit_menu").style.display = "none";
      edit_menu_open = false;
    }
  } else if(nav_item === "view"){
    document.getElementById("file_menus").style.display = "none";
    document.getElementById("edit_menu").style.display = "none";
    document.getElementById("window_menu").style.display = "none";
    document.getElementById("help_menu").style.display = "none";
    file_menu_open = edit_menu_open = window_menu_open = help_menu_open = false;

    if(view_menu_open === false){
      document.getElementById("view_menu").style.display = "flex";
      view_menu_open = true;
    } else {
      document.getElementById("view_menu").style.display = "none";
      view_menu_open = false;
    }
  } else if(nav_item === "window"){
    document.getElementById("file_menus").style.display = "none";
    document.getElementById("edit_menu").style.display = "none";
    document.getElementById("view_menu").style.display = "none";
    document.getElementById("help_menu").style.display = "none";
    file_menu_open = edit_menu_open = view_menu_open = help_menu_open = false;

    if(window_menu_open === false){
      document.getElementById("window_menu").style.display = "flex";
      window_menu_open = true;
    } else {
      document.getElementById("window_menu").style.display = "none";
      window_menu_open= false;
    }
  } else if(nav_item === "help"){
    document.getElementById("file_menus").style.display= "none";
    document.getElementById("edit_menu").style.display= "none";
    document.getElementById("view_menu").style.display= "none";
    document.getElementById("window_menu").style.display= "none";
    
     file_menu_open= edit_menu_open= view_menu_open= window_menu_open= false;

     if(help_menu_open===false){
         document.getElementById('help_menu').style.display="flex"
         help_menu_open=true
     }else{
         document.getElementById('help_menu').style.display="none"
         help_menu_open=false
     }
  }
}

export async function open_project_dir(){
  console.log("func called! opening file")
  let file_path;
  file_path = await eel.open_folder_dialoge()()
  document.getElementById("working_dir").value = file_path
  projectPlace = file_path;

}
export function create_project(){
  projectName = document.getElementById("project_name").value;
  if(projectName === "" || projectPlace === ""){
    console.log("project name for project dir is unspecifyied")
  }else{
    document.getElementById("create_pr_prompt").style.display = "none"
    eel.init_pr(projectPlace,projectName)
  }

}

export function save_project(){
  if(projectName && projectPlace){
    eel.sv_file(projectName, editor.innerHTML,projectPlace)
    console.log("project Saved!!")
  }else{
    console.log("you have no project create one")
  }
  
}
let new_pr_path;
export async function open_project(){
  new_pr_path = await eel.open_folder_dialoge()()
  let loaded_html = await eel.l_html(new_pr_path)()
  editor.innerHTML = loaded_html
  selected_object = editor
  projectName = "some project"
  projectPlace = new_pr_path
  editor.addEventListener("click",function(e){
    selected_object = e.target;
    dragElement(e.target)
  })
}


