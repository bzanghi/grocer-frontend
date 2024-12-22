import { useState, useRef, useEffect } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import { Send } from '@mui/icons-material'
import { useGroceryStore } from '../store/groceryStore'
import { apiRequest } from '../utils/api'

export function ChatInterface() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { messages, addMessage, setItems } = useGroceryStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      // Add user message to the chat immediately
      addMessage('user', input.trim())

      const data = await apiRequest('message', {
        method: 'POST',
        body: JSON.stringify({ 
          message: input.trim() 
        }),
      })

      // Add assistant's response to chat
      addMessage('assistant', data.response)
      
      // Update the grocery list with new items
      if (data.updated_list && Object.keys(data.updated_list).length > 0) {
        console.log('Updating items:', data.updated_list)
        setItems(data.updated_list)
      }

    } catch (error) {
      console.error('Error:', error)
      setError('Sorry, I encountered an error processing your request. Please try again.')
      addMessage('assistant', 'Sorry, I encountered an error processing your request. Please try again.')
    } finally {
      setIsLoading(false)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Paper 
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Chat Assistant</Typography>
      </Box>

      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography>
              👋 Hi! I can help you create a grocery list. Try saying:
              <br /><br />
              "I want to make lasagna"
              <br />
              "Add milk and eggs"
              <br />
              "What can I make with chicken and pasta?"
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                padding: 0,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  maxWidth: '80%',
                  p: 1.5,
                  backgroundColor: message.role === 'user' ? 'primary.main' : 'grey.700',
                  color: '#fff',
                  borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                }}
              >
                <ListItemText 
                  primary={message.content}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'system-ui',
                    } 
                  }}
                />
              </Paper>
            </ListItem>
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </List>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? theme.palette.grey[900] 
              : theme.palette.grey[100],
        }}
      >
        <TextField
          fullWidth
          placeholder="Add items or ask for recipes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          disabled={isLoading}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: (theme) => theme.palette.background.paper,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          disabled={isLoading || !input.trim()}
          sx={{ minWidth: '100px' }}
        >
          Send
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
