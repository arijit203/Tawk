import { useTheme } from '@mui/material/styles'
import { Avatar, Box, Button, Divider, IconButton, Typography,Dialog,DialogContent,DialogContentText,
  DialogActions,Slide,DialogTitle } from '@mui/material'
import React,{useState} from 'react'
import {  Bell, Phone, Prohibit, Trash, VideoCamera, X } from 'phosphor-react';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { ToggleSidebar } from '../redux/slices/app';
import { faker } from '@faker-js/faker';
import AntSwitch from './AntSwitch';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const BlockDialog=({open,handleClose})=>{
  return (
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Block this Contact</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           Are you sure to block this Contact?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Yes</Button>
        </DialogActions>
      </Dialog>
  )
}
const DeleteDialog=({open,handleClose})=>{
  return (
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete this Chat</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           Are you sure to delete this chat?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Yes</Button>
        </DialogActions>
      </Dialog>
  )
}


function Contact() {
  const theme=useTheme();
  const dispatch=useDispatch();
  const [openBlock,setOpenBlock]=useState(false);
  const [openDelete,setOpenDelete]=useState(false);

  const handleCloseBlock=()=>{
    setOpenBlock(false);
  }

  const handleCloseDelete=()=>{
    setOpenDelete(false);
  }

  return (
    <Box sx={{width:340,height:"100vh"}}>
      <Stack sx={{height:"100%"}}>
        {/* Header body */}
        <Box sx={{
          boxShadow:"0px 0px 2px rgba(0,0,0,0.25)",
          width:"100%",
          backgroundColor:theme.palette.mode==="light"?"#F8FAFF":theme.palette.background,
        }}>
            <Stack sx={{height:"100%",p:2}} direction="row" alignItems={"center"} justifyContent="space-between" spacing={3}>
                <Typography fontWeight={600}>Contact Info</Typography>
                <IconButton onClick={()=>dispatch(ToggleSidebar())}>
                  <X />
                </IconButton>
            </Stack>
        </Box>
        {/* body */}
        <Stack sx={{height:"100%" ,position:"relative", flexGrow:1,overflow:"scroll"}} p={3} spacing={3}>
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <Avatar src={faker.image.avatar()} alt={faker.name.firstName()} sx={{height:64,width:64}} />
            <Stack spacing={0.5}>
            <Typography variant={"article"} fontWeight={600}>
              {faker.name.fullName()}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {'+91 6265081928'}
            </Typography>
            </Stack>

          </Stack>
          <Stack direction={"row"} alignItems={"center"} justifyContent={'space-evenly'}>
              <Stack spacing={1} alignItems={"center"} >
                <IconButton>
                  <Phone/>
                </IconButton>
                <Typography variant="overline">
                  Voice
                </Typography>
              </Stack>
              <Stack spacing={1} alignItems={"center"} >
                <IconButton>
                  <VideoCamera/>
                </IconButton>
                <Typography variant="overline">
                  Video
                </Typography>
              </Stack>
          </Stack>
          <Divider/>
          <Stack spacing={0.5}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2">Imagination is the only Limit</Typography>
          </Stack>
          <Divider/>
          <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Bell size={21}/>
              <Typography variant="subtitle2" >Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />
          <Typography>1 group in common</Typography>
          <Stack direction={"row"} spacing={2} alignItems={"center"}> 
            <Avatar src={faker.image.avatar()} alt={faker.name.fullName} />
            <Stack spacing={0.5}>
                <Typography variant="subtitle2">Coding Monk</Typography>
                <Typography variant="subtitle2">Owl, Parrot, Rabbit, You</Typography>  
            </Stack> 
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={4} sx={{ paddingTop: 2 }}>
            <Button onClick={()=>{
              setOpenBlock(true);
            }} startIcon={<Prohibit/>} fullWidth variant='outlined'>
              Block
            </Button>
            <Button onClick={()=>{
              setOpenDelete(true);
            }}startIcon={<Trash/>} fullWidth variant='outlined'>
              Delete
            </Button>
          </Stack>
          
             
          
          
        </Stack>
      </Stack>
         
         {openBlock && <BlockDialog open={openBlock} handleClose={handleCloseBlock}/>}
         {openDelete && <DeleteDialog open={openDelete} handleClose={handleCloseDelete}/>}
    
    </Box>
  )
}

export default Contact