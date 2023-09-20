
//adds the red div that looks like an outline and moves smoothly because its css based
export function add_resisers(selected_object){

    let selector = document.createElement("div")
    //note:This position relative for child and position left blank for parent are strictly
    //required for selector to appear under instead of ontop!!!
    selector.style.position = "relative"
    selector.style.top = "-10px"
    selector.style.left = "-10px"
    selector.classList.add("selector")
    selector.style.width = selected_object.getBoundingClientRect().width + 20 + "px"
    selector.style.height = selected_object.getBoundingClientRect().height + 20  + "px"
    selector.style.zIndex = "-1"
    selector.style.backgroundColor = "Red"
    selected_object.appendChild(selector)

    let bottom_right_grab = add_bottom_right_handle(selected_object,selector)
    return bottom_right_grab

}
//add handles will in all four sides that will be responsible for resising and 
//not correctly complete yet
function add_bottom_right_handle(selected_object){
    let bottom_right_grab = document.createElement("div")
    let selected_object_w = selected_object.getBoundingClientRect().width
    let selected_object_h = selected_object.getBoundingClientRect().height

    selected_object.appendChild(bottom_right_grab)
    bottom_right_grab.style.position = "absolute"
    //bottom_right_grab.style.marginTop = selected_object.getBoundingClientRect().height + 20 + "px"
    bottom_right_grab.style.marginTop = " -50px"

    bottom_right_grab.style.marginLeft = selected_object.getBoundingClientRect().width + - 30  + "px";
    bottom_right_grab.style.width = selected_object_w /5+ "px"
    bottom_right_grab.style.height = selected_object_w / 5+ "px"
    bottom_right_grab.style.background = "transparent"
    bottom_right_grab.style.border = "2px solid black"
    bottom_right_grab.classList.add("bottom_right_grab")
    return bottom_right_grab
}

//removes resisers used to delete the resisers first before calling add
//when a new body is clicked
export function remove_resisers(selected_object){
    let grabbed_selector = selected_object.querySelector(".selector")
    let grabbed_bottom_right = selected_object.querySelector(".bottom_right_grab")
    if(grabbed_bottom_right && grabbed_selector){
        grabbed_selector.remove()
        grabbed_bottom_right.remove()
    }
    
}