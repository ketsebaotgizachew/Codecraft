/**
 * 
 * @param {string} prompt - window to be opend check out Documentation 
 */
//all export functions to open prompts will be put inside here with varying the prompt parameter
export function open_prompt(prompt){
    if(prompt === "create"){document.getElementById("create_pr_prompt").style.display = "block"}
  }
  export function close_prompt(prompt){
    if(prompt === "create"){
      document.getElementById("create_pr_prompt").style.display = "none"
    }
      else if(prompt === "code"){
        document.getElementById("jscode_window").style.display = "none"
      }
  }
  document.getElementById("projects_list").addEventListener("click",function(e){
    console.log(`project ${e.target} clicked!!`)
    document.getElementById("projects").style.display = "none"
  })