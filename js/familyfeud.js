var app = {
  initData: {
    "Name things people lie about on resumes": [["Education", 28], ["Job title", 24], ["Length of time worked at a job", 18], ["Skills/experience", 15], ["Achievements", 11]],

    "Name something every student knows how to cook:": [
      ["Eggs", 34], 
      ["Mac and Cheese", 24], 
      ["Ramen", 23], 
      ["Hot dog", 12], 
      ["Dumplings", 7]],

    "Name a sport that might be canceled because of rain:": [
      ["Baseball", 34], 
      ["Football", 22], 
      ["Golf", 5], 
      ["Soccer", 4], 
      ["Tennis", 2]],

    "Name a Disney princess:": [
      ["Cinderella", 38], 
      ["Ariel", 22], 
      ["Jasmine", 10], 
      ["Belle", 12], 
      ["Elsa", 7]],

    "Name a reason you might go home early from work": [
      ["Sick", 37], 
      ["Emergency", 29], 
      ["Holiday", 20], 
      ["Quit", 14]],

    "Name a food that is hard to keep your face clean while eating": [
      ["Ice cream",  26], 
      ["Ribs",  25], 
      ["Spaghetti",  24], 
      ["Pizza", 10], 
      ["Watermelon", 4]],

    "Name a famous bear": [
      ["Winnie the Pooh", 38], 
      ["Smokey",  19], 
      ["Yogi",  17], 
      ["Ted/Teddy",  17], 
      ["Paddington", 16]],

    "If your company wanted people to hang around the office more, what should they bring in?": [
      ["Free food",  45],
      ["A TV set",  14],
      ["Alcohol",  13],
      ["Music", 9],
      ["Childcare", 4]],

    "Name a vegetable kids hate to eat": [
      ["Broccoli",  48], 
      ["Brussel sprouts",  15], 
      ["Pea",  12], 
      ["Spinach", 11], 
      ["Carrot", 7]],

    "Other than work, what do you talk to your coworkers about?": [["Family",  44], 
    ["Relationships",  21], 
    ["Sports",  14], 
    ["Weather", 6], 
    ["TV/Movies", 5], 
    ["Weekend", 4]],

    "Name something you might put on a salad": [
      ["Salad dressing",  45], 
      ["Croutons",  17], 
      ["Tomatoes",  12], 
      ["Bacon bits", 4], 
      ["Cheese", 4]],

    "Which Olympic sport would be most fun to watch live": [
      ["Swimming",  39], 
      ["Gymnastics",  24], 
      ["Basketball",  15], 
      ["Hockey", 9], 
      ["Track", 8], 
      ["Ice Skating", 5]],

    "Name a profession that works long hours": [
      ["Doctor",  38], 
      ["Police",  17], 
      ["Firefighter",  15], 
      ["Lawyer", 12], 
      ["Teacher", 11], 
      ["Nurse", 7]],

    "Name a sport that people bet on": [
      ["Football",  49], 
      ["Horse racing",  32], 
      ["Boxing",  8], 
      ["Basketball", 5]],

    "Name a sitcom that always seems to be re-running on TV": [
      ["The Big Bang Theory", 31], 
      ["Friends",  22], 
      ["Seinfeld",  9], 
      ["Frasier",  9], 
      ["Two and a Half Men", 8], 
      ["The Simpsons", 8], 
      ["The Fresh Prince of Bel-Air", 6]],
  },
  currentQ: 0,
  board: $("<div class='gameBoard'>"+
             "<div id='wrong'></div>"+
             "<!--- Scores --->"+
             "<div class='score' id='boardScore'>0</div>"+
             "<div class='score' id='team1' >0</div>"+
             "<div class='score' id='team2' >0</div>"+

             "<!--- Question --->"+
             "<div class='questionHolder'>"+
               "<span class='question'></span>"+
             "</div>"+

             "<!--- Answers --->"+
             "<div class='colHolder'>"+
               "<div class='col1'></div>"+
               "<div class='col2'></div>"+
             "</div>"+

             "<!--- Buttons --->"+
             "<div class='btnHolder'>"+
               "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>"+
               "<div id='newQuestion' class='button'>New Question</div>"+
               "<div id='awardTeam2' data-team='2'class='button'>Award Team 2</div>"+
             "</div>"+

           "</div>"),
  jsonLoaded: function(data){
    console.clear()
    app.allData   = data
    app.questions = Object.keys(data)
    app.makeQuestion(app.currentQ)
    $('.main').append(app.board)
  },
  // Action functions
  makeQuestion: function(qNum){
    var qText  = app.questions[qNum]
    var qAnswr = app.allData[qText]

    var qNum = qAnswr.length
        qNum = (qNum<8)? 8: qNum;
        qNum = (qNum % 2 != 0) ? qNum+1: qNum;

    var boardScore = app.board.find('#boardScore')
    var question   = app.board.find('.question')
    var col1       = app.board.find('.col1')
    var col2       = app.board.find('.col2')

    boardScore.html(0)
    question.html(qText.replace(/&x22;/gi,'"'))
    col1.empty()
    col2.empty()

    for (var i = 0; i < qNum; i++){
      var aLI
      if(qAnswr[i]){
        aLI = $("<div class='cardHolder'>"+
                  "<div class='card'>"+
                    "<div class='front'>"+
                      "<span class='DBG'>"+(i+1)+"</span>"+
                    "</div>"+
                    "<div class='back DBG'>"+
                      "<span>"+qAnswr[i][0]+"</span>"+
                      "<b class='LBG'>"+qAnswr[i][1]+"</b>"+
                    "</div>"+
                  "</div>"+
                "</div>")
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>")
      }
      var parentDiv = (i<(qNum/2))? col1: col2;
      $(aLI).appendTo(parentDiv)
    }

    var cardHolders = app.board.find('.cardHolder')
    var cards       = app.board.find('.card')
    var backs       = app.board.find('.back')
    var cardSides   = app.board.find('.card>div')

    TweenLite.set(cardHolders , {perspective:800});
    TweenLite.set(cards       , {transformStyle:'preserve-3d'});
    TweenLite.set(backs       , {rotationX:180});
    TweenLite.set(cardSides   , {backfaceVisibility:'hidden'});

    cards.data('flipped', false)

    function showCard(){
      var card = $('.card', this)
      var flipped = $(card).data('flipped')
      var cardRotate = (flipped)?0:-180;
      TweenLite.to(card, 1, {rotationX:cardRotate, ease:Back.easeOut})
      flipped = !flipped
      $(card).data('flipped', flipped)
      if (!$(this).hasClass('empty') && flipped) {
        $('#ff-clang')[0].play()
      }
      app.getBoardScore()
    }
    cardHolders.on('click',showCard)
  },
  getBoardScore: function(){
    var cards = app.board.find('.card')
    var boardScore = app.board.find('#boardScore')
    var currentScore = {var: boardScore.html()}
    var score = 0
    function tallyScore(){
      if($(this).data('flipped')){
         var value = $(this).find('b').html()
         score += parseInt(value)
      }
    }
    $.each(cards, tallyScore)
    TweenMax.to(currentScore, 1, {
      var: score,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },
  awardPoints: function(num){
    var num          = $(this).attr('data-team')
    var boardScore   = app.board.find('#boardScore')
    var currentScore = {var: parseInt(boardScore.html())}
    var team         = app.board.find('#team'+num)
    var teamScore    = {var: parseInt(team.html())}
    var teamScoreUpdated = (teamScore.var + currentScore.var)
    $('#ff-theme')[0].play()
    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated,
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
      },
      ease: Power3.easeOut,
    });

    TweenMax.to(currentScore, 1, {
      var: 0,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },
  changeQuestion: function(){
    app.currentQ++
    app.makeQuestion(app.currentQ)
  },
  strike: function(strikes) {
    var wrong = $('#wrong')
    for (var i = 0; i < strikes; i++) {
      wrong.append($('<span class="wrongx">X</span>'))
    }
    $('#ff-strike')[0].play()
    wrong.fadeIn('fast')
    setTimeout(function() {
      wrong.empty()
    }, 1500)
  },
  // Initial function
  initGame: function(){
    $('#ff-theme')[0].pause()
    $('.main').empty()
    app.jsonLoaded(app.initData)
    app.board.find('#newQuestion' ).on('click', app.changeQuestion)
    app.board.find('#awardTeam1'  ).on('click', app.awardPoints)
    app.board.find('#awardTeam2'  ).on('click', app.awardPoints)
  },
  intro: function() {
    var board = $('.gameBoard')
    board.empty()
    board.append($('<div id="intro-splash"><img src="data/CyclonesFamilyFeud.jpg"></div>'))
    $('#ff-theme')[0].play()
    $('#intro-splash').click(app.initGame)
  }
}
$(document).keypress(function(ev) {
  var key = ev.key
  if (key === '1' || key === '2' || key === '3') {
    app.strike(parseInt(key))
  }
})
$(document).ready(function() {
  $('#start').click(app.intro)
})
//$(document).ready(app.init)
//http://www.qwizx.com/gssfx/usa/ff.htm