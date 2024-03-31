import React, { useState } from "react";
import { PropTypes } from "prop-types";
import {Link as RouterLink } from 'react-router-dom'

//form
import { useFormContext, Controller, useForm } from "react-hook-form";
import {
  Alert,
  TextField,
  useFormControl,
  Stack,
  InputAdornment,
  IconButton,
  Link,
  Button,
} from "@mui/material";
import { FormProvider as Form } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeSlash } from "phosphor-react";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { LoginUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";




function LoginForm() {
  const dispatch=useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid Email Address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });

  const defaultValues = {
    email: "demo@tawk.com",
    password: "demo1234",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Your submit logic goes here
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
      methods.reset(); // Reset form
      methods.setError("afterSubmit", {
        ...error,
        message: error.message,
      }); // Set error
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="email" label="Email Address" />
        <RHFTextField
          name="password"
          label="password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
        <Link variant="bod2" color="inherit" underline="always" to="/auth/reset-password" component={RouterLink}>
          Forgot Password?
        </Link>
      </Stack>
      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        sx={{
            bgcolor: "text.primary",
            color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
            '&:hover': {
            bgcolor: "text.primary", // Set the background color on hover
            color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
        }}
        >
        Login
        </Button>

    </FormProvider>
  );
}

export default LoginForm;
