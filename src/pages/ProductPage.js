import { Helmet } from 'react-helmet-async';
import { filter, parseInt } from 'lodash';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  InputLabel,
  TextField,
  Select,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct, getAllUser, updateProduct, updateUser } from 'src/redux/apiRequest';
import { Box } from '@mui/system';
import ModalCreateProduct from 'src/components/modal/ModalCreateProduct';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'ingredient', label: 'Ingredient', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------
const style = {
  display: 'flex',
  flexDirection: 'column',
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductPage() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);

  const [productEdit, setProductEdit] = useState();

  const [idProduct, setIdProduct] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [price, setPrice] = useState('')
  const [priceC, setPriceC] = useState(0)


  // console.log(valueDate);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [type, setType] = useState('pizza');



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const user = useSelector((state) => state.user.login.currentUser);
  const allUser = useSelector((state) => state.user.users?.allUser);
  const allProduct = useSelector((state) => state.product.products.allProduct);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    getAllProduct(dispatch)
  }, [openEditModal, openCreateProductModal]);

  const handleOpenEditModal = (item) => {
    setIdProduct(item._id)
    setOpenEditModal(true);
    setName(item.name)
    setType(item.type)
    setDescription(item.description)
    setIngredient(item.ingredient)
    setImgUrl(item.imgUrl)
    setPrice(item.price)
    setPriceC(parseInt(item.priceC))
  };

  const handleOpenProductCreate = () => {
    setOpenCreateProductModal(true)
  }
  const handleClose = () => {
    setOpenEditModal(false);
  };

  const handleUpdate = () => {
    const newUpdate = {
      name, description, ingredient, imgUrl, price, type,
      priceC: parseInt(priceC)
    }

    updateProduct(idProduct, dispatch, newUpdate)
    setOpenEditModal(false)


  }
  const handleChange = (e) => {
    setType(e.target.value)
  }
  const handleChangeDate = () => {

  }
  return (
    <>
      <Helmet>
        <title> User | Domino's </title>
      </Helmet>

      <Container>
       
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
          <Button onClick={handleOpenProductCreate} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allProduct?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {allProduct?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                    const selectedProduct = selected.indexOf(item?.handleFilterByName) !== -1;

                    return (
                      <TableRow hover key={item._id} tabIndex={-1} role="checkbox" selected={selectedProduct}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, item.name)} />
                        </TableCell>

                        <TableCell align="left">{item.name}</TableCell>

                        <TableCell align="left">{item.description}</TableCell>

                        <TableCell align="left">{item.price}</TableCell>

                        <TableCell align="left">{item.ingredient}</TableCell>

                        <TableCell align="left">{item.type}</TableCell>


                        <TableCell align="right" style={{ flexDirection: 'row' }}>
                          <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
                            <Button style={{ marginRight: 20 }} variant="outlined" onClick={() => handleOpenEditModal(item)}>
                              Edit
                            </Button>
                            {/* <Button variant="outlined">Delete</Button> */}
                          </div>
                          {/* <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allProduct?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <ModalCreateProduct setOpenCreateProductModal={setOpenCreateProductModal} openCreateModal={openCreateProductModal} />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h1>Update Product</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="Product name"
              variant="outlined"
              placeholder="Enter product name"
              defaultValue={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="Description"
              variant="outlined"
              placeholder="Enter "
              defaultValue={description}
              onChange={e => setDescription(e.target.value)}

            />
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="Ingredient"
              variant="outlined"
              placeholder="Enter ingredient"
              defaultValue={ingredient}
              onChange={e => setIngredient(e.target.value)}

            />
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="Image link"
              variant="outlined"
              placeholder="Enter "
              defaultValue={imgUrl}
              onChange={e => setImgUrl(e.target.value)}

            />
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="Price"
              variant="outlined"
              placeholder="Enter price"
              defaultValue={price}
              onChange={e => setPrice(e.target.value)}

            />
            <TextField
              style={{ paddingBottom: 20 }}
              id="outlined-basic"
              label="priceCount"
              variant="outlined"
              placeholder="Enter priceC"
              defaultValue={priceC}
              onChange={e => setPriceC(parseInt(e.target.value))}

            />
            <Select style={{ marginBottom: 20 }} value={type} label="Type" onChange={handleChange}>
              <MenuItem value={'pizza'}>pizza</MenuItem>
              <MenuItem value={'pasta'}>pasta</MenuItem>
              <MenuItem value={'sides'}>sides</MenuItem>
              <MenuItem value={'drinks'}>drinks</MenuItem>
              <MenuItem value={'dessert'}>dessert</MenuItem>
            </Select>

            <Button variant='outlined' onClick={handleUpdate}>Update</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
