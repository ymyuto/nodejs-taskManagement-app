const inputIdDom = document.getElementById('id');
const inputPasswordDom = document.getElementById('password');
var id = "";
var password = "";
inputIdDom.addEventListener('change',(e)=>{
    id = e.target.value;
    console.log(id);
});

inputPasswordDom.addEventListener('change',(e)=>{
    password = e.target.value;
    console.log(password);
});

function ClearInput(){
    inputIdDom.value = "";
    inputPasswordDom.value = "";
    id = "";
    password = "";
};
    

const formDom = document.getElementById('form');

formDom.addEventListener('submit',async(e)=>{
    if(!id,!password)return;
    e.preventDefault();
    console.log(e.submitter.id);
    try{
        if(e.submitter.id=="register"){
            console.log("reg");
            await axios.post('/register',{
                Id:id,
                Password:password,
            });
            ClearInput();
            window.alert("登録できました。");
        }else{
            console.log("log");
            const user = await axios.get('/rogin',{
                params:{
                    Id:id,
                    Password:password,
                }
            });

            document.cookie = `Id=${user.data.Id}`;

            location.href = '/main';
        };

    }catch(err){
        console.log(err);
        window.alert(err.response.data[0].message);
    };
    
});