import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate a session ID when component mounts
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage,
        sessionId: sessionId,
      });

      setMessages((prev) => [
        ...prev,
        { text: response.data.response, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflow: 'auto',
          bgcolor: '#f5f5f5',
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.sender === 'user' ? '#e3f2fd' : '#fff',
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.text}
                    </Typography>
                  }
                />
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <ListItem>
              <CircularProgress size={20} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about college branches and career paths..."
          variant="outlined"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
}

export default ChatInterface;
