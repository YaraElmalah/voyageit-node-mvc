exports.getIndex = (req, res, next) => {
    const pageTitle = 'VoyageIt';
    res.render('index', { pageTitle });
};