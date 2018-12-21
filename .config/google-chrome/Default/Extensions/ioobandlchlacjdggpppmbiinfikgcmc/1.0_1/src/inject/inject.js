/* 
#
# FETCH WEBSITE EDITOR FOR SITEGAINER IF USER IS LOGGED IN
#
*/


(function () { 
	  if (document.addEventListener) {
		 var d = new Date(); 
		 var cb = "sg_app-" + d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + "-" + d.getHours(); 
		 var s = document.createElement("script");
		 s.async = true;s.src = "https://sitegainer.com/sg_app.js?cb="+cb;
		var s0 = document.getElementsByTagName("script")[0]; 
	s0.parentNode.insertBefore(s, s0);
	 }   
})(); 