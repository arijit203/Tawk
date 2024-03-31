import {
  Box,
  IconButton,
  Typography,
  Stack,
  InputBase,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { faker } from "@faker-js/faker";

import Badge from "@mui/material/Badge";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { Search, SearchIconWrapper } from "../../components/Search";
import StyledInputBase from "../../components/Search/StyledInputBase";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { useDispatch, useSelector } from "react-redux";
import { selectConversation } from "../../redux/slices/app";
import { socket } from "../../socket";

const user_id=window.localStorage.getItem("user_id");

function Chats() {
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const {conversations}=useSelector((state)=>state.conversation.direct_chat)

  useEffect(()=>{
    socket.emit("get_direct_conversation",{user_id},(data)=>{
      //Data => list of existing conversations

    })
  },[])
  const dispatch = useDispatch();
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "370px",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.paper,
          height: "100vh",

          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <Users />
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
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
          <Stack spacing={1}>
            <Stack direction="row" alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              height: "100%",
              "::-webkit-scrollbar": { width: "12px", height: "12px" },
            }}
          >
            <Stack spacing={2.4}>
              {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                Pinned
              </Typography>
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })} */}
            
            {/* <ChatElement /> */}
            
              <Typography
                variant="subtitle2"
                sx={{ color: "#676767" }}
                spacing={2}
              >
                All Chats
              </Typography>
              {conversations.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack>
            {/* </SimpleBarStyle> */}
          </Stack>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
}

export default Chats;
