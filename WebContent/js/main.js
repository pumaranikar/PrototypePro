/**
 * Created by Vimal Kumar on 10/9/2014.
 */

$( document ).ready(function() {
    var x1, x2, y1, y2;

//Variable indicates wether a mousedown event within your selection happend or not
    var selection = false;

// Global mouse button variables
    var gMOUSEUP = false;
    var gMOUSEDOWN = false;

    sPos = $("#selection").position();

// Global Events if left mousebutton is pressed or nor (usability fix)
    $(document).mouseup(function () {
        gMOUSEUP = true;
        gMOUSEDOWN = false;
    });
    $(document).mousedown(function () {
        gMOUSEUP = false;
        gMOUSEDOWN = true;
    });

// Selection frame (playground :D)
    $("#YDR-Frame").mousedown(function (e) {
        selection = true;
        // store mouseX and mouseY
        x1 = e.pageX;
        y1 = e.pageY;
        $('#object1').remove();
    });

// If selection is true (mousedown on selection frame) the mousemove
// event will draw the selection div
    $('#YDR-Frame').mousemove(function (e) {
        if (selection) {
            // Store current mouseposition
            x2 = e.pageX;
            y2 = e.pageY;

            // Prevent the selection div to get outside of your frame
            //(x2+this.offsetleft < 0) ? selection = false : ($(this).width()+this.offsetleft < x2) ? selection = false : (y2 < 0) ? selection = false : ($(this).height() < y2) ? selection = false : selection = true;;
            // If the mouse is inside your frame resize the selection div
            if (selection) {
                // Calculate the div selection rectancle for positive and negative values
                var TOP = (y1 < y2) ? y1 : y2;
                var LEFT = (x1 < x2) ? x1 : x2;
                var WIDTH = (x1 < x2) ? x2 - x1 : x1 - x2;
                var HEIGHT = (y1 < y2) ? y2 - y1 : y1 - y2;

                // Use CSS to place your selection div
                $("#divDragable").css({
                    position: 'absolute',
                    border: '2px solid #564dff',
                    zIndex: 5000,
                   left: LEFT,
                    top: TOP,
                    width: WIDTH,
                   height: HEIGHT
                });

                $("#divDragable").show();
                $("#selection").show();

                // Info output
                $('#selection').html('( x1 : ' + x1 + ' )  ( x2 : ' + x2 + ' )  ( y1 : ' + y1 + '  )  ( y2 : ' + y2 + ' )' );
                  //  +
                   // '  SPOS:' + TOP);

            }
        }
    });
// Selection complete, hide the selection div (or fade it out)
    $('#YDR-Frame').mouseup(function () {
        selection = false;
        $("#divDragable").hide();
        getIt();
        //alert(('<li>[ x1 : ' + x1 + ' , x2 : ' + x2 + ' , y1 : ' + y1 + '  , y2 : ' + y2 + ' ]</li>'))
       // $("#status2 select").append('<option>[ x1 : ' + x1 + ' , x2 : ' + x2 + ' , y1 : ' + y1 + '  , y2 : ' + y2 + ' ]</option>');
    });
// Usability fix. If mouse leaves the selection and enters the selection frame again with mousedown
    $("#YDR-Frame").mouseenter(function () {
        (gMOUSEDOWN) ? selection = true : selection = false;
    });
// Usability fix. If mouse leaves the selection and enters the selection div again with mousedown
    $("#selection").mouseenter(function () {
        (gMOUSEDOWN) ? selection = true : selection = false;
    });
// Set selection to false, to prevent further selection outside of your selection frame
    $('#YDR-Frame').mouseleave(function () {
        selection = false;
    });

    $("#btnAddEvent").click(function () {
        if(x1 != undefined) {
            var selectedItem = $("#imgSelect option:selected").text();
            name=$("#YDR-Frame img:first-child").attr("name");
            $("#lsbox").append('<option >['+name+',' + x1 + ' ,  ' + x2 + ' ,  ' + y1 + '  ,  ' + y2 + ' ,' + selectedItem + ']</option>');

            index=findWithAttr(imageSource, 'Key', selectedItem)
            if(index+1<=imageSource.length) {
                $("#targetImage").attr("src", imageSource[index].Source).attr("name", imageSource[index].Key);
                $("#lblImageName").text(imageSource[index].Key)
            }
        }
    })
    var jsonArray=[];
    $("#btnPreview").click(function () {
       /* var dialog = document.getElementById('window');
        dialog.show()*/
        $("#divNavigator").hide();
        $("#main").hide( "slow" );
        $("#preview").show();

       // startSlide="slide1.jpg";  // need to get it dynamically
        jsonArray.length=0;
        $("#lsbox > option").each(function() {
           // alert(this.value);
            if(this.value!="dragImage") {
                result=this.value.replace('[','').replace(']','').split(',');
                jsonArray.push(
                    {
                        "from":result[0],
                        "X1":result[1],
                        "X2":result[2],
                        "Y1":result[3],
                        "Y2":result[4],
                        "To":result[5]
                    }
                );
            }
        });
        if(jsonArray.length>0) {
            //Setup start
            index = findWithAttr(imageSource, 'Key', jsonArray[0].from)

            $("#previewImage").attr("src", imageSource[index].Source).attr("name", imageSource[index].Key);
        }
    });

    $( "#help" ).click(function() {
        $( "#helpmenu" ).slideToggle( "slide" );

    });
    $("#previewImage").click(function(e){

        Ix=e.clientX;
        Iy=e.clientY;
        name=$("#previewImage").attr("name");
        $.each(jsonArray,function(index,value){
            if(value.from==name)
            {
                if(Ix>=value.X1 && Ix<= value.X2 && Iy>= value.Y1 && Iy <= value.Y2)
                {
                    index=findWithAttr(imageSource, 'Key', value.To)
                    $("#previewImage").attr( "src",imageSource[index].Source ).attr("name",imageSource[index].Key);
                    return;
                }
            }
        })

    })

    $("div .close").click(function () {
        $("#preview").hide();
        $("#main").show();
        $("#divNavigator").show();
    });

    $("#btnRemoveEvent").click(function () {
       // var selectedItem=$("#lsbox option:selected" ).text();
        //alert(selectedItem);
        if( $("#lsbox option:selected").val()!= "dragImage") {
            $("#lsbox option:selected").remove();
        }
        //$("#status2 select").append('<option>[ x1 : ' + x1 + ' , x2 : ' + x2 + ' , y1 : ' + y1 + '  , y2 : ' + y2 + ' ]</option>');
    })
   /* $("#exit").click(function () {
        var dialog = document.getElementById('window');
        dialog.close();
    });*/
   // var slides=["Slide1","Slide2"];
    $("#triangle-right").click(function(){

        name=$("#YDR-Frame img:first-child").attr("name");
        index=findWithAttr(imageSource, 'Key', name)//imageSource.indexOf(name)
        if(index+1<=imageSource.length)
        {
            $("#YDR-Frame img:first-child").attr( "src",imageSource[index+1].Source ).attr("name",imageSource[index+1].Key);
            $("#lblImageName").text(imageSource[index+1].Key)
        }
        //alert(name);
    });
    $("#triangle-left").click(function(){

        name=$("#YDR-Frame img:first-child").attr("name")
        index=findWithAttr(imageSource, 'Key', name)
        if(index-1>=0)
        {
            $("#YDR-Frame img:first-child").attr( "src",imageSource[index-1].Source ).attr("name",imageSource[index-1].Key);
            $("#lblImageName").text(imageSource[index-1].Key)
        }
        //alert(name);
    });
    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
    }

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 5*1024*1024, initFS, errorHandler);
    function initFS(fs){
        //alert("Welcome to Filesystem! It's showtime :)"); // Just to check if everything is OK :)
        // place the functions you will learn bellow here
    }

    function errorHandler(){
        //console.log('An error occured');
    }
    function loadImages() {
        if (imageSource.length != 0) {

            $("#imgSelect").empty();
            $.each(imageSource, function (key, value) {
                $("#imgSelect").append('<option value="' + value.Key + '"  >' + value.Key + '</option>');

            });
            $("#targetImage").attr("src",imageSource[0].Source).attr("name",imageSource[0].Key);
            $("#lblImageName").text(imageSource[0].Key)
            //alert(imageSource[0].Key);
            $("#"+imageSource[0].Key.replace(".","")).attr("class","slideSelector");

            //css('border-color', 'rgb(192,94,94').css('border-style','solid');
            //$('#imgSelect').val(imageSource[0].Key);
        }
    };

    $( "#imgSelect" ).change(function() {
        var item=$(this);
        $(".slideSelector").removeClass("slideSelector")
        $("#"+item.val().replace(".","")).attr("class","slideSelector");


       $("#lsboxImages").scrollTop($("#lsboxImages").scrollTop() + $("#"+item.val().replace(".","")).position().top);
       // $("#"+item.val()).offset().top

        //alert(item.val())
    });

    var imageSource=[];
    var imageCount;
    $("#FileLocation").change(function(evt){

            var files = evt.target.files; // FileList object
        imageCount=files.length;
        $("#lsboxImages").empty();
        for (var i = 0, f; f = files[i]; i++) {
            (function (file,i) {
                var reader = new FileReader();
                var name = file.name;
                reader.onload = function (e) {

                    imageSource.push({
                                    "Key":name,
                                   "Source": reader.result
                    });

                    $("#lsboxImages").append('<div id="'+ name.replace(".","") +'">' + name +
                        '<img src=' + reader.result + ' name="' + name + '" id="img1" width="250px" height="250px">' +
                        '</div>');
                    if(imageCount==imageSource.length){loadImages();} //Object.keys(imageSource)
                }
                reader.readAsDataURL(file);

            })(f,i);
        }


    });




    //Select the image from the div
   $("#lsboxImages img").click(function()
   {
    alert(this.id)
   });
