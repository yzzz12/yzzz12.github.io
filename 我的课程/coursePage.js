const planHTMLStr=['<div class="course_box" data-order="','" onmouseover="ShowOpts(this)" onmouseout="Recover(this)"> <img src="','" alt="" class="course_pic"><div class="course_link"><a href="','" target="blank">'
,'</a></div><div class="showopt" onclick="jumpToCourse()">进入课程</div><div class="showopt" onclick="choseDate()">添加到计划</div><div class="showopt" onclick="delCourse()">删除课程</div></div>']
let token=localStorage.getItem('token')
//全局变量arr用于存放所有课程的HTML标签
var arr=[];
//全局变量page用于标识目前在第几页
var page=0;
//用于储存原来的HTML元素
var preHtml=""
//用于标识现在鼠标放在第几个课程box上
var cid;
//日期选择的时候存储周几,用于确认添加的时候作为参数发送
var date_day=0;
//调用函数获得全部课程
getAll();
//下一页
const Next=document.querySelector('.next')
//上一页
const Previous=document.querySelector('.previous')
//确认添加计划
const sure=document.querySelector('.sure')
//取消添加计划
const cancel=document.querySelector('.cancel')
//取消添加计划
Next.addEventListener('click',function(){
    nextPage()
})
Previous.addEventListener('click',function(){
    previousPage()
})
sure.addEventListener('click',function(){
    SureAdd()
})
cancel.addEventListener('click',function(){
    CancelAdd()
})
function getAll(){
    var xhttp = new XMLHttpRequest();
    let token=localStorage.getItem('token')
    xhttp.open("GET", "http://119.91.218.4:443/my/getcourse", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response) 
            var Str="";
            if(res.status==0){
                for(var i=0;i<res.course.length;i++){
                    var temp=getplancard(res.course[i],i)
                    arr.push(temp)
                    //分页显示
                    if(i<8){
                        Str+=temp;
                    }
                }
                document.querySelector('.Box').innerHTML=Str;
            }
            
        }
    }
    xhttp.send();
}
//展示跳转课程，添加到计划以及删除课程的选项
function ShowOpts(is){
    //计划日期选择未被调用的时候才可以改变
        cid=is.dataset.order;
    is.querySelector('.course_pic').style.filter="blur(3px)"
    is.querySelector('.course_link').style.filter="blur(3px)"
    var showopt=is.querySelectorAll('.showopt')
    for(var i=0;i<showopt.length;i++){
        showopt[i].style.visibility="visible"
    }
}
//恢复原内容
function Recover(is){
    is.querySelector('.course_pic').style.filter=""
    is.querySelector('.course_link').style.filter=""
    var showopt=is.querySelectorAll('.showopt')
    for(var i=0;i<showopt.length;i++){
        showopt[i].style.visibility="hidden"
    }
}
//下一页
function nextPage(){
    var x=arr.length%8;
    var pages;
    if(x!=0){
        pages=arr.length/8-1;
    }
    else{
        pages=Math.floor(arr.length/8)
    }
    if(page<pages){
        page+=1;
        var temp=page*8+8;
        var Str=""
        for(var i=page*8;i<temp&&i<arr.length;i++){
            Str+=arr[i]
        }
        document.querySelector('.Box').innerHTML=Str;
    }
}
//上一页
function previousPage(){
    if(page>0){
          page-=1;
        var temp=page*8+8;
        var Str=""
        for(var i=page*8;i<temp;i++){
            Str+=arr[i]
        }
        document.querySelector('.Box').innerHTML=Str;
    }
  
}
//点击跳转，添加到计划与删除计划
function jumpToCourse(){
    var url=document.querySelectorAll('.course_box')[cid-8*page].querySelector('.course_link').querySelector("a").href
    window.open(url,"_blank");    
    //若点击跳转选择日期将消失
    const date=document.querySelector('.date')
    date.style.visibility="hidden"; 
}
function choseDate(){
    const date=document.querySelector('.date')
    date.style.visibility="visible";
    const dbtn=document.querySelectorAll('.dbtn')
    //当某一个按钮被点击的时候背景色改变
    for(var i=0;i<dbtn.length;i++){
        dbtn[i].addEventListener("click",function(){
            for(var j=0;j<dbtn.length;j++){
                dbtn[j].style.backgroundColor="#fff"
            }
            this.style.backgroundColor="rgba(0,0,0,0.3)"
            date_day=this.dataset.day
        })
    }
}
function SureAdd(){
    var href=document.querySelectorAll('.course_box')[cid-page*8].querySelector('.course_link').querySelector("a").href
    const date=document.querySelector('.date')
    date.style.visibility="hidden";
    CourseAdd(href,date_day);
}
function CancelAdd(){
    const date=document.querySelector('.date')
    date.style.visibility="hidden";
    const dbtn=document.querySelectorAll('.dbtn')
    for(var i=0;i<dbtn.length;i++){
        dbtn[i].style.backgroundColor="#fff"
    }
}
//添加到计划后的处理函数
function CourseAdd(curl,cday){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://119.91.218.4:443/set/loadcourse", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response)
            Toast(res.message,1000)
        }
    }
    var params={
        title:"",
        url:curl,
        weekday:cday
    }
    xhttp.send(JSON.stringify(params));
}
function delCourse(){
    var href=document.querySelectorAll('.course_box')[cid-8*page].querySelector('.course_link').querySelector("a").href
    console.log(cid,href)
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://119.91.218.4:443/set/delcourse", true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.setRequestHeader("Authorization",token);
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response)
            if(res.status==0){
                arr.splice(cid,1)
                reShow();
            }
        }
    }
    var params={
        weekday:0,
        url:href
    }
     xhttp.send(JSON.stringify(params));
       //若点击删除计划选择日期将消失
    const date=document.querySelector('.date')
    date.style.visibility="hidden"; 
}
function reShow(){
    var temp=page*8+8;
        var Str=""
        for(var i=page*8;i<temp&&i<arr.length;i++){
            Str+=arr[i]
        }
        document.querySelector('.Box').innerHTML=Str;
}
//拼接HTML字符串
function getplancard(aplan,i){
    var Str=planHTMLStr[0]+i+planHTMLStr[1]+"http://"+aplan.pic+planHTMLStr[2]+aplan.url+planHTMLStr[3]+aplan.title+planHTMLStr[4]
     return Str;
}
