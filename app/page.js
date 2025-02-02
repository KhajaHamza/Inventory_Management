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

  import { createTheme, ThemeProvider } from '@mui/material/styles';

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

 export default function Home() {
   const [inventory, setInventory] = useState([]);
   const [open, setOpen] = useState(false);
   const [itemName, setItemName] = useState('');
   const [itemQuantity, setItemQuantity] = useState(1);
   const [searchTerm, setSearchTerm] = useState('');

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
         display={'flex'}
         justifyContent={'center'}
         flexDirection={'column'}
         alignItems={'center'}
         gap={2}
         bgcolor="#f5f5f5"
         padding={12}
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

         <Button 
           variant="contained" 
           onClick={handleOpen}
         >
           <div className='mt-40'>
           Add New Item
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
           </div>
         </Button>

         <Box width="80%" maxWidth="1200px">
           <Typography variant={'h2'} color={'primary'} textAlign={'center'} gutterBottom>
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
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide text-black lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
       </Box>
     </ThemeProvider>
   );
  }
