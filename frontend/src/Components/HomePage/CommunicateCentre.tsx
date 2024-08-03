import React, { useEffect, useRef, useState } from 'react';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  useTheme,
  Popover,
  InputAdornment,
  Link,
  Divider,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageRequest, MessageResponse } from '../../Models/Message';

const ChatComponent: React.FC = () => {
  const theme = useTheme();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<MessageRequest[]>([]);
  const [message, setMessage] = useState('');
  const userName = localStorage.getItem('username') ?? 'Anonymous';
  const token = localStorage.getItem('token') ?? '';

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    // create new connection
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5078/chatHub', {
        accessTokenFactory: () => token, // pass token to the server
      })
      .configureLogging(LogLevel.Information)
      .build();
    setConnection(newConnection);

    // handle incoming messages
    newConnection.on('ReceiveMessage', (chatMessage: MessageRequest) => {
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
    });

    newConnection.on('LoadMessages', (messages: MessageResponse[]) => {
      // transform messages to MessageRequest type
      const messageRequests: MessageRequest[] = messages.map((msg) => ({
        type: 'chat', // default to chat type
        userName: msg.userName,
        content: msg.content,
        createdAt: new Date(msg.createdAt), // convert to Date object
      }));
      // handle incoming messages
      setMessages((prevMessages) => [...messageRequests, ...prevMessages]);
    });

    newConnection.on('Error', (_message: string) => {
      //console.error('Error from server: ', message);
      // show error message
    });

    // start the connection
    newConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');
        // history message
        newConnection
          .invoke('LoadMessages')
          .catch((err) => console.error('Error while loading messages: ', err));
      })
      .catch((err) => console.error('Error while starting connection: ', err));

    // clear connection on unmount
    return () => {
      newConnection
        .stop()
        .then(() => console.log('Connection stopped'))
        .catch((err) => console.error('Error stopping connection: ', err));
    };
  }, [token]);

  useEffect(() => {
    // auto scroll to bottom when new message is received
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (connection) {
      const chatMessage: MessageRequest = {
        type: 'chat',
        userName: userName,
        content: message,
        createdAt: new Date(),
      };

      try {
        await connection.invoke('SendMessage', chatMessage);
        setMessage('');
        scrollToBottom();
      } catch (err) {
        console.error('Error sending message: ', err);
      }
    }
  };

  // handle emoji click
  const handleEmojiClick = (emoji: any) => {
    const cursorPosition = textFieldRef.current?.selectionStart || 0;
    const newMessage =
      message.slice(0, cursorPosition) +
      emoji.native +
      message.slice(cursorPosition);
    setMessage(newMessage);
    setShowPicker(false);
  };

  const handlePickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowPicker(true);
  };

  const handlePickerClose = () => {
    setAnchorEl(null);
    setShowPicker(false);
  };
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    setShowScrollToBottom(scrollTop < scrollHeight - clientHeight - 100);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        margin: '0',
        padding: '0',
        border: 1,
        borderColor: 'divider',
        position: 'relative',
      }}
    >
      {isLoggedIn ? (
        <>
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              textAlign: 'left',
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: theme.palette.text.primary, marginLeft: 2 }}
            >
              Welcome - {userName}
            </Typography>
          </Box>
          <Divider sx={{ boxShadow: 1 }} />
          <Box
            ref={chatContainerRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              position: 'relative',
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection:
                    msg.userName === userName ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor:
                      msg.userName === userName
                        ? theme.palette.secondary.main
                        : theme.palette.background.paper,
                    borderRadius: 2,
                    maxWidth: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:
                      msg.userName === userName ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={
                      msg.userName === userName
                        ? theme.palette.background.default
                        : theme.palette.secondary.main
                    }
                  >
                    {msg.userName || 'Anonymous'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.palette.text.primary}
                  >
                    {msg.createdAt.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={
                      msg.userName === userName
                        ? theme.palette.background.default
                        : theme.palette.text.primary
                    }
                  >
                    {msg.content || ''}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box>
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                inputRef={textFieldRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePickerOpen}>😀</IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Popover
                open={showPicker}
                anchorEl={anchorEl}
                onClose={handlePickerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Picker data={data} onEmojiSelect={handleEmojiClick} />
              </Popover>
              <Button
                variant="contained"
                color="secondary"
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                Send
              </Button>
            </Box>
          </Box>
          {showScrollToBottom && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.background.default,
                opacity: 0.8,
                boxShadow: 3,
                borderRadius: 10,
                p: 1,
              }}
            >
              <IconButton
                onClick={() =>
                  chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: 'smooth',
                  })
                }
                color="inherit"
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">
            Please{' '}
            <Link href="/login" color="secondary">
              Log in
            </Link>{' '}
            to access the chat.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatComponent;
