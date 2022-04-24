const User = require("../models/user");
const PasswordReset = require("../models/password_reset");
const ApiToken = require("../models/api_token");

const Bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const md5 = require("md5");

const MainHelper = require("../helpers/main_helper");

const LoginValidator = require("../validators/login_validator");
const UpdateProfileValidator = require("../validators/update_profile");
const RequestPasswordResetValidator = require("../validators/request_password_reset");
const VerifyPasswordResetValidator = require("../validators/verify_password_reset");

const ProfileResource = require("../resources/profile_resource");

const RequestPasswordResetMail = require("../mails/request_password_reset_mail");

const appConfig = require("../config/app");

const moment = require("moment");

module.exports = class AuthController {
  /**
   * Login Logic
   * @param {*} req
   * @param {*} res
   */
  static login(req, res) {
    //   validate request
    const validator = new LoginValidator(req);
    if (validator.fails()) {
      return MainHelper.validationResponse(res, validator.errors().all());
    }
    // check for user
    User.findOne({
      email: req.body.email,
      isActive: true,
      isDeleted: false
    })
    .populate('roleId')
      .then(user => {
        if (!user) {
          return res.status(422).json({
            message: "User not found"
          });
        }
        Bcrypt.compare(req.body.password, user.password, function(
          err,
          isMatch
        ) {

          // check for error
          if (err) {
            return res.status(500).json({ message: "Internal server error!" });
          }
          // return response if password match doesnt occur
          if (!isMatch) {
            return res.status(422).json({
              message: "Password Mismatch"
            });
          }
          // return token is match occurs
          JWT.sign(
            user.toObject(),
            process.env.APP_KEY,
            { expiresIn: "365 days" },
            function(err, token) {
              if (err) {
                return res.status(500).json({
                  message: "There was some error in token generation"
                });
              }
              // store token
              ApiToken.create({
                email: user.email,
                token: token,
              })
                .then(token => {
                  // send token to user
                  return res.json({
                    data: Object.assign(token.toObject(), new ProfileResource(user))
                  });
                })
                .catch(err => {
                  return res.status(500).json({
                    message: "Some error occured!"
                  });
                });
            }
          );
        });
      })
      .catch(err => {
        // return response
        return res.json({
          message: "You are at the login screen!"
        });
      });
  }

  /**
   * Get authenticated user's profile data
   * @param {*} req
   * @param {*} res
   */
  static profile(req, res) {
    return res.json({ user: new ProfileResource(req.user) });
  }

  /**
   * Update user profile
   * @param {*} req
   * @param {*} res
   */
  static updateProfile(req, res) {
    const validator = new UpdateProfileValidator(req);

    if (validator.fails()) {
      return MainHelper.validationResponse(res, validator.errors().all());
    }

    const validated = validator.validated;

    if ("old_password" in validated) {
      Bcrypt.compare(validated.old_password, req.user.password)
        .then(isSame => {
          if (isSame) {
            Bcrypt.hash(
              validated.new_password,
              parseInt(process.env.HASH_ROUNDS)
            ).then(hash => {
              User.updateOne(
                {
                  email: req.user.email
                },
                {
                  name: validated.name,
                  mobile: validated.mobile,
                  password: hash
                }
              ).then(user => {
                req.user.password = hash;
                req.user.mobile = validated.mobile;
                req.user.name = validated.name;
                return MainHelper.response200(
                  res,
                  new ProfileResource(req.user),
                  "Profile Updated!"
                );
              });
            });
          } else {
            return MainHelper.response422(res, {
              password: ['Password field is incorrect']
            }, "Validation error!");
          }
        })
        .catch(err => {
          return MainHelper.response500(res);
        });
    } else {
      if (req.user.name != validated.name || req.user.mobile != validated.mobile) {
        User.updateOne(
          {
            email: req.user.email
          },
          {
            name: validated.name,
            mobile: validated.mobile
          }
        )
          .then(user => {
            req.user.name = validated.name;
            req.user.mobile = validated.mobile;
            return MainHelper.response200(
              res,
              new ProfileResource(req.user),
              "Profile Updated!"
            );
          })
          .catch(err => {
            return MainHelper.response500(res);
          });
      } else {
        return MainHelper.response200(
          res,
          new ProfileResource(req.user),
          "Profile Updated!"
        );
      }
    }
  }

  static requestPasswordReset(req, res) {
    const validator = new RequestPasswordResetValidator(req);

    // check validation
    if (validator.fails()) {
      return MainHelper.validationResponse(req, validator.errors().all());
    }

    const validated = validator.validated;

    // verify if user exists
    User.findOne({
      email: validated.email,
      isDeleted: false,
      isActive: true
    })
      .then(user => {
        if (user) {
          // send email if user exists
          const token = md5(user.email) + "." + md5(new Date());
          PasswordReset.create({
            email: user.email,
            token: token
          }).then(passwordReset => {
            const link =
              appConfig.app_url + appConfig.password_verify_link + token;

            const mail = new RequestPasswordResetMail(
              { to: user.email },
              { name: user.name, link: link }
            );

            mail
              .send()
              .then(info => {
                MainHelper.response200(
                  res,
                  {},
                  "Password reset link send to your email id."
                );
              })
              .catch(err => {
                MainHelper.response500(
                  req,
                  {},
                  "Could not send you the password reset link."
                );
              });
          });
        } else {
          // send 404
          return MainHelper.response404(res, {}, "User not found!");
        }
      })
      .catch(error => {
        return MainHelper.response500(res);
      });
  }

  static verifyPasswordReset(req, res) {
    const validator = new VerifyPasswordResetValidator(req);
    if (!req.params.token.match(/^[a-f0-9]{32}(\.){1}[a-f0-9]{32}$/)) {
      return MainHelper.response400(res, {
        token: ["Invalid Token"]
      });
    }

    if (validator.fails()) {
      return MainHelper.validationResponse(res, validator.errors().all());
    }
    
    const validated = validator.validated;

    PasswordReset.findOneAndUpdate({
      isConsumed: false,
      token: req.params.token,
      createdAt: {
        $gt: moment().subtract({
          hours: 3
        })
      }
    }, {
      isConsumed: true
    }, {
      new: true
    }).then(passwordReset => {
      if (!passwordReset) {
        return MainHelper.response404(res);
      }

      // create new password hash
      Bcrypt.hash(validated.password, parseInt(process.env.HASH_ROUNDS)).then(
        hash => {
          // save password
          User.findOneAndUpdate(
            {
              email: passwordReset.email,
              isDeleted: false,
              isActive: true
            },
            {
              password: hash
            },
            {
              new: true
            }
          ).then(user => {
            if (!user) {
              return MainHelper.response404(res, {}, "User not found!");
            }
            return MainHelper.response200(res, {}, "Password updated!");
          });
        }
      );
    })
    .catch(err => {
      return MainHelper.response500(res);
    });
  }

  static myPermissions(req, res) {
    try {
      return MainHelper.response200(res, req.user.roleId.permissions, "Permission List");
    } catch (err) {
      return MainHelper.response500(res);
    }
  }
};
