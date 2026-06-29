import express from "express";
import passport from "passport";
import { asyncWrap } from "../utils/asyncWrap.js";
import { uploadMiddleware } from "../utils/fileUpload.js";
import * as documentsController from "../controllers/documentsController.js";

const documentsRouter = express.Router();
const protect = passport.authenticate("jwt-access", { session: false });

documentsRouter.post(
  "/",
  protect,
  uploadMiddleware.single("document"),
  asyncWrap(documentsController.createDocument),
);
documentsRouter.get("/", protect, asyncWrap(documentsController.getDocuments));
documentsRouter.get(
  "/:documentId",
  protect,
  asyncWrap(documentsController.getDocumentById),
);
documentsRouter.put(
  "/:documentId",
  protect,
  asyncWrap(documentsController.updateDocument),
);
documentsRouter.delete(
  "/:documentId",
  protect,
  asyncWrap(documentsController.deleteDocument),
);
documentsRouter.patch(
  "/:documentId/toggle-pin",
  protect,
  asyncWrap(documentsController.toggleDocumentPin),
);
documentsRouter.get(
  "/search/query",
  protect,
  asyncWrap(documentsController.searchDocuments),
);

export default documentsRouter;
