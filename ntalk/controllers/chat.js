//Controller
module.exports = function() {
	var ChatController = {
		index: function(req, res) {
			var params = {usuario: req.session.usuario};
			res.render('chat/index', params);
		}
	};
	return ChatController;
};