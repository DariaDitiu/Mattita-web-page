$(document).ready(function(){
	var click = false;
	$('#show-menu').click(function(){
		if(click == false){
			$('#new-collection').css("opacity", "0.2");
			click = true;
		}else{
			$('#new-collection').css("opacity", "1");
		}

	})
})