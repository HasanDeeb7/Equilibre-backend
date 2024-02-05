import { Router } from "express";
import {
  createConsultation,
  deleteConsultation,
  getConsultations,
  updateConsultation,
} from "../controllers/consultationController.js";

export const consultationRouter = Router();

consultationRouter.get("/", getConsultations);
consultationRouter.post("/create", createConsultation);
consultationRouter.patch("/update", updateConsultation);
consultationRouter.delete("/delete", deleteConsultation);
