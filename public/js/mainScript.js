
function GetCookie_Value(keyName){
    let value = ""
    let r = document.cookie.split(';');//split(';')を使用しデータを1つずつに分ける
     r.forEach(function(data) {
       let content = data.split('=');//split('=')を使用しcookie名と値に分ける
       if(content[0].trim() == keyName) value = content[1];
     });
     console.log(value);
     return value;
};

function DisplayChangeIcon(dislplay){
    const deleteDom = document.getElementById("delete");
    const editDom = document.getElementById("edit");
    deleteDom.style.display = dislplay;
    editDom.style.display = dislplay;
};

let isOperation = false;

const listDom = document.getElementById("list");

async function GetAllData(){
    if(isOperation) return;
    try{
        isOperation = true;
        DisplayChangeIcon("none");
        const memoData = await axios.get('/main/all',{
            params:{
                userId:GetCookie_Value("Id"),
            }
        });
    
        console.log(memoData);
        let ids = [];
    
        const allMemo = await memoData.data.map((memo)=>{
            ids.push(memo._id);
            let check = "";
            if(memo.completion) check = "checked";
            return `
            <li id="${memo._id}" class="noSelect">
                <input type="checkbox" name="${memo._id}" ${check}>
                <p>${memo.title}</p>
            </li>`
        }).join("");
    
        listDom.innerHTML = allMemo;
    
        ids.forEach((id)=>{
            const Dom = document.getElementById(id);
            
            Dom.addEventListener('click',(e)=>{
                let target = e.target;
                if(e.target.localName != "li") target = e.target.parentElement;
                DisplayChangeIcon('block');
                target.className = "select";
                const activeDom = document.querySelectorAll('.select');
                activeDom.forEach((dom)=>{
                    if(dom.id == target.id)return;
                    dom.className = "noSelect";
                });
                console.log(activeDom);
                
            });
    
            const checkDom = Dom.querySelector("input");
            checkDom.addEventListener('change',async(e)=>{
                try{
                    if(isOperation) return;
                    isOperation = true;
                    const id = e.target.name;
                    console.log(id);
                    await axios.post('/main/check',{
                        id:id,
                        check:e.target.checked
                    });
                }catch{
                    console.log("err");
                }finally{
                    isOperation = false;
                };
            });
        });
    }catch{
        console.log("err");
    }finally{
        isOperation = false;
    };
};

async function GetCompletionData(){
    if(isOperation) return;
    try{
        isOperation = true;
        DisplayChangeIcon("none");
        const memoData = await axios.get('/main/completion',{
            params:{
                userId:GetCookie_Value("Id"),
            }
        });
    
        console.log(memoData);
        let ids = [];
    
        const allMemo = memoData.data.map((memo)=>{
            ids.push(memo._id);
            return `
            <li id="${memo._id}" class="noSelect">
                <input type="checkbox" name="${memo._id}" checked>
                <p>${memo.title}</p>
            </li>`
        }).join("");
    
        listDom.innerHTML = allMemo;
    
        ids.forEach((id)=>{
            const Dom = document.getElementById(id);
            Dom.addEventListener('click',(e)=>{
                let target = e.target;
                if(e.target.localName != "li") target = e.target.parentElement;
                DisplayChangeIcon('block');
                target.className = "select";
                const activeDom = document.querySelectorAll('.select');
                activeDom.forEach((dom)=>{
                    if(dom.id == target.id)return;
                    dom.className = "noSelect";
                });
                console.log(activeDom);
            });
    
            const checkDom = Dom.querySelector("input");
            checkDom.addEventListener('change',async(e)=>{
                try{
                    if(isOperation) return;
                    isOperation = true;
                    const id = e.target.name;
                    console.log(id);
                    await axios.post('/main/check',{
                        id:id,
                        check:e.target.checked
                    });
                }catch{
                    console.log("err");
                }finally{
                    isOperation = false;
                };
            });
        });

    }catch{
        console.log("err");
    }finally{
        isOperation = false;
    };
};

async function GetIncompleteData(){
    if(isOperation) return;
    try{
        isOperation = true;
        DisplayChangeIcon("none");
        const memoData = await axios.get('/main/incomplete',{
            params:{
                userId:GetCookie_Value("Id"),
            }
        });
    
        console.log(memoData);
        let ids = [];
    
        const allMemo = memoData.data.map((memo)=>{
            ids.push(memo._id);
            return `
            <li id="${memo._id}" class="noSelect">
                <input type="checkbox" name="${memo._id}">
                <p>${memo.title}</p>
            </li>`
        }).join("");
    
        listDom.innerHTML = allMemo;
    
        ids.forEach((id)=>{
            const Dom = document.getElementById(id);
            Dom.addEventListener('click',(e)=>{
                let target = e.target;
                if(e.target.localName != "li") target = e.target.parentElement;
                DisplayChangeIcon('block');
                target.className = "select";
                const activeDom = document.querySelectorAll('.select');
                activeDom.forEach((dom)=>{
                    if(dom.id == target.id)return;
                    dom.className = "noSelect";
                });
                console.log(activeDom);
            });
    
            const checkDom = Dom.querySelector("input");
            checkDom.addEventListener('change',async(e)=>{
                try{
                    if(isOperation) return;
                    isOperation = true;
                    const id = e.target.name;
                    console.log(id);
                    await axios.post('/main/check',{
                        id:id,
                        check:e.target.checked
                    });
                }catch{
                    console.log("err");
                }finally{
                    isOperation = false;
                };
            });
        });

    }catch{
        console.log("err");
    }finally{
        isOperation = false;
    };
};

