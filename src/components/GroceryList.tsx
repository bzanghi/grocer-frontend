import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Collapse,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ExpandMore,
  ShoppingBasket,
  CheckCircleOutline,
  Delete,
} from '@mui/icons-material'
import { useGroceryStore, GroceryItem } from '../store/groceryStore'
import { apiRequest } from '../utils/api'
import { useState } from 'react'

export function GroceryList() {
  const { items, setItems } = useGroceryStore()
  const [expandedAisle, setExpandedAisle] = useState<string | false>(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleItemCheck = async (aisle: string, item: GroceryItem) => {
    try {
      const updatedItems = await apiRequest(`item/update?aisle=${encodeURIComponent(aisle)}`, {
        method: 'POST',
        body: JSON.stringify({
          item_id: item.id,
          checked: !item.checked,
        }),
      })
      setItems(updatedItems)

      // Show success message briefly
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleRemoveItem = async (aisle: string, itemId: string) => {
    try {
      const updatedItems = await apiRequest(
        `item/remove?aisle=${encodeURIComponent(aisle)}&item_id=${encodeURIComponent(itemId)}`,
        {
          method: 'POST',
        }
      )
      setItems(updatedItems)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const getUncheckedCount = (aisleItems: GroceryItem[]) => {
    return aisleItems.filter(item => !item.checked).length
  }

  const getTotalUncheckedCount = () => {
    return Object.values(items).reduce((total, aisleItems) => 
      total + aisleItems.filter(item => !item.checked).length, 0
    )
  }

  const handleAccordionChange = (aisle: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAisle(isExpanded ? aisle : false)
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
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingBasket />
          Grocery List
          {getTotalUncheckedCount() > 0 && (
            <Badge
              badgeContent={getTotalUncheckedCount()}
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </Box>

      <Collapse in={showSuccess}>
        <Alert
          icon={<CheckCircleOutline />}
          severity="success"
          sx={{ borderRadius: 0 }}
        >
          Item updated successfully
        </Alert>
      </Collapse>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {Object.entries(items).length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              color: 'text.secondary',
            }}
          >
            <ShoppingBasket sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography align="center">
              Your grocery list is empty.
              <br />
              Start by adding some items!
            </Typography>
          </Box>
        ) : (
          Object.entries(items).map(([aisle, aisleItems]) => (
            <Accordion
              key={aisle}
              expanded={expandedAisle === aisle}
              onChange={handleAccordionChange(aisle)}
              sx={{ 
                mb: 1, 
                '&:last-child': { mb: 0 },
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? theme.palette.grey[900] 
                    : theme.palette.grey[50],
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  '&.Mui-expanded': {
                    minHeight: 48,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 500 }}>{aisle}</Typography>
                  {getUncheckedCount(aisleItems) > 0 && (
                    <Badge
                      badgeContent={getUncheckedCount(aisleItems)}
                      color="primary"
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                  {aisleItems.map((item) => (
                    <ListItem
                      key={item.id}
                      dense
                      sx={{
                        opacity: item.checked ? 0.6 : 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      secondaryAction={
                        <Tooltip title="Remove item">
                          <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={() => handleRemoveItem(aisle, item.id)}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={item.checked}
                          onChange={() => handleItemCheck(aisle, item)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              textDecoration: item.checked ? 'line-through' : 'none',
                              color: item.checked ? 'text.secondary' : 'text.primary',
                            }}
                          >
                            {item.name}
                            {item.quantity && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                ({item.quantity}{item.quantity_unit ? ` ${item.quantity_unit}` : ''})
                              </Typography>
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Paper>
  )
}
