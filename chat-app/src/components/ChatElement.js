import {faker} from "@faker-js/faker"
import { Box, IconButton, Typography,Stack ,InputBase, Button, Divider, Avatar} from '@mui/material'
import {styled,alpha,useTheme} from "@mui/material/styles"
import Badge from '@mui/material/Badge';
import { selectConversation } from "../redux/slices/app";
import { useDispatch } from "react-redux";


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
  
const ChatElement = ({ id,name, msg,time,online,unread }) => {
    const theme = useTheme();
    const dispatch=useDispatch();
    return (
      <Box sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:theme.palette.mode==="light"?"#fff":theme.palette.background.default,

      }} p={2}
        
      onClick={()=>{
        dispatch(selectConversation({ room_id: id}))
    }}
      >
        <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={faker.image.avatar()} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{truncateText(msg,25)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge
            className="unread-count"
            color="primary"
            badgeContent={unread}
          />
        </Stack>
      </Stack>
  
      </Box>
    );
  }

  export default ChatElement;