const { isLoggedIn } = require("../middlewares/authMiddleware");

exports.getIndex = (req, res, next) => {
    const pageTitle = 'VoyageIt';
    res.render('index', { pageTitle, isAuthenticated: isLoggedIn(req) });
};