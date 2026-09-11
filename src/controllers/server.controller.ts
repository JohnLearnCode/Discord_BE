import { NextFunction, Request, Response } from 'express';
import serverService from '../services/server.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { CreateServerRequest, JoinServerRequest, UpdateServerRequest } from '../types/index.js';

const serverController = {
  async getAllServers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const servers = await serverService.getAllServers();
      sendSuccess(res, servers);
    } catch (error) {
      next(error);
    }
  },

  async getServerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const server = await serverService.getServerById(req.params.id);
      sendSuccess(res, server);
    } catch (error) {
      next(error);
    }
  },

  async getServerChannels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await serverService.getServerChannels(req.params.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  },

  async searchServers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = typeof req.query.name === 'string' ? req.query.name : '';
      const servers = await serverService.searchServers(name);
      sendSuccess(res, servers, 'Servers searched successfully');
    } catch (error) {
      next(error);
    }
  },

  async createServer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const server = await serverService.createServer(req.body as CreateServerRequest);
      sendSuccess(res, server, 'Server created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async joinServer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body as JoinServerRequest;
      const server = await serverService.joinServer(req.params.id, userId);
      sendSuccess(res, server, 'Joined server successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateServer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      const server = await serverService.updateServer(
        req.params.id,
        req.body as UpdateServerRequest,
        requesterId,
      );
      sendSuccess(res, server, 'Server updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteServer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      await serverService.deleteServer(req.params.id, requesterId);
      sendSuccess(res, null, 'Server deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default serverController;
