$( document ).ready(function() {
    var rmu_link = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="
    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'https://raw.githubusercontent.com/andytle/rmp-chromeextention/master/data-scraper/dpu_rmp_data.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })(); 
    
    $('table tbody tr').each(function(){
        var count = 0;
        $(this).find('td font').each(function(){
            count = count + 1;
            if (count == 12){
                $(this).mouseenter(function(){    
                    var index;
                    var message = "";
                    for (var i = 0; i< json.length; i++){
                        if ($(this).html().split('<')[0] == json[i].tFname + " " + json[i].tLname){
                            index = i;  
                            break;
                        }
                        else 
                            index = -1;
                    }
                    
                    if (index == -1)
                        message = message + $(this).html().split('<')[0] + "<br>Data Not Found";
                    else {
                        message = message + $(this).html().split('<')[0] + "<br>";
                        message = message + "Score: " + json[index].overall_rating + "<br>";
                        message = message + json[index].tNumRatings + " ratings";
                        $(this).wrap('<a href='+ rmu_link + json[index].tid + '/>');
                    }
                    
                    if ($(this).html().split('<')[0].trim() != "&nbsp;" &&
                        $(this).html().split('<')[0].trim() != ""){
                        tippy(this, {
                            content: message,
                            animateFill: false,
                            animation: 'fade',
                            duration: [200,200]
                        });
                    }
                });
            };
        });
    });
});