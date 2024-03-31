import { Box,Stack } from '@mui/material';
import React from 'react';
import { Chat_History } from '../../data';
import { Timeline, TextMsg,MediaMsg,ReplyMsg,LinkMsg,DocMsg} from './MsgTypes';


  
function Message() {
  return (
    <Box p={3}>
      
      <Stack spacing={3}>
        {Chat_History.map((el) => {
          console.log(el.type);
          if(el.type==='divider'){
            <Timeline  el={el} />
          }
          switch (el.type) {
            case 'divider':
                // console.log(el.type,"******");
              return <Timeline  el={el} />;
            case 'msg':
              switch (el.subtype) {
                case 'img':
                  // image
                  return (<MediaMsg el={el}/>)
                  
                case 'doc':
                  // doc img
                  return (<DocMsg el={el} />)
                  
                case 'link':
                    console.log("Linker***")
                    return (<LinkMsg el={el}/>)
                  // link
                
                case 'reply':
                    return (<ReplyMsg el={el}/>)
                  // text msg
                 
                default:
                  return <TextMsg  el={el} />;
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
}

export default Message;
