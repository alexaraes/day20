$(document).on('ready', function() {

	var app = Backbone.Router.extend({
		routes: {
			'': 'home',
			'chat': 'chat'
		}, 

		home: function() {
			$('.page').hide();
			$('#chat-page').hide();
			$('#user-page').show();
		}, 

		chat: function() {
			$('.page').hide();
			$('#user-page').hide();
			$('#chat-page').show();
		}

	});

	var myRouter = new app();
	Backbone.history.start();

	$('#name-btn').click(function() {
		myRouter.navigate('chat', {trigger: true});
	});

	$('#my-button').click(onButtonClick);
	$('#name-btn').submit();
	$('#my-button').submit();

	function onButtonClick(e) {
		var myMessage = {
			username: $('#name').val(),
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
			}
		}

		$('#chat').html(htmlString);
	}

	setInterval(getMessages, 500);

	getMessages();


});