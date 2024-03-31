import { Divider, IconButton, Link, Stack, Typography } from '@mui/material'
import { GithubLogo, GoogleLogo } from 'phosphor-react'
import React from 'react'
import {Link as RouterLink } from 'react-router-dom'
import LoginForm from './LoginForm'

function Login() {
  return (
    <>
      <Stack spacing={2} sx={{mb:5,position:"relative"}}>
        <Typography variant='h4'>Login to Tawk</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant='body2'>New User?</Typography>
          <Link to="/auth/register" component={RouterLink} variant="subtitle2">
            Create an Account 
          </Link>
        </Stack>
        {/* Login Form */}
        <LoginForm/>
        
        <Divider sx={{my:2.5,typography:"overline",color:"text.disabled"}}>
          OR
        </Divider>
        <Stack direction={"row"} justifyContent={"center"} spacing={2}>
          <IconButton>
            <GoogleLogo color='#DF3E30'/>
          </IconButton>
          <IconButton>
            <GithubLogo />
          </IconButton>
        </Stack>
      </Stack>
    </>
  )
}

export default Login