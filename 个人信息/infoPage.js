var username = document.getElementById('name')
var school = document.getElementById('school')
var major = document.getElementById('course')

var btn1 = document.getElementById('btn1')
console.log(username,school,major)
getInfo();

btn1.addEventListener('click',function(){
    Toast("眼观真不错")
})

function getInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET","http://119.91.218.4:443/my/getinfo",true)
    xhttp.setRequestHeader('Authorization', localStorage.getItem('token'));
    xhttp.send()
    xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status == 200){
            const res=JSON.parse(this.response) 
            console.log(res)
            Usercount(res.info.username,res.info.school,res.info.major)
         }
        }
}

function Usercount(username_1,school_1,major_1){
    username.textContent = username_1
    school.textContent =school_1
    major.textContent =major_1
}


function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 0.5;
      m.style.opacity = '0';
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
  }