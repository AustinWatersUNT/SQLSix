$(document).ready(function () {

    var questionNumber=0;
    var questionBank=new Array();
    var stage="#game1";
    var stage2=new Object;
    var questionLock=false;
    var numberOfQuestions;
    var score=0;
    var location;
    var adult;
    var children;
    var rate;

    $.getJSON('./json/quiz.json', function(data) {

        for(i=0;i<data.quizlist.length;i++){
            questionBank[i]=new Array;
            questionBank[i][0]=data.quizlist[i].question;
            questionBank[i][1]=data.quizlist[i].option1;
            questionBank[i][2]=data.quizlist[i].option2;
            questionBank[i][3]=data.quizlist[i].option3;
            questionBank[i][4]=data.quizlist[i].option4;
        }
        numberOfQuestions=questionBank.length;


        displayQuestion1();
    })//gtjson

    function displayQuestion1(){

        var q1;
        var q2;
        var q3;
        var q4;
        q1=questionBank[questionNumber][1];
        q2=questionBank[questionNumber][2];
        q3=questionBank[questionNumber][3];
        q4=questionBank[questionNumber][4];

        $(stage).append('<div  class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="pix"><img src="'+q1+'"></div><div id="2" class="pix"><img src="'+q2+'"></div><div id="3" class="pix"><img src="'+q3+'"></div><div id="3" class="pix"><img src="'+q4+'"></div>');

        $('.pix').click(function(){
            if(questionLock==false){questionLock=true;
                //correct answer
                if(this.id==1){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    location="NY";
                }
                //wrong answer
                if(this.id==2){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    location="TX";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==3){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    location="FL";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==4){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    location="CA";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                setTimeout(function(){changeQuestion1()},1000);
            }})
    }//display question

    function changeQuestion1(){

        questionNumber++;

        if(stage=="#game1"){stage2="#game1";stage="#game2";}
        else{stage2="#game2";stage="#game1";}

        if(questionNumber<numberOfQuestions){displayQuestion2();}else{displayFinalSlide();}

        $(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
        $(stage).animate({"right": "+=800px"},"slow", function() {questionLock=false;});
    }//change question

    function displayQuestion2(){

        var q1;
        var q2;
        var q3;
        var q4;
        q1=questionBank[questionNumber][1];
        q2=questionBank[questionNumber][2];
        q3=questionBank[questionNumber][3];
        q4=questionBank[questionNumber][4];

        $(stage).append('<div  class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="pix"><img src="'+q1+'"></div><div id="2" class="pix"><img src="'+q2+'"></div><div id="3" class="pix"><img src="'+q3+'"></div><div id="3" class="pix"><img src="'+q4+'"></div>');

        $('.pix').click(function(){
            if(questionLock==false){questionLock=true;
                //correct answer
                if(this.id==1){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    adult="1";
                    children="0";
                }
                //wrong answer
                if(this.id==2){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    adult="2";
                    children="0";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==3){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    adult="1";
                    children="1";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==4){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    adult="2";
                    children="2";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                setTimeout(function(){changeQuestion2()},1000);
            }})
    }//display question

    function changeQuestion2(){

        questionNumber++;

        if(stage=="#game1"){stage2="#game1";stage="#game2";}
        else{stage2="#game2";stage="#game1";}

        if(questionNumber<numberOfQuestions){displayQuestion3();}else{displayFinalSlide();}

        $(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
        $(stage).animate({"right": "+=800px"},"slow", function() {questionLock=false;});
    }//change question
    function displayQuestion3(){

        var q1;
        var q2;
        var q3;
        var q4;
        q1=questionBank[questionNumber][1];
        q2=questionBank[questionNumber][2];
        q3=questionBank[questionNumber][3];
        q4=questionBank[questionNumber][4];

        $(stage).append('<div  class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="pix"><img src="'+q1+'"></div><div id="2" class="pix"><img src="'+q2+'"></div><div id="3" class="pix"><img src="'+q3+'"></div><div id="3" class="pix"><img src="'+q4+'"></div>');

        $('.pix').click(function(){
            if(questionLock==false){questionLock=true;
                //correct answer
                if(this.id==1){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    rate="1";
                }
                //wrong answer
                if(this.id==2){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    rate="2";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==3){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    rate="3";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                if(this.id==4){
                    $(stage).append('<div class="feedback1">Good Choice</div>');
                    rate="4";
                    //$(stage).append('<div class="feedback2">WRONG</div>');
                }
                setTimeout(function(){changeQuestion3()},1000);
            }})
    }//display question

    function changeQuestion3(){

        questionNumber++;

        if(stage=="#game1"){stage2="#game1";stage="#game2";}
        else{stage2="#game2";stage="#game1";}

        if(questionNumber<numberOfQuestions){displayQuestion3();}else{displayFinalSlide();}

        $(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
        $(stage).animate({"right": "+=800px"},"slow", function() {questionLock=false;});
    }//change question

    function displayFinalSlide(){

        var query = {
            State: location,
            Adults: adult,
            Children: children,
            RateOption: rate
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(query), //Must stringify all JSON objects before sending
            url: './quiz/quizQuery', //Same URL is associated on the server
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        });

        $(stage).append('<div class="questionText">You have finished the quiz!<br><br>State: '+location+'<br>Adults: '+adult+' Children: '+children+'<br>Rate: '+rate+'</div>');

    }//display final slide

});//doc ready