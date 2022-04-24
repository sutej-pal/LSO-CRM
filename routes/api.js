"use strict";

/**
 * Initialization
 */
const express = require("express");
const router = express.Router();
const storage = require("../config/storage");

/**
 * Import all controllers
 */
const AuthController = require("../controllers/auth_controller");
const CompanyController = require("../controllers/company_controller");
const CountryController = require("../controllers/country_controller");
const RoleController = require('../controllers/role_controller');
const SalesModelController = require('../controllers/sales_model_controller');
const BranchController = require('../controllers/branch_controller');
const UserController = require('../controllers/user_controller');
const LeadTypeController = require('../controllers/lead_type_controller');
const LeadSourceController = require('../controllers/lead_source_controller');
const LeadController = require('../controllers/lead_controller');
const PermissionController = require('../controllers/permission_controller');
const PipelineController = require('../controllers/pipeline_controller');
const ClosureController = require('../controllers/closure_controller');
const PushNotificationController = require('../controllers/push_notification_controller');
const LeadRequirementController = require('../controllers/lead_requirement_controller');
const ImportExportController = require('../controllers/import_export_controller');
const DashboardController = require('../controllers/dashboard_controller');
/**
 * Import all the middlewares
 */
const AuthMiddleware = require("../middlewares/auth_middleware");
const name = require('../middlewares/name_middleware');

// Misc
router.get('/country-list', CountryController);

// Auth
router.post("/login", AuthController.login);
router.get('/profile', AuthMiddleware, name('user.profile.get', true), AuthController.profile);
router.post('/profile', AuthMiddleware, name('user.profile.update', true), AuthController.updateProfile);
router.post('/password-reset/request', AuthController.requestPasswordReset);
router.post('/password-reset/verify/:token', AuthController.verifyPasswordReset);
router.get('/permissions', AuthMiddleware, name('user.permissions'), AuthController.myPermissions);

// Push Notification
router.post('/subscribe', AuthMiddleware, name('push.notification.subscribe'), PushNotificationController.subscribe);
// router.get('/send', name('push.notification.subscribe'), PushNotificationController.sendAll);

// Roles
router.get('/role', AuthMiddleware, name('roles.list', true), RoleController.index);
router.post('/role', AuthMiddleware, name('roles.create', true), RoleController.create);
router.post('/role/:id', AuthMiddleware, name('roles.edit', true), RoleController.update);
router.delete('/role/:id', AuthMiddleware, name('roles.delete', true), RoleController.delete);
router.get('/all-permissions', name('roles.permissions', false), RoleController.permissions);

// Sales Model
router.get('/sales-model', AuthMiddleware, name('sales.list', true), SalesModelController.index);
router.post('/sales-model', AuthMiddleware, name('sales.create', true), SalesModelController.create);
router.post('/sales-model/:id', AuthMiddleware, name('sales.edit', true), SalesModelController.update);
router.delete('/sales-model/:id', AuthMiddleware, name('sales.delete', true), SalesModelController.delete);

//Company
router.get('/company', AuthMiddleware, name('company.list', true), CompanyController.index);
router.post('/company', AuthMiddleware, name('company.create', true), CompanyController.create);
router.post('/company/:id', AuthMiddleware, name('company.edit', true), CompanyController.update);
router.delete('/company/:id', AuthMiddleware, name('company.delete', true), CompanyController.delete);

//Branch
router.get('/branch', AuthMiddleware, name('branch.list', true), BranchController.index);
router.post('/branch', AuthMiddleware, name('branch.create', true), BranchController.create);
router.post('/branch/:id', AuthMiddleware, name('branch.edit', true), BranchController.update);
router.delete('/branch/:id', AuthMiddleware, name('branch.delete', true), BranchController.delete);

//User
router.get('/user', AuthMiddleware, name('user.list', true), UserController.index);
router.get('/branch-user/:id', AuthMiddleware, name('user.list.branch', false), UserController.branchIndex); //Todo: Change to true and add to permission
router.get('/all-user', AuthMiddleware, name('user.list.branch', false), UserController.allIndex); //Todo: Change to true and add to permission
router.post('/user', AuthMiddleware, name('user.create', true), UserController.create);
router.post('/user/:id', AuthMiddleware, name('user.edit', true), UserController.update);
router.delete('/user/:id', AuthMiddleware, name('user.delete', true), UserController.delete);

//Lead Type
router.get('/lead-type', AuthMiddleware, name('lead-type.list', true), LeadTypeController.index);
router.post('/lead-type', AuthMiddleware, name('lead-type.create', true), LeadTypeController.create);
router.post('/lead-type/:id', AuthMiddleware, name('lead-type.edit', true), LeadTypeController.update);
router.delete('/lead-type/:id', AuthMiddleware, name('lead-type.delete', true), LeadTypeController.delete);

//Lead Source
router.get('/lead-source', AuthMiddleware, name('lead-source.list', true), LeadSourceController.index);
router.post('/lead-source', AuthMiddleware, name('lead-source.create', true), LeadSourceController.create);
router.post('/lead-source/:id', AuthMiddleware, name('lead-source.edit', true), LeadSourceController.update);
router.delete('/lead-source/:id', AuthMiddleware, name('lead-source.delete', true), LeadSourceController.delete);

//Lead
router.get('/lead/export/:type?', name('lead.export', false), ImportExportController.export);
// router.get('/lead/export/:type?', AuthMiddleware, name('lead.export', true), LeadController.export);
router.get('/lead', AuthMiddleware, name('lead.list', true), LeadController.index);
router.get('/lead/:id', AuthMiddleware, name('lead.list', true), LeadController.detail);
router.post('/lead', AuthMiddleware, name('lead.create', true), LeadController.create);
router.post('/lead/import', AuthMiddleware, name('lead.import', true), ImportExportController.import);
// router.post('/lead/import', AuthMiddleware, name('lead.import', true), ImportExportController.import);
router.post('/lead/:id', AuthMiddleware, name('lead.edit', true), LeadController.update);
router.delete('/lead/:id', AuthMiddleware, name('lead.delete', true), LeadController.delete);

// pipeline
router.post('/pipeline/:id', AuthMiddleware, name('lead.pipeline', true), PipelineController);
router.post('/closure/:id', AuthMiddleware, name('lead.closure', true), ClosureController);

// Lead Requirement
router.get('/lead-requirement', AuthMiddleware, name('lead-requirement.list', true), LeadRequirementController.index);
router.post('/lead-requirement', AuthMiddleware, name('lead-requirement.create', false), LeadRequirementController.create);
router.post('/lead-requirement/:id', AuthMiddleware, name('lead-requirement.update', false), LeadRequirementController.update);
router.delete('/lead-requirement/:id', AuthMiddleware, name('lead-requirement.delete', false), LeadRequirementController.delete);

// dashboard controller

router.post('/followup-data', AuthMiddleware, DashboardController.getFollowUpData);

// Routes
router.get('/route', AuthMiddleware, name('route.list', false), PermissionController.index);

module.exports = router;
