"use strict";

const Bcrypt = require("bcrypt");

// load models
const User = require("../models/user");
const Country = require("../models/country");
const State = require("../models/state");
const City = require("../models/city");

const express = require("express");

const router = express.Router();

const AuthMiddleware = require("../middlewares/auth_middleware");
const hasName = require("../middlewares/name_middleware");

const DevController = require("../controllers/dev_controller");

const storage = require("../config/storage");

/**
 * List All Users
 */
router.get("/list-user/iamadev", AuthMiddleware, DevController.listUser);

router.get(
  "/test/iamdev/:id?",
  AuthMiddleware,
  hasName("dev.test", false),
  DevController.test
);

router.get("/seed/iamdev", DevController.seed);

router.get("/leadData/iamdev", DevController.leadData);

router.get("/test/test", (req, res) => {});

module.exports = router;
