window.onload = function() {

    var messages = [];

    // Setup Special Effects
    var specialEffects = [{
        'code': '{=>}',
        'effect': rocketAnimation
    }, {
        'code': '{Puppy}',
        'effect': puppyAnimation
    }, {
        'code': '{Puppy2}',
        'effect': runningPuppy
    }, {
        'code': 'Happy Birthday',
        'effect': birthdayEffect
    },];

    // Switch Between These Two Links on the Host When Editing and Testing
    // https://guarded-lowlands-86253.herokuapp.com - Testing [Public Link]
    // http://localhost:3700 - Editing [Private Link]
    var host = 'http://localhost:3700';
    var socket = io.connect(host);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("textlayer");
    var name = document.getElementById("name");
    var hostname = document.getElementById("hostname")

    hostname.innerHTML = host;

    function applyEffects(message) {
        $.each(specialEffects, function(index, value) {
            if (message.match(value.code)) {

                // Execute the Effect
                value.effect();
            }
        });
    }

    // Displays the Messages
    socket.on('message', function(data) {
        if (data.message) {

            applyEffects(data.message);

            messages.push(data);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + '<h4 style="font-family: Ubuntu Condensed; padding-left: 4px; margin-top: 2px; margin-bottom: 0; display: inline-block;">' + (messages[i].username ? messages[i].username : 'Server') + '</h4>' + ': </b>';
                html += messages[i].message + '<br />';
            }
            $('#content').animate({
                'scrollTop': content.scrollHeight
            }, 200);
            content.innerHTML = html;
            $('#receive')[0].play();

        } else {
            console.log("There is a problem:", data);
        }
    });

    // When the Send Button is Clicked, it Executes submitChat
    $('#send').click(function() {
        submitChat();
    });

    // When the Enter Key is Pressed, it Executes submitChat
    $('#field').keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            submitChat();
        }
    });

    // Submits Message
    function submitChat() {
        if (name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            $('#content').animate({
                'scrollTop': content.scrollHeight
            }, 200);
            $('#sendsound')[0].play();
            field.value = "";
            socket.emit('send', {
                message: '<h4 class="message">' + text + '</h4>',
                username: '<h4 class="name">' + name.value + '</h4>'
            });
        }
    }


    // Special Effects Animations

    // Rocket Animation
    function rocketAnimation() {
        $('<img id="rocket" src="images/rocket.png" style="position:absolute;opacity:0;z-index:500">').on('load',function(){

          $('#animationlayer').append($(this));
          var rocket=$('#rocket');
          rocket.css({
              top: $('#content').prop('scrollHeight') - rocket.height(),
              left: $('#content').width() / 2,
              position: 'absolute',
              opacity: 1
          });
          console.log(rocket.height());

          rocket.animate({
              top: $('#content').prop('scrollHeight') - $('#content').height() - rocket.height(),
              left: $('#content').width() / 2,
          }, 1000, function() {
              rocket.remove()
          });
        });
    }

    // Puppy Animation [Down]
    function puppyAnimation() {
      $('<img id="puppy" src="images/puppy.png" style="position:absolute;opacity:0;z-index:500">').on('load',function(){

        $('#animationlayer').append($(this));
        var puppy=$('#puppy');
        puppy.css({
            top: $('#content').prop('scrollHeight') - puppy.height(),
            left: 0,
            position: 'absolute',
            opacity: 1
        });

        puppy.animate({
            top: $('#content').prop('scrollHeight') - puppy.height(),
            left: $('#animationlayer').width() - puppy.width(),
        }, 3000, function() {
            puppy.remove()
        });
      });
    }

    // Second Puppy Animation
    function runningPuppy() {
      $('<img id="puppy" src="images/puppyanim.gif" style="position:absolute;opacity:0;z-index:500">').on('load',function(){

        $('#animationlayer').append($(this));
        var puppy=$('#puppy');
        puppy.css({
            top: $('#content').prop('scrollHeight') - $('#content').height()/2 - puppy.height()/2,
            left: $('#animationlayer').width()/2 - puppy.width()/2,
            position: 'absolute',
            opacity: 1
        });

        puppy.animate({
            opacity: 0
        }, 3000, function() {
            puppy.remove()
        });
      });
    }
}
