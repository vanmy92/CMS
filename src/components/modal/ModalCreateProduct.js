import { MenuItem, Modal, Select, TextField,Button } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from 'src/redux/apiRequest';
import Typography from 'src/theme/overrides/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalCreateProduct = ({ setOpenCreateProductModal, openCreateModal }) => {
  const [type, setType] = useState('pizza');
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [ingredient,setIngredient] = useState('')
  const [imgUrl,setImgUrl] = useState('')
  const [price,setPrice] = useState('')
  const [priceC,setPriceC] = useState(0)

  const dispatch  = useDispatch()
  const handleCreate = () => {
    const newProduct = {
      name,description,ingredient,imgUrl,price,type,
      priceC: parseInt(priceC)
    }
    createProduct(dispatch,newProduct)
    setOpenCreateProductModal(false)

  };
  const handleChange = (e) =>{
    setType(e.target.value)
  }
  return (
    <Modal
      open={openCreateModal}
      onClose={() => setOpenCreateProductModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <h1>Create Product</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="Product name"
            variant="outlined"
            placeholder="Enter product name"
            onChange={(e)=>setName(e.target.value)}
          />
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="Description"
            variant="outlined"
            placeholder="Enter "
            onChange={(e)=>setDescription(e.target.value)}

          />
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="Ingredient"
            variant="outlined"
            placeholder="Enter ingredient"
            onChange={(e)=>setIngredient(e.target.value)}

          />
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="Image link"
            variant="outlined"
            placeholder="Enter "
            onChange={(e)=>setImgUrl(e.target.value)}

          />
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="Price"
            variant="outlined"
            placeholder="Enter price"
            onChange={(e)=>setPrice(e.target.value)}

          />
          <TextField
            style={{ paddingBottom: 20 }}
            id="outlined-basic"
            label="priceCount"
            variant="outlined"
            placeholder="Enter priceC"
            onChange={(e)=>setPriceC(e.target.value)}

          />
          <Select style={{marginBottom:20}} value={type} label="Type" onChange={handleChange}>
            <MenuItem value={'pizza'}>pizza</MenuItem>
            <MenuItem value={'pasta'}>pasta</MenuItem>
            <MenuItem value={'sides'}>sides</MenuItem>
            <MenuItem value={'drinks'}>drinks</MenuItem>
            <MenuItem value={'dessert'}>dessert</MenuItem>
          </Select>

            <Button variant='outlined' onClick={handleCreate}>Create</Button>
        </div>
      </Box>
      
    </Modal>
  );
};

export default ModalCreateProduct;
