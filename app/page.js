'use client'
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  Box, Typography, Stack, TextField, Button,
  Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'; 
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
// Function to fetch recipe suggestions based on inventory items
const getRecipeSuggestions = async (inventory) => {
  try {
    const ingredients = inventory.map(item => item.name).join(", ");
    const prompt = `Suggest some recipes that can be made with the following ingredients: ${ingredients}.`;

    const response = await axios.post('https://api.openai.com/v1/completions', {
      prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API response:', response.data);
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    return 'Failed to fetch recipe suggestions. Please try again later.';
  }
};


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState('');
 // Fetches and updates the inventory from Firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };
  // Adds a new item to the inventory or updates the quantity if it already exists

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  // Removes an item from the inventory or decrements its quantity
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };
  // Fetches recipe suggestions based on the current inventory

  const fetchRecipes = async () => {
    try {
      const suggestedRecipes = await getRecipeSuggestions(inventory);
      setRecipes(suggestedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes('Failed to fetch recipe suggestions. Please try again later.');
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="#f5f5f5"
        padding={2}
      >
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Item Name"
              type="text"
              fullWidth
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="quantity"
              label="Initial Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {
              addItem(itemName, itemQuantity);
              setItemName('');
              setItemQuantity(1);
              handleClose();
            }}>Add</Button>
          </DialogActions>
        </Dialog>

        <Box width="80%" maxWidth="1200px">
          <Stack spacing={2} direction="row" justifyContent="center" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add New Item
            </Button>
            <Button
              variant="contained"
              onClick={fetchRecipes}
            >
              Suggest Recipes
            </Button>
          </Stack>
          
          <Typography variant="h2" color="primary" textAlign="center" gutterBottom>
            Inventory Management
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Total Items</Typography>
                <Typography variant="h4">{inventory.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Total Quantity</Typography>
                <Typography variant="h4">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInventory.map(({ name, quantity }) => (
                      <TableRow key={name}>
                        <TableCell component="th" scope="row">{name}</TableCell>
                        <TableCell align="right">{quantity}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => removeItem(name)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>

        {recipes && (
          <Box mt={2} p={2} width="80%" maxWidth="1200px">
            <Typography variant="h4" gutterBottom>
              Recipe Suggestions
            </Typography>
            <Typography variant="body1">{recipes}</Typography>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
