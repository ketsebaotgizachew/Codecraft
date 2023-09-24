/**
 * 
 * @param {String} message_title : notfication pannel header
 * @param {String} message: notification pannel contents
 */
export function shownotification(message_title,message){
    document.getElementById("notification").style.bottom = "35px"
    document.getElementById("not_content").innerText = message;
    document.getElementById("not_title").innerText = message_title
    document.getElementById("notification").style.opacity = "1";
    setTimeout(() => {
        document.getElementById("notification").style.bottom = "-235px"
        document.getElementById("not_content").innerText = message;
        document.getElementById("notification").style.opacity = "0";

    }, 4000);
}