//Function for the select
    function getIt() {
        var top=y1;
        var left=x1;
        var width=x2-x1;
        var height=y2-y1;
        var newdiv1 = $( "<div id='object1' style='border: 2px solid #564dff;width:"+width+"px;" +
                    "height:"+height+"px;position: absolute;" +
                        "top:"+top+"px; left:"+left+"px; '/>" )
        $("#YDR-Frame").append(newdiv1);
        // Get all elements that can be selected
       /* $(".mytable").each(function () {
            var p = $(this).offset();
            // Calculate the center of every element, to save performance while calculating if the element is inside the selection rectangle
            var xmiddle = p.left + $(this).width() / 2;
            var ymiddle = p.top + $(this).height() / 2;
            if (matchPos(xmiddle, ymiddle)) {
                // Colorize border, if element is inside the selection
                $(this).css({
                    border: "1px solid red"
                });
            }

        });*/
    }

    function matchPos(xmiddle, ymiddle) {
        // If selection is done bottom up -> switch value
        if (x1 > x2) {
            myX1 = x2;
            myX2 = x1;
        } else {
            myX1 = x1;
            myX2 = x2;
        }
        if (y1 > y2) {
            myY1 = y2;
            myY2 = y1;
        } else {
            myY1 = y1;
            myY2 = y2;
        }
        // Matching
        if ((xmiddle > myX1) && (xmiddle < myX2)) {
            if ((ymiddle > myY1) && (ymiddle < myY2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

});