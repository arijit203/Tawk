import React, { useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeSlash } from "phosphor-react";
import { useFormContext, Controller, useForm } from "react-hook-form";
import { PropTypes } from "prop-types";
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
import { useDispatch } from 'react-redux';
import { RegisterUser } from '../../redux/slices/auth';
import { RHFTextField } from '../../components/hook-form';



const FormProvider = ({ children, onSubmit, methods }) => {
    return (
      <Form {...methods}>
        <form onSubmit={onSubmit}>{children}</form>
      </Form>
    );
  };


function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch=useDispatch();
  const RegisterSchema = Yup.object().shape({
    firstName:Yup.string().required("First Name is required"),
    lastName:Yup.string().required("Last Name is required"),
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
    resolver: yupResolver(RegisterSchema),
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
      dispatch(RegisterUser(data));
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
       <Stack direction={{sx:"column",sm:"row"}} spacing={2}>
            <RHFTextField name="firstName" label="First Name"/>
            <RHFTextField name="lastName" label="Last Name"/>

       </Stack>
       <RHFTextField name="email" label="Email"/>
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
        Register
        </Button>
    </Stack>
    
    </FormProvider>
  )
}

export default RegisterForm