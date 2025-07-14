import React, { useContext, useState, useEffect } from "react";
import styles from "./SignIn.module.css";
import { useFormik } from "formik";
import { darkModeContext } from "../../Context/DarkModeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignIn() {
  const { t } = useTranslation("signIn");
  const { darkMode, login } = useContext(darkModeContext);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location]);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = t("signIn.email.errors.required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t("signIn.email.errors.invalid");
    }
    if (!values.password) {
      errors.password = t("signIn.password.errors.required");
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$/.test(values.password)) {
      errors.password = t("signIn.password.errors.invalid");
    }
    return errors;
  };

  const handleResendVerification = async () => {
    const email = formik.values.email;
    if (!email) {
      toast.error(t("signIn.email.errors.required"));
      return;
    }
    setResendLoading(true);
    try {
      const { data } = await axios.post(
        "https://ugmproject.vercel.app/api/v1/user/resendVerifyEmail",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message || t("signIn.verificationSuccess"));
    } catch (error) {
      const message =
        error.response?.data?.err || t("signIn.verificationError");
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://ugmproject.vercel.app/api/v1/user/login",
          values
        );
        console.log(response.data.Bookings)
        const bookings = response.data.Bookings
        const userName = response.data.userName;
        const token = response.data.token;
        const Id = response.data.Id;
        // localStorage.setItem('wallet', JSON.stringify(response.data.wallet));
        localStorage.setItem("userName", userName);
        localStorage.setItem("Id", Id);
localStorage.setItem("bookings", JSON.stringify(bookings));
        console.log(localStorage.getItem('bookings'))
        login(token);
        localStorage.setItem("role", response.data.Role);
        toast.success(t("signIn.success"));
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        const message =
          error.response?.data?.err || t("signIn.error");
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={`${darkMode ? "tw-dark" : ""}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-5">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container my-5 justify-content-between d-flex align-items-center" style={{ minHeight: '62vh' }}>
            <div className="row w-100 mx-0">
              {/* Image Column */}
              <div className="col-12 col-lg-6 px-0">
                <div className={`${styles["bg-image"]}`}>
                  <div className={`${styles["layer"]}`}>
                    <p className="mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100">
                      UGM Family
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="col-12 col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-4 px-3">
                <form onSubmit={formik.handleSubmit}>
                  {/* Email */}
                  <label htmlFor="email" className="mt-3 dark:tw-text-white">
                    {t("signIn.email.label")}
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("signIn.email.placeholder")}
                    className="w-100 form-control mt-2"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <div className="text-danger w-100 mt-1" role="alert">
                      {formik.errors.email}
                    </div>
                  ) : null}

                  {/* Password */}
                  <label htmlFor="password" className="mt-3 dark:tw-text-white">
                    {t("signIn.password.label")}
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t("signIn.password.placeholder")}
                    className="w-100 form-control mt-2"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <div className="text-danger w-100 mt-1" role="alert">
                      {formik.errors.password}
                    </div>
                  ) : null}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !(formik.dirty && formik.isValid)}
                    className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4 border-0"
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                    ) : (
                      t("signIn.submit")
                    )}
                  </button>

                  {/* Resend Verification Email */}
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none text-primary"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                    >
                      {resendLoading ? (
                        <i className="fa-solid fa-spinner fa-spin-pulse me-2"></i>
                      ) : null}
                      {t("signIn.resendVerification")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}