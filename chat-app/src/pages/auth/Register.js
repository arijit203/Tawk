import { Divider, IconButton, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { GithubLogo, GoogleLogo } from 'phosphor-react'
import {Link as RouterLink} from 'react-router-dom'
import RegisterForm from './RegisterForm'

function Register() {
  return (
    <>
        <Stack spacing={2} sx={{mb:5,position:"relative"}}>
            <Typography variant='h4'>
                Get Started with Tawk
            </Typography>
            <Stack direction={"row"} spacing={0.5}>
                <Typography>Alreadry have an Account?</Typography>
                <Link component={RouterLink} to="/auth/login" variant='subtitle2'>
                    Sign In
                </Link>
            </Stack>
                {/* Registration Form */}
                <RegisterForm/>

                <Typography component={"div"} sx={{color:"text.secondary",mt:3,typography:"caption",textAlign:"center"}}>
                    {'By Signing Up,I agree to '}
                    <Link underline='always' color="text.primary">
                        Terms of Service
                    </Link>
                    {' and '}
                    <Link underline='always' color="text.primary">
                        Privacy Policy
                    </Link>

                </Typography>
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

export default Register