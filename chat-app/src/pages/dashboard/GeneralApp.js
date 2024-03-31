import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Conversation from "../../components/Conversation";
import { useTheme } from "@emotion/react";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";

import NoChatSvg from "../../assets/Illustration/NoChat"

//Dynamic loading
const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar, chat_type, room_id } = useSelector((store) => store.app);

  return (
    <>
    <Stack direction="row" sx={{ width: "100%" }}>
      {/* {Chats} */}
      <Chats />

      <Box
        sx={{
          height: "100%",
          width: sidebar.open ? "calc(100vw - 810px)" : "calc(100vw - 470px)",
          backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
        }}
      >
        {room_id !== null && chat_type === "individual" ? (
          <Conversation />
        ) : (
          <Stack
            spacing={2}
            sx={{ height: "100%", width: "100%" }}
            alignItems={"center"}
            justifyContent={"center"}
          >
              <NoChatSvg />
              <Typography variant="subtitle2">
                Select a Conversation or start a new one
              </Typography>
          </Stack>
        )}
      </Box>
      {sidebar.open && <Contact />}
      </Stack>
    </>
  );
};

export default GeneralApp;
