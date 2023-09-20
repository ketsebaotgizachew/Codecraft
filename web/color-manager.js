/**
 * 
 * @param {string} rgb -RGB thats to be converted
 * @returns {string} = hex code
 */
export function rgbToHex(rgb) {
    let a = rgb.split("(")[1].split(")")[0];
    a = a.split(",");
    let b = a.map(function(x){
        x = parseInt(x).toString(16);
        return (x.length==1) ? "0"+x : x;
    });
    return "#" + b.join("");
  }

