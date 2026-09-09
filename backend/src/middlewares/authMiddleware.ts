import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const requireAdminAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing' });
        }

        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
            }

            req.user = decoded;
            next();
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};