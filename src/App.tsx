import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material'
import { Brightness4, Brightness7, ShoppingBasket } from '@mui/icons-material'
import { useGroceryStore } from './store/groceryStore'
import { ChatInterface } from './components/ChatInterface'
import { GroceryList } from './components/GroceryList'
import { useState } from 'react'

function App() {
  const { darkMode, toggleDarkMode } = useGroceryStore()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [activeTab, setActiveTab] = useState<'list' | 'chat'>(isMobile ? 'list' : 'chat')

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // Material Blue
      },
      secondary: {
        main: '#4caf50', // Material Green
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ShoppingBasket /> Grocer
            </Typography>
            {isMobile && (
              <Box sx={{ mx: 2 }}>
                <IconButton
                  color={activeTab === 'list' ? 'primary' : 'inherit'}
                  onClick={() => setActiveTab('list')}
                >
                  <ShoppingBasket />
                </IconButton>
                <IconButton
                  color={activeTab === 'chat' ? 'primary' : 'inherit'}
                  onClick={() => setActiveTab('chat')}
                >
                  <Typography variant="body1">💬</Typography>
                </IconButton>
              </Box>
            )}
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 2,
            p: 2,
            overflow: 'hidden',
          }}
        >
          {(!isMobile || activeTab === 'list') && <GroceryList />}
          {(!isMobile || activeTab === 'chat') && <ChatInterface />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
