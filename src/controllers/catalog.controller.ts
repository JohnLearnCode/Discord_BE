import { NextFunction, Request, Response } from 'express';
import catalogService from '../services/catalog.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { CreateCatalogRequest, UpdateCatalogRequest } from '../types/index.js';

const catalogController = {
  async getAllCatalogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const catalogs = await catalogService.getAllCatalogs();
      sendSuccess(res, catalogs);
    } catch (error) {
      next(error);
    }
  },

  async getCatalogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const catalog = await catalogService.getCatalogById(req.params.id);
      sendSuccess(res, catalog);
    } catch (error) {
      next(error);
    }
  },

  async createCatalog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const catalog = await catalogService.createCatalog(req.body as CreateCatalogRequest);
      sendSuccess(res, catalog, 'Catalog created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateCatalog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      const catalog = await catalogService.updateCatalog(
        req.params.id,
        req.body as UpdateCatalogRequest,
        requesterId,
      );
      sendSuccess(res, catalog, 'Catalog updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteCatalog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      await catalogService.deleteCatalog(req.params.id, requesterId);
      sendSuccess(res, null, 'Catalog deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default catalogController;
