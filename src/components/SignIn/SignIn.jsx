import React, { useContext, useState } from "react";
import styles from "./SignIn.module.css";
import { useFormik } from "formik";
import { darkModeContext } from "../../Context/DarkModeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const { t } = useTranslation("signIn");
  const { darkMode, login } = useContext(darkModeContext);  
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = t("signIn.email.errors.required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t("signIn.email.errors.invalid");
    }
    if (!values.password) {
      errors.password = t("signIn.password.errors.required");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values.password)
    ) {
      errors.password = t("signIn.password.errors.invalid");
    }
    return errors;
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
        const token = response.data.token;

        login(token);
console.log(response.data.role)
localStorage.setItem('role' ,response.data.role )

        toast.success(t("signIn.success"));
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        const message =
          error.response.data?.err ||
          t("signIn.error");
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className={`${darkMode ? "tw-dark" : ""}`}>
        <div className="container-fluid dark:tw-bg-gray-800 py-5">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="container my-5 justify-content-between d-flex align-items-center">
              <div className="row w-75 mx-auto">
                <div className="col-lg-6 ps-1 tw-bg-gray-100 dark:tw-bg-gray-900">
                  <div className={`${styles["bg-image"]}`}>
                    <div className={`${styles["layer"]}`}>
                      <p className="mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100">
                        UGM Family
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-3">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="email">
                      <label htmlFor="email" className="mt-3 dark:tw-text-white">
                        {t("signIn.email.label")}
                      </label>
                      <input
                        onBlur={formik.handleBlur}
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t("signIn.email.placeholder")}
                        className="w-100 form-control mt-3"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                      {formik.errors.email && formik.touched.email ? (
                        <div className="text-danger w-75" role="alert">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>

                    <div className="password">
                      <label htmlFor="password" className="mt-3 dark:tw-text-white">
                        {t("signIn.password.label")}
                      </label>
                      <input
                        onBlur={formik.handleBlur}
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t("signIn.password.placeholder")}
                        className="w-100 form-control mt-3"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      {formik.errors.password && formik.touched.password ? (
                        <div className="text-danger w-100" role="alert">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !(formik.dirty && formik.isValid)}
                      className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4"
                    >
                      {loading ? (
                        <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                      ) : (
                        t("signIn.submit")
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
