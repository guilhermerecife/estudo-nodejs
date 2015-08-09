//Controller
module.exports = function() {
	var ChatController = {
		index: function(req, res) {
			res.render('chat/index');
		}
	};
	return ChatController;
};