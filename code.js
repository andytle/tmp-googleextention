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
        $(this).find('td').each(function(){
            var td = $(this);
            $(this).find('font').each(function(){
                count = count + 1;
                if (count == 12){
                    var rating = -1;
                    var profName = $(this).html().split('<')[0].replace(/,/g,"").trim();
                    var message = "";
                    for (var i = 0; i< json.length; i++){
                        if (profName == json[i].tFname + " " + json[i].tLname){                        
                            $(this).wrap('<a href='+ rmu_link + json[i].tid + '/>');
                            message = message + profName + "<br>";
                            message = message + "Score: " + json[i].overall_rating + "<br>";
                            message = message + json[i].tNumRatings + " ratings";
                            rating = json[i].overall_rating;
                            break;
                        }
                    }
                    if (message == "") {
                        message = profName + "<br>Data Not Found";
                    }
                    if (!isNaN(rating) && rating != -1) {
                        if (rating < 3) {
                            td.css("background-color", "red");
                        } else if (rating < 4) {
                            td.css("background-color", "yellow");
                        } else {
                            td.css("background-color", "LightGreen");
                        }
                    }
                    $(this).mouseenter(function(){    
                        if (profName != ""){
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
});