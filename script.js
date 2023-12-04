let display = document.querySelector(".display");
let input = document.querySelector("#input");
let upArrow = document.querySelector('[up-arrow]');
let downArrow = document.querySelector('[down-arrow]');
let searchBtn = document.querySelector('[search]');
let alertDiv = document.querySelector(".alert");

let cnt = -1;
let arrow = 0; 
let matchedID = [];  

startPage();
function startPage(){
    for (let i in localStorage) {
        let key = Number.parseInt(i); 
        let k = key; 
        let notes = localStorage[i];
        if (key!=NaN && typeof notes === "string") {
            insertNotes(key, notes); 
            k+=""; 
            let noteBox =document.getElementById(k).firstElementChild;
            noteBox.style.background = "transparent"; 
            cnt = key > cnt ? key : cnt; 
        }
    }
    matchedID.length = 0; 
    arrow = 0; 
    cnt++; 
}


function save() {
  if (input.value == ""){
    showAlert("Insert Note");
    return;
  }

  let key = cnt + ""; // str
  let val = input.value; // str
  localStorage.setItem(key, val.toLowerCase());
  insertNotes(cnt, val); 
  input.value = ""; 
  cnt++;


  for(let i in Array.from(document.querySelectorAll(".note-block"))){
    Array.from(document.querySelectorAll(".note-block"))[i].style.background = "transparent"; 
  }
  
}

function search() {
  if (input.value == ""){
    showAlert("Not found")
    return;
  } 
  let searchedNote = input.value.toLowerCase(); 
  let has = false; 
  let localStorage2 = Array.from(document.querySelectorAll(".note-block"));
  matchedID.length = 0; 

  for (let i in localStorage2) {
    if(localStorage2[i].value.toLowerCase().includes(searchedNote)){
      localStorage2[i].style.background = "rgba(0,0,0,0.8)"; 
      let key = localStorage2[i].closest(".notes").getAttribute("id"); 
      matchedID.push(key); 
      has = true;  
    }else{
      localStorage2[i].style.background = "transparent"; 
    }
  }
  if(!has){
    showAlert("Not found"); 
    return ; 
  }else{
    showAlert(`${matchedID.length} results found`);
  }
}

function doClear() {
  display.innerHTML = "";
  input.value = ""; 
  localStorage.clear();
  cnt = 0; 
}

function doEdit(id){
  id+=""; 
  let button = event.target; 
  let parent = document.getElementById(id); 
  let notes = parent.firstElementChild; 
  let val = notes.value; 
  if(notes.hasAttribute("readonly")){
    notes.removeAttribute("readonly"); 
    notes.style.background = "rgba(0,0,0,0.2)";
    const end = notes.value.length; 
    notes.setSelectionRange(end,end); 
    notes.focus();  
    button.textContent = "Save"
  }else{
    localStorage.setItem(id,val.toLowerCase());
    notes.setAttribute("readonly","1"); 
    notes.style.background = "transparent"; 
    button.textContent ="Edit";
  }
}

function doTrash(id) {
  id = "" + id;
  localStorage.removeItem(id);
  let deleteNote = document.getElementById(id);
  deleteNote.outerHTML = "";
}


function insertNotes(key, notes){ //key -> number, notes ->str
    let notesHtml = "";
    let newNode = document.createElement("div");
    newNode.classList.add("notes");
    newNode.setAttribute("id", ""+key);
    notesHtml += `<textarea name="" class="note-block" readonly>${notes}</textarea>
    <div class="manipulate">
        <button class="edit mani-button" onclick="doEdit(${key})">Edit</button>
        <button class="trash mani-button" onclick="doTrash(${key})">Delete</button>
    </div>`;
    newNode.innerHTML = notesHtml;
    display.appendChild(newNode);
}

function scrollDown(){

  if(matchedID.length==0) return; 

  if(arrow >= matchedID.length){
    showAlert("Not found"); 
    return ; 
  }
  downArrow.setAttribute("href", "#"+matchedID[arrow]); 
  arrow++; 

}
function scrollUp(){
  if(matchedID.length==0) return; 
  
  if(arrow <= 0){
    showAlert("Not found"); 
    return ; 
  }
  arrow--; 
  upArrow.setAttribute("href", "#"+matchedID[arrow]); 

}

function sleep(seconds){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve("Done"); 
    }, seconds*1000); 
  })
}

const showAlert = async (message) =>{
  alertDiv.textContent = message; 
  alertDiv.style.display = "block"; 
  await sleep(2); 
  alertDiv.style.display = "none"; 
}
