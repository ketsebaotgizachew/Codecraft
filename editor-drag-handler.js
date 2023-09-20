/**
 * 
 * @param {Node} elmnt - Node to HTML element to be dragged
 * @param {Node} selector - Node to Selector object
 * @param {Node} quadtree - Node to quadtree
 */
export function dragElement(elmnt,selector,quadtree) {
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
      // call a export function whenever the cursor moves:
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
      selector.style.top = (elmnt.offsetTop - pos2 -10) + "px";
      selector.style.left = (elmnt.offsetLeft - pos1 -10) + "px";
  
      //let nerbyobjects = quadtree.retrieve({x: elmnt.offsetLeft, y: elmnt.offsetTop, snap_radius: snapThreshold});
      //feuture not complete
      //bottom_right_grab.style.top = (elmnt.offsetTop - pos2 +selected_object.getBoundingClientRect().height - 10) + "px"
      //bottom_right_grab.style.left = (elmnt.offsetLeft - pos2 +selected_object.getBoundingClientRect().width - 10) + "px"
      //bottomright_drag_dimensions()
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }