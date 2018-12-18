var puzzles = 15; /*初始默认15块拼图*/
var xpuzzles = 4; /*默认行列均为4块拼图*/
var time = 0;
var t;
var step = 0;
var isBegin = false;

"use strict";
$(document).ready(function() {
    addDiv(xpuzzles);
    init();
    $('#stepDisplay').val(step);
    $('#puzzle').mouseover(detection);
    $('#shuffle').click(start);
    $('#showOriginal').click(show);
    changeLevel();
});

function addDiv(num) {
    var n = num * num ;
    for (var i = 1; i <= n ; i++) {
        $('#puzzle').append('<div class="style' + num + ' style' + num + '_' + i + " column" + ((i - 1) % num + 1) + " row" + (parseInt((i - 1) / num) + 1) + '">' + i + '</div>');
    }
}
/*初始化*/
function init() {
    time = 0;
    step = 0;
    $('#timeDisplay').val(time);
    $('#stepDisplay').val(step);
    isBegin = false;
    var x = $('#puzzle').children();
    for (var i = 0; i <= puzzles; i++) {
        if (i != x.length - 1) {
            $(x[i]).addClass("notempty");
            $(x[i]).attr("id",i);
        }
        $(x[puzzles]).attr("id","empty");
    }
}
/* 改变难度，3*3，4*4，5*5 */
function changeLevel() {
    $('#level').change(function(event) {
        $('#puzzle').empty();
        xpuzzles = this.value;
        puzzles = xpuzzles * xpuzzles - 1;
        addDiv(xpuzzles);
        init();
    });
}
/*计时*/
function timeCounting() {
    $('#timeDisplay').val(time);
    if (isBegin == true)
        time += 1;
    t = setTimeout("timeCounting()", 1000);
}
/*游戏开始*/
function start() {
    time = 0;
    step = 0;
    isBegin = true;
    clearTimeout(t);
    timeCounting();
    $('#stepDisplay').val(step);
    $("#empty").removeClass("complete");
    mix();
}
/*打乱拼图*/
function mix() {
    _.times(800, function() {
        var x = $("#"+parseInt(Math.random() * puzzles).toString());
        if (judge(x, $("#empty"))) {
            move(x);
        }
    });
}
/*判断该拼图是否可移动*/
function judge(elem, blank) {
    var disX = Math.abs(elem.offset().left - blank.offset().left);
    var disY = Math.abs(elem.offset().top - blank.offset().top);
    if (Math.abs(disX - disY) == (480 / xpuzzles) && disX + disY == (480 / xpuzzles)) {
        return true;
    }
    return false;
}
/*空白拼图与旁边的拼图交换位置*/
function move(elem) {
    if (elem.attr("id") != "puzzle") {
        for (var i = 1; i <= puzzles + 1; i++) {
            var s = "" +  "style" + xpuzzles + "_" + i;
            if ($("#empty").hasClass(s) == true)  var s1 = s;
            if (elem.hasClass(s) == true)  var s2 = s;
        }
        $("#empty").removeClass(s1);
        $("#empty").addClass(s2);
        elem.removeClass(s2);
        elem.addClass(s1);
    }
}
/*拼图移动*/
function detection() {
    var ex = $(event.target);
    ex.mouseleave(recover);
    if (judge(ex, $("#empty"))) {
        ex.addClass("movablepiece");
    }
    window.event.srcElement.onclick = function() {
        if (judge(ex, $("#empty")) && isBegin) {
            move(ex);
            step++;
            $("#stepDisplay").val(step);
            if (is_win()) win();
        }
    };
}
/*当鼠标从可移动拼图上离开，该拼图样式恢复*/
function recover() {
    if ($(event.target).attr("id") != 'empty') {
        $(event.target).removeClass("movablepiece");
    }
}
/*判断拼图是否还原成功*/
function is_win() {
    for (var i = 1; i <= $(".notempty").length; i++) {
        var s = "" +  "style" + xpuzzles + "_" + i;
        if (!$($(".notempty")[i - 1]).hasClass(s)) {
            return false;
        }
    }
    return true;
}
/*拼图还原成功*/
function win() {
    $("#empty").addClass("complete");
    time -= 1;
    setTimeout(function(){alert("Congratulations! You have cost " + time + " s and " + step + " steps.");}, 100);
    isBegin = false;
    clearTimeout(t);
}
/*显示或隐藏原图*/
function show() {
    $('#original').toggleClass("original");
    $('#original').toggleClass("show");
}