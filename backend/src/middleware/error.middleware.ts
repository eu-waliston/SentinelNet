import type {
  NextFunction,
  Request,
  Response
} from "express";

export function errorMiddleware(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}