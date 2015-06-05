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

	function onButtonClick(e) {
		var myMessage = {
			username: $('#name').val(),
			text: $('#message').val()
		};
		
		$.post(
			'http://tiny-pizza-server.herokuapp.com/collections/chatapptry/',
			myMessage
		);
	}
	
	function getMessages() {
		$.get(
			'http://tiny-pizza-server.herokuapp.com/collections/chatapptry/',
			onMessagesReceived,
			'json'
		);
	}

	function onMessagesReceived(messageList) {
		var htmlString = '';
		for(var i=messageList.length; i>0; i--) {
			var message = messageList[i-1];
			if(message.hasOwnProperty('username') && message.hasOwnProperty('text')) {
				htmlString += '<div>'+message.username+' - '+message.text+'</div>';
			}
		}

		$('#chat').html(htmlString);
	}

	setInterval(getMessages, 500);

	getMessages();


});