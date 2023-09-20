/**
 * 
 * @param {module} inducators - Module that exports Inducator elements
 * @param {Node} selected_object - Node to HTMLelement selected element 
 */
export function update_properties(inducators,selected_object,rgbToHex){
    console.log("update properties called!!")
    console.log(inducators.ID_inducator)
    inducators.ID_inducator.value = selected_object.id
    inducators.background_color.value = rgbToHex(window.getComputedStyle(selected_object).backgroundColor)
    inducators.position_ind.value = selected_object.style.position
    inducators.width_ind.value = selected_object.style.width
    inducators.height_ind.value = selected_object.style.height
    inducators.top_ind.value = selected_object.style.top
    inducators.left_ind.value = selected_object.style.left
    inducators.margin_all_ind.value = selected_object.style.margin
    inducators.padding_all_ind.value = selected_object.style.padding
    //text only feutures
    if(selected_object && inducators.txt_eligable_tags.includes(selected_object.tagName.toLowerCase())){
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