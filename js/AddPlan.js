//点击列表的时候宽度什么的要改变
//展示出选项

//几天周几
var weekday=new Date().getDay();
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


//点击添加（添加计划）
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
        Toast("gooodddddd");
        loadCourse(params)
    }
    
})



//上传课程函数
function loadCourse(params){
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
    xhttp.send(JSON.stringify(params));
}