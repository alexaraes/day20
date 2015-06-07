
var $userName;
var theUserName;


$(document).on('ready', function() {

	var app = Backbone.Router.extend({
		routes: {
			'': 'home',
			'home': 'home',
			'chat/:user': 'chat',
			'newname': 'changeName',
			'leaders': 'leaders'
		}, 

		home: function() {
			$('.page').hide();
			$('#user-page').show();
		}, 

		chat: function(user) {
			theUserName = user;
			
			$('.page').hide();
			$('#chat-page').show();
		},

		changeName: function() {
			theUserName = $userName;

			$('.page').hide();
			$('#newname').show();
		},

		leaders: function() {
			$('.page').hide();
			$('#leaderboards').show();
			getTopUsers();
			getRecentUsers();
		}

	});

	var myRouter = new app();
	Backbone.history.start();

	$('.name-btn').click(function() {
		$userName = $("#testname").val();
		
		myRouter.navigate('chat/'+$userName, {trigger: true});
		
		$('.name-btn').submit();
	});
	
	$('.changename-btn').click(function() {
		var changeUserName = $("#changing-name").val();
		
		myRouter.navigate('chat/'+changeUserName, {trigger: true});
		
		$('.changename-btn').submit();
	});

	$("#back-btn").on("click", function(){
		myRouter.navigate("chat/"+theUserName, {trigger:true})
	});
	
	$('#my-button').click(onButtonClick);

	function onButtonClick(e) {
		
		
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
		for(var i=0; i<messageList.length; i++) {
			var message = messageList[i];
			var messageTime = message.created_at;

			if(message.hasOwnProperty('username') && message.hasOwnProperty('post')) {
				htmlString += '<div class="messages">' + '<div id="time">' + "[" + moment(messageTime).startOf(messageTime).fromNow() + "]</div> " +message.username+' - '+message.post+'</div>';
			}
		}
		
		$('#chat').html(htmlString);
		$('#current-name').html('You are: ' + theUserName)
		$('#chat').scrollTo('max');
	}

	function getTopUsers() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages/fanatics',
			topUsersReceived,
			'json'
		);
	}

	function topUsersReceived(users) {
		var userString = '';
		
			for(var name in users) {
				userString += '<div class="users">' + name + ": " + users[name] +'</div>';
			}
		
		
		$('#top-users').append(userString);

	}

	function getRecentUsers() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages/recent_users',
			recentUsersReceived,
			'json'
		);
	}

	function recentUsersReceived(recUsers) {
		var recentString = '';
		
		var userObj = {};

		for (var i=0; i<recUsers.length; i++) {
			var activeUserName = recUsers[i].username;

			if(!userObj.hasOwnProperty(activeUserName)) {
				userObj[activeUserName] = activeUserName;
			}
			else {
				userObj[activeUserName]++;
			}
		}

		for (prop in userObj) {
			console.log(prop);
			recentString += '<div class="users">' + prop +'</div>';
			$('#active-users').html(recentString);
		}
		
	}

	setInterval(getMessages, 300);

	getMessages();

});