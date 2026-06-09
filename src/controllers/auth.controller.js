const authService = require('../services/auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const result = await authService.register({ username, email, password });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();