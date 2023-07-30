// Middleware to check if the user is logged in
exports.isGuest = (req, res, next) => {
    // Check if the user is authenticated 
    if (!req.session || ! req.session.isLoggedIn) {
      return next();
    } else{
        res.redirect('/');
    }
}

exports.isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated 
    if (req.session && req.session.isLoggedIn) {
      return next();
    } else{
        res.redirect('/');
    }
}


exports.isLoggedIn = (req) => {
    if ( req.session && req.session.isLoggedIn) {
        return true; 
      } else{
          return false;
      }
}