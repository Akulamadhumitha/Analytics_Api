/**
 * API Key Authentication Middleware
 */
function authenticateApiKey(req, res, next) {
    try {
        const apiKeyFromHeader = req.header("X-API-Key");
        const validApiKey = process.env.API_KEY;

        if (!apiKeyFromHeader) {
            return res.status(401).json({
                status: "error",
                message: "API key is missing"
            });
        }

        if (apiKeyFromHeader !== validApiKey) {
            return res.status(401).json({
                status: "error",
                message: "Invalid API key"
            });
        }

        // Attach client identification for rate limiting
        req.client_id = apiKeyFromHeader;

        next();

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Authentication error"
        });
    }
}

module.exports = authenticateApiKey;
