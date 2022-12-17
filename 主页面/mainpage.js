const planHTMLStr=['<div class="course_box_simple"><img src="','" alt="" class="course_pic_simple"><div class="course_link_simple"><a href="','" target="blank">'
,'</a></div><img src="../imgs/完成.png" alt="" class="finish" data-order="','" onclick="ListenDel(this)"></div>']

const RcomHTMLStr = ['<div class="course_box" data-order="','" > <img src="','" alt="" class="course_pic"><div class="course_link"><a href="','" target="blank">','11</a></div></div>']

//计划小卡片HTML
var arr=[]
//全局变量arrRem用于存放所有推荐课程的HTML标签
var arrRem=[]
//全局变量arrScrem用于存放所有同学推荐课程的HTML标签
var arrScrem=[];
// 进入页面先获得周几,获得基础的卡片
var weekday=new Date().getDay();
if(weekday==0)weekday=7
let token=localStorage.getItem('token')
var dayString=['周一','周二','周三','周四','周五','周六','周日']
var content=document.querySelector('.card')
content.id=weekday
content.innerHTML="<hr><h2>"+dayString[weekday-1]+"</h2>"
changePlan(content,Number(weekday),content.innerHTML)

//获取推荐
getScrem()
getRanrem()

//获取周几
var cweekday = 0 ;
//改变按钮颜色
const weeklist = document.querySelectorAll(".week-block")
for(var i=0;i<weeklist.length;i++){
    weeklist[i].addEventListener("click",function(){
        for(var j=0;j<weeklist.length;j++){
            weeklist[j].style.background="#fff"
        }
        this.style.background="rgba(0,0,0,0.3)"
        cweekday=this.dataset.day
    })
}



//点击列表的时候宽度什么的要改变
//展示出选项
const addplan=document.querySelector('.addplan')
addplan.addEventListener('click',function(){
    console.log("clicked")
    const addBox=document.querySelector('.addBox')
    const black_overlay=document.querySelector('.black_overlay')    //全局遮罩效果
    if(addBox.style.display=="none"){
        addBox.style.display="block"
        black_overlay.style.display="block"
        addplan.style.transform="rotate(45deg)"
    }
    else{
        addBox.style.display="none"
        black_overlay.style.display="none"
        addplan.style.transform="rotate(0deg)"
    }
   
})
const submitPlan=document.querySelector('.submitPlan')
submitPlan.addEventListener('click',function(){
    const curl=document.querySelector('.curl').value
    const ctitle=document.querySelector('.ctitle').value
    
    var params={
        title:ctitle,
        url:curl,
        weekday:cweekday
    }
    if(weekday>="0"&&weekday<="7"){
        loadCourse(params)
    }
    
})
//变化时间,卡片内容变化
const next=document.querySelector('.next')
next.addEventListener('click',function(){
    const card=document.querySelector('.card')
    if(card.id!=7){
       card.id=String(Number(card.id)+1); 
    }
    else{
        card.id="1";
    }
    console.log(card.id)
    card.innerHTML="<hr><h2>"+dayString[card.id-1]+"</h2>"
    //获取课程
    changePlan(card,Number(card.id),card.innerHTML)
    // console.log(card.id)
})
const previous=document.querySelector('.previous')
previous.addEventListener('click',function(){
    const card=document.querySelector('.card')
    if(card.id!=1){
        card.id=String(Number(card.id)-1);
    }
    else{
        card.id="7"
    }
    card.innerHTML="<hr><h2>"+dayString[card.id-1]+"</h2>"
    
    //获取课程
    changePlan(card,Number(card.id),card.innerHTML)
})
function changePlan(card,day,dayMes){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://119.91.218.4:443/my/getplan", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            arr=[]
            const res=JSON.parse(this.response) 
            if(res.status==0){
                var HTMLStr=""
                for(var i=0;i<res.plan.length;i++){
                    var plancard=getplancard(res.plan[i],i)
                    arr.push(plancard)
                    HTMLStr+=plancard;
                }
                HTMLStr+=dayMes;
                card.innerHTML=HTMLStr
            }
            
        }
    }
    const params={
        weekday:day
    }
    xhttp.send(JSON.stringify(params));
}
//将计划信息打包封装为html元素
function getplancard(aplan,i){
    var Str=planHTMLStr[0]+"http://"+aplan.pic+planHTMLStr[1]+aplan.url+planHTMLStr[2]+aplan.title+planHTMLStr[3]+i+planHTMLStr[4]
    // console.log(Str)
    // var Str='<img src="'+aplan.pic+'" class="course_pic"></img>'
     return Str;
}
//上传课程函数
function loadCourse(params){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://119.91.218.4:443/set/loadcourse", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response)
            if(params.weekday>="1"&&params.weekday<="7"){
                showTheDay(params.weekday)
            } 
            Toast(res.message,1000)
            
        }
    }
    xhttp.send(JSON.stringify(params));
}