const allDom = document.getElementById("all");
const incompleteDom = document.getElementById("incomplete");
const completionDom = document.getElementById("completion");

allDom.addEventListener('click',(e)=>{
    allDom.className = "onBtn";
    incompleteDom.className = "offBtn";
    completionDom.className = "offBtn";
    GetAllData();
});

incompleteDom.addEventListener('click',(e)=>{
    incompleteDom.className = "onBtn";
    allDom.className = "offBtn";
    completionDom.className = "offBtn";
    console.log(incompleteDom.className,allDom.className,completionDom.className);
    GetIncompleteData();
});

completionDom.addEventListener('click',(e)=>{
    completionDom.className = "onBtn";
    incompleteDom.className = "offBtn";
    allDom.className = "offBtn";
    GetCompletionData();
});


GetAllData();

const titleDom = document.getElementById("title");
const memoDom = document.getElementById("memo");

var newTitle = "";
var newMemo = "";

titleDom.addEventListener('change',(e)=>{
    newTitle = e.target.value;
    console.log(newTitle);
});

memoDom.addEventListener('change',(e)=>{
    newMemo = e.target.value;
    console.log(newMemo);
});

const addDom = document.getElementById("add");

addDom.addEventListener('click',(e)=>{
    const submitBtnDom = document.getElementById("submitBtn");
    submitBtnDom.textContent = "追加";
    const dialogDom = document.getElementById("dialog");
    dialogDom.style.display = "block";
});

const editDom = document.getElementById("edit");

editDom.addEventListener('click',async(e)=>{
    if(isOperation) return;
    try{
        isOperation = true;
        const submitBtnDom = document.getElementById("submitBtn");
        submitBtnDom.textContent = "更新";
        const selectDom = document.getElementsByClassName("select");
        const id = selectDom[0].id;
        const data = await axios.get('/main/idData',{
            params:{
                id:id,
            }
        });
        const titleDom = document.getElementById("title");
        titleDom.value = data.data.title;
        newTitle = data.data.title;
        const memoDom = document.getElementById("memo");
        memoDom.value = data.data.content;
        newMemo = data.data.content;
        const dialogDom = document.getElementById("dialog");
        dialogDom.style.display = "block";
    }catch{
        console.log("err");
    }finally{
        isOperation = false;
    };
});

const deleteDom = document.getElementById("delete");
deleteDom.addEventListener('click',async(e)=>{
    if(isOperation) return;
    try{
        isOperation = true;
        const selectDom = document.getElementsByClassName("select");
        const id = selectDom[0].id;
        console.log(id);
        await axios.delete('/main/delete',{
            params:{
                id:id,
            }
        });
        selectDom[0].remove();
        window.alert("削除しました。");
        DisplayChangeIcon("none");
    }catch{
        console.log("err");
    }finally{
        isOperation = false;
    };
});


const formDom = document.getElementById('submitBtn');
formDom.addEventListener('click',async(e)=>{
    if(isOperation) return;
    try{
        isOperation = true;
        const btnValue = e.target.textContent;
        e.preventDefault();
        console.log(btnValue);
        if(btnValue == "追加"){
            if(!newTitle)return;
            if(!newMemo)return;
            const memoData = await axios.post('main/add',{
                userId:GetCookie_Value("Id"),
                title:newTitle,
                content:newMemo
            });
    
            console.log(memoData);
    
            const memo =`
            <li id="${memoData.data._id}" class="noSelect">
                <input type="checkbox">
                <p>${memoData.data.title}</p>
            </li>`
    
            listDom.insertAdjacentHTML('beforeend', memo);
    
            const dialogDom = document.getElementById("dialog");
            dialogDom.style.display = "none";
    
            window.alert("追加しました。");
    
        };
    
        if(btnValue == "更新"){
            if(!newTitle)return;
            if(!newMemo)return;
            const selectDom = document.getElementsByClassName("select");
            const id = selectDom[0].id;
            const memoData = await axios.post('main/edit',{
                id:id,
                title:newTitle,
                content:newMemo
            });
            const liDom = document.getElementById(id);
            const pDom = liDom.querySelector("p");
            pDom.textContent = newTitle;
    
            window.alert("更新しました。");
        };
    
    }catch{
        console.log("err");

    }finally{
        isOperation = false;
    }
});

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener('click',(e)=>{
     const dialogDom = document.getElementById("dialog");
     dialogDom.style.display = "none";
});
