'use client'
import Image from "next/image"
import { useState,useEffect } from "react"
import { firestore } from '../firebase'; // Correctly import firestore

import { collection, deleteDoc, doc, getDocs,getDoc,query, setDoc } from 'firebase/firestore' // Firestore functions

import { Box, Modal, Stack, TextField, Typography } from "@mui/material";

export default function Home() {
  const [inventory,setInventory]=useState([])
  const [open,setOpen]=useState(false)
  const [itemName,setItemName]=useState('')

// This function gets all items from the database and updates our app
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)// Update the app with the new list

    console.log(inventoryList)
  }


  // This function adds a new item or increases its quantity
  const addItem=async(item) =>{
    const docRef=doc(collection(firestore,'inventory'),item)
    const docSnap=await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity}=docSnap.data()
      await setDoc(docRef,{quantity:quantity+1})// If the item exists, increase its quantity by 1

  }
else{
  await setDoc(docRef,{quantity:1})
}
await updateInventory()
  }

// This function removes an item or decreases its quantity
  const removeItem=async(item) =>{
    const docRef=doc(collection(firestore,'inventory'),item)
    const docSnap=await getDoc(docRef)

  if (docSnap.exists()){
    const {quantity}=docSnap.data()
    if (quantity==1){
      await deleteDoc(docRef)
    }
    else{
      await setDoc(docRef,{quantity:quantity-1})
    }
  }
  await updateInventory()
}

// These functions control opening and closing a popup
  useEffect(() => {
    updateInventory()
  }, []);

  const handleOpen=()=>setOpen(true)
  const handleClose=()=>setOpen(false)
  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center"
    alignItems="center" gap={2}>
    <Modal open={open} onClose={handleClose}>
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)" width={400} bgcolor="white" border="2px solid #000"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}>
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField variant="outlined" fullWidth value={itemName}
          onChange={(e)=>{
            setItemName(e.target.value)
          }}></TextField>
        </Stack>
          </Box>
    </Modal>
      <Typography variant ="h1">Inventory Management</Typography>
  
      </Box>
    )
}
  