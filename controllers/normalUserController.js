let normalUserController = {
  renderLogin: (req, res) => {
    if(!req.user) {
      res.redirect('/');
    }
    res.render('admin', {
    title: 'Welcome to Land Below the Wind'
    })
  }
};
module.exports = normalUserController;
