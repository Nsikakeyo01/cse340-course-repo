function requireLogin(req, res, next) {
    if (!req.session.user) {
        req.flash(
            "notice",
            "Please log in to access that page."
        );


        return res.redirect("/account/login");
    }

    next();

}

function requireRole(requiredRole) {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash(
                "notice",
                "Please log in to access that page."
            );


            return res.redirect("/account/login");
        }

        if (req.session.user.role !== requiredRole) {
            req.flash(
                "notice",
                "You do not have permission to access that page."
            );

            return res.redirect("/account");
        }

        next();
    };

}

export {
    requireLogin,
    requireRole
};