//获得随机推荐 ----------------------------------------------------------------------------------------------------------------------------------
function getRanrem(){
    var xhttp = new XMLHttpRequest();
    let token=localStorage.getItem('token')
    xhttp.open("GET", "http://119.91.218.4:443/recom/ranrem", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response).course 
            console.log(res.course[0])
            var Str="";
            if(res.status==0){
                for(var i=0;i<res.course.length;i++){
                    var temp=getRanremcard(res.course[i],i)
                    arrRem.push(temp)
                    //分页显示
                    if(i<6){
                        Str+=temp;
                    }
                }
                document.querySelector('.BBox2').innerHTML=Str;
            }
            
        }
    }
    xhttp.send();
}

//获得同学校推荐
function getScrem(){
    var xhttp = new XMLHttpRequest();
    let token=localStorage.getItem('token')
    xhttp.open("GET", "http://119.91.218.4:443/recom/screm", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response).course 
            console.log(res)
            var Str="";
            if(res.status==0){
                for(var i=0;i<res.course.length;i++){
                    var temp=getRanremcard(res.course[i],i)
                    arrScrem.push(temp)
                    //分页显示
                    if(i<8){
                        Str+=temp;
                    }
                }
                document.querySelector('.BBox1').innerHTML=Str;
            }
            
        }
    }
    xhttp.send();
}


//展示某一天的信息
function showTheDay(weekday){
    weekday=Number(weekday)
    var content=document.querySelector('.card')
    content.innerHTML="<hr><h2>"+dayString[weekday-1]+"</h2>"
    changePlan(content,Number(weekday),content.innerHTML)
}
function ListenDel(is){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://119.91.218.4:443/set/delcourse", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response)
            if(res.status==0){
                console.log(res)
                reShow(is.dataset.order)
            }
        }
    }
    //获取一下url和weekday
    var card=document.querySelector('.card');
    const day=card.id;
    var a=document.querySelectorAll('a')[is.dataset.order]
    const href=a.href
    var params={
        weekday:day,
        url:href
    }
    xhttp.send(JSON.stringify(params));
}
//删除或增加后更新显示
function reShow(order){
    const card=document.querySelector('.card')
    console.log(order)
    arr.splice(order,1)
    console.log(arr)
    var HTMLStr=""
    for(var i=0;i<arr.length;i++){
        HTMLStr+=arr[i]
    }
    card.innerHTML="<hr><h2>"+dayString[card.id-1]+"</h2>"
    card.innerHTML=HTMLStr+card.innerHTML
}

const changePrefer_one=document.querySelector(".one")
const changePrefer_three=document.querySelector(".three")

changePrefer_one.addEventListener("click", ()=>{
    showDiv1()
    console.log("one")
})
changePrefer_three.addEventListener("click", ()=>{
    showDiv2()
})
function showDiv1() {
    var box1=document.getElementById("box1");
    box1.style.visibility='visible';
    box2.style.visibility='hidden';
    changePrefer_one.style.outline='solid'
    changePrefer_three.style.outline='none'
}
function showDiv2() {
    var box2=document.getElementById("box2");

    box2.style.visibility='visible';
    box1.style.visibility='hidden';
    changePrefer_three.style.outline='solid'
    changePrefer_one.style.outline='none'
}


function getRanremcard(aplan,i){
    var Str=RcomHTMLStr[0]+i+RcomHTMLStr[1]+"http://"+aplan.coursePhoto+RcomHTMLStr[2]+aplan.courseUrl+RcomHTMLStr[3]+aplan.courseTitle+RcomHTMLStr[4]
    console.log(Str)
     return Str;
}
