import supertest, { Response } from "supertest";
import { getProductById, products } from "../src/model/Product";
import { purchases } from "../src/model/Purchase";
import { riskAssessments } from "../src/model/RiskAssessment";
import app from '../src/index';
import * as riskApi from "../src/lib/risk-api";
import * as purchaseApi from "../src/lib/purchase-api";
import { PurchaseStatus } from "../src/types/PurchaseStatus";
import { RiskAssessmentStatus } from "../src/types/RiskAssessmentStatus";

describe('index', () => {
  beforeEach(() => {
    products.length = 0;
    purchases.length = 0;
    riskAssessments.length = 0;
  });

  describe("GET /products", () => {
    it("should return an array of products with the existing elements", async () => {
      const id = 1;
      
      products.push({
        id,
        productUrl: "http://www.foobar.com/product/uselessbox",
        productPrice: 12345,
        discountCode: "10OFF"
      });

      const product = getProductById(id);

      await supertest(app)
        .get("/products")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response: Response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(1);
          expect(response.body[0].id).toBe(product.id);
          expect(response.body[0].productUrl).toBe(product.productUrl);
          expect(response.body[0].productPrice).toBe(product.productPrice);
          expect(response.body[0].discountCode).toBe(product.discountCode);
        });
    });

    it("should return an empty array of products", async () => {
      await supertest(app)
        .get("/products")
        .expect(200)
        .then((response: Response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(0);
        });
    }); 
  });

  describe("POST /purchase:productId", () => {
    it("should create a new purchase with purchase success status", async () => {

      jest.spyOn(riskApi, 'getNumMissedPayments')
        .mockReturnValue(Promise.resolve(0));
      
      jest.spyOn(riskApi, 'getAccountBalance')
        .mockReturnValue(Promise.resolve(100000000));

      jest.spyOn(riskApi, 'getRiskScore')
        .mockReturnValue(Promise.resolve(1));

      jest.spyOn(purchaseApi, 'executePurchase')
      .mockReturnValue(Promise.resolve(PurchaseStatus.SUCCESS));

      const id = 1;
      
      products.push({
        id,
        productUrl: "http://www.foobar.com/product/uselessbox",
        productPrice: 12345,
        discountCode: "10OFF"
      });

      const product = getProductById(id);

      const data = {
        userId: 'user-id',
        paymentMethodId: "payment-method-id",
      };

      await supertest(app)
        .post(`/purchase/${product.id}`)
        .send(data)
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.purchase.id).toBeTruthy();
          expect(response.body.purchase.productId).toBe(product.id);
          expect(response.body.purchase.userId).toBe(data.userId);
          expect(response.body.purchase.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.purchase.status).toBe(PurchaseStatus.SUCCESS)
          expect(response.body.riskAssessment.userId).toBe(data.userId)
          expect(response.body.riskAssessment.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.riskAssessment.status).toBe(RiskAssessmentStatus.SUCCESS);
        });
    });

    it("should create a new purchase with purchase pending status and flagged_for_review", async () => {
      jest.spyOn(riskApi, 'getNumMissedPayments')
        .mockReturnValue(Promise.resolve(0));
      
      jest.spyOn(riskApi, 'getAccountBalance')
        .mockReturnValue(Promise.resolve(100000000));

      jest.spyOn(riskApi, 'getRiskScore')
        .mockReturnValue(Promise.resolve(81));

      const id = 1;
      
      products.push({
        id,
        productUrl: "http://www.foobar.com/product/uselessbox",
        productPrice: 12345,
        discountCode: "10OFF"
      });

      const product = getProductById(id);

      const data = {
        userId: 'user-id',
        paymentMethodId: "payment-method-id",
      };

      await supertest(app)
        .post(`/purchase/${product.id}`)
        .send(data)
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.purchase.id).toBeTruthy();
          expect(response.body.purchase.productId).toBe(product.id);
          expect(response.body.purchase.userId).toBe(data.userId);
          expect(response.body.purchase.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.purchase.status).toBe(PurchaseStatus.PENDING)
          expect(response.body.riskAssessment.userId).toBe(data.userId)
          expect(response.body.riskAssessment.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.riskAssessment.status).toBe(RiskAssessmentStatus.FLAGGED_FOR_REVIEW);
        });
    });

    it("should create a new purchase with purchase rejected status", async () => {

      jest.spyOn(riskApi, 'getNumMissedPayments')
        .mockReturnValue(Promise.resolve(0));
      
      jest.spyOn(riskApi, 'getAccountBalance')
        .mockReturnValue(Promise.resolve(0));

      jest.spyOn(riskApi, 'getRiskScore')
        .mockReturnValue(Promise.resolve(81));

      const id = 1;
      
      products.push({
        id,
        productUrl: "http://www.foobar.com/product/uselessbox",
        productPrice: 12345,
        discountCode: "10OFF"
      });

      const product = getProductById(id);

      const data = {
        userId: 'user-id',
        paymentMethodId: "payment-method-id",
      };

      await supertest(app)
        .post(`/purchase/${product.id}`)
        .send(data)
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.purchase.id).toBeTruthy();
          expect(response.body.purchase.productId).toBe(product.id);
          expect(response.body.purchase.userId).toBe(data.userId);
          expect(response.body.purchase.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.purchase.status).toBe(PurchaseStatus.REJECTED)
          expect(response.body.riskAssessment.userId).toBe(data.userId)
          expect(response.body.riskAssessment.paymentMethodId).toBe(data.paymentMethodId)
          expect(response.body.riskAssessment.status).toBe(RiskAssessmentStatus.REJECTED);
        })
        
    });
  });
})
