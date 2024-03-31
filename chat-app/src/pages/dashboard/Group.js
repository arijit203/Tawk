import { Box, IconButton, Stack, Typography,Link, useTheme, Divider,Avatar  } from "@mui/material";
import React, { useState } from "react";
import { Search, SearchIconWrapper } from '../../components/Search'
import StyledInputBase from '../../components/Search/StyledInputBase'
import { Plus,MagnifyingGlass } from "phosphor-react";
import { ChatList } from '../../data'
import {faker} from "@faker-js/faker"
import ChatElement from '../../components/ChatElement'
import {styled,alpha} from "@mui/material/styles"
import Badge from '@mui/material/Badge';
import CreateGroup from "../../sections/main/CreateGroup";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

function Group() {
  const theme=useTheme();
  const [openDialog,setOpenDialog]=useState(false);

  const handleCloseDialog=()=>{
    setOpenDialog(false);
  };
  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* Left */}
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background.default,
                width:370,
                boxShawdow:"0px 0px 2px rgba(0,0,0,0.25)"
          }}
        >
          <Stack p={3} spacing={2} sx={{maxHeight:"100vh"}}>
            <Stack >
                <Typography variant="h5">
                  Groups
                </Typography>
            </Stack>
            <Stack sx={{width:"100%"}}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Typography variant="subtitle2" component={Link}>
                Create a New Group
              </Typography>
              <IconButton onClick={()=>{
                setOpenDialog(true);
              }}>
                <Plus style={{color:theme.palette.primary.main}}/>
              </IconButton>
            </Stack>
            <Divider/>
            <Stack spacing={2} sx={{flexGrow:1,overflowY:"scroll",height:"100%", '::-webkit-scrollbar': { width: '12px', height: '12px' }}}>
                <Stack spacing={2.4}>
                    <Typography variant='subtitle2' sx={{color:"#676767"}}>
                        Pinned
                    </Typography>
                    {ChatList.filter((el) => el.pinned).map((el) => {
                        return <ChatElement {...el}/>;
                    })}
                </Stack>
                {/* <ChatElement /> */}
                <Stack spacing={2.4}>
                    <Typography variant='subtitle2' sx={{color:"#676767"}}  spacing={2}>
                    
                        All Groups
                    </Typography>
                    {ChatList.filter((el) => !el.pinned).map((el) => {
                        return <ChatElement {...el}/>;
                    })}
                </Stack>
                {/* </SimpleBarStyle> */}
            </Stack>
            {/* Right */}
          </Stack>

          

        </Box>
      </Stack>
      {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog}/>}
    </>
  );
}

export default Group;
