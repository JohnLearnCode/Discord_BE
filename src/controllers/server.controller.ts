import { NextFunction, Request, Response } from 'express';
import serverService from '../services/server.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateServerRequest, UpdateServerRequest } from '../types/index.js';

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

  async createServer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const server = await serverService.createServer(req.body as CreateServerRequest);
      sendSuccess(res, server, 'Server created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateServer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const server = await serverService.updateServer(req.params.id, req.body as UpdateServerRequest);
      sendSuccess(res, server, 'Server updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteServer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await serverService.deleteServer(req.params.id);
      sendSuccess(res, null, 'Server deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default serverController;
