
var $userName;
var theUserName;


$(document).on('ready', function() {

	var app = Backbone.Router.extend({
		routes: {
			'': 'home',
			'chat': 'chat',
			'newname': 'changeName'
		}, 

		home: function() {
			$('.page').hide();
			$('#chat-page').hide();
			$('#user-page').show();
		}, 

		chat: function() {
			theUserName = $userName;
			
			$('.page').hide();
			$('#user-page').hide();
			$('#chat-page').show();
			alert('name: '+ theUserName);
		},

		changeName: function() {
			theUserName = $userName;

			$('.page').show();
			$('#chat-page').hide();
			$('#user-page').hide();
			$('#new-name').show();
		}

	});

	var myRouter = new app();
	Backbone.history.start();

	$('.name-btn').click(function() {
		$userName = $("#name").val();
		
		myRouter.navigate('chat', {trigger: true});
		alert($userName);
		
		$('.name-btn').submit();
	});
	
	$('#my-button').click(onButtonClick);

	function onButtonClick(e) {
		
		alert('name: '+ theUserName);
		
		$('#my-button').submit();
		
		
		var myMessage = {
			username: theUserName,
			post: $('#message').val(),
			chatroom: ''
		};

		$.post(
			'http://fathomless-savannah-3396.herokuapp.com/messages/create',
			myMessage
		);

		$('#message').val('');

	}

	function getMessages() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages',
			onMessagesReceived,
			'json'
		);
	}

	function onMessagesReceived(messageList) {
		var htmlString = '';
		for(var i=messageList.length; i>0; i--) {
			var message = messageList[i-1];
			if(message.hasOwnProperty('username') && message.hasOwnProperty('post')) {
				htmlString += '<div class="messages">'+message.username+' - '+message.post+'</div>';
				$(".messages").css("z-index", i);
			}
		}
		
		$('#chat').html(htmlString);
		$('#current-name').html('You are: ' + theUserName)
	}

	setInterval(getMessages, 300);

	getMessages();


});