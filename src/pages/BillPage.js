import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
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
import { getAllBill, getAllUser, updateUser } from 'src/redux/apiRequest';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'numberTable', label: 'Table', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'order', label: 'Order User', alignRight: false },
  { id: 'takeMoney', label: 'Take money', alignRight: false },
  { id: 'placed', label: 'User placed', alignRight: false },
  { id: 'chef', label: 'Chef', alignRight: false },
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

export default function BillPage() {
  const [openEditModal, setOpenEditModal] = useState(false);

  const [userEdit, setUserEdit] = useState();

  const [role, setRole] = useState()
  const [username, setUsername] = useState()
  const [phone, setPhone] = useState()
  const [idEdit, setIdEdit] = useState();
  const [valueDate,setValueDate] = useState()
  const [typeDate,setTypeDate] = useState("month")
  const [month,setMonth] = useState('Month')
  const [year,setYear] = useState('Year')
  
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    console.log(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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
  const allBill = useSelector((state) => state.bill.bills.allBills)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  console.log("all bill", allBill?.bills);
  useEffect(() => {
    const payload = {
      date:valueDate,
      month:month,
      year:year
    }
    if (!user) {
      navigate('/login')
    }
    getAllBill(user.accessToken, dispatch,payload);
  }, [openEditModal,valueDate,typeDate,month,year]);

  const handleOpenEditModal = (item) => {
    setOpenEditModal(true);
    setUserEdit(item);
    setRole(item.role)
    setPhone(item.phone)
    setIdEdit(item._id)
  };
  const handleClose = () => {
    setOpenEditModal(false);
  };
  const handleChangeRole = (e) => {
    setRole(e.target.value);
  }

  const handleUpdate = () => {
    const newUpdate = {
      username,
      role,
      phone
    }
    updateUser(idEdit, user.accessToken, newUpdate, dispatch)
    setOpenEditModal(false)
  }

    const handleChangeDate = (e) => {
        setValueDate(e.target.value);
        setMonth('Month')
        setYear('Year')
    }

    
    
  const handleChangeMonth = e =>{
    setMonth(e.target.value)
    setValueDate("")
  }
  const handleChangeYear = e =>{
    setYear(e.target.value)
    setValueDate("")
  }

  return (
    <>
      <Helmet>
        <title> User | Domino's </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            All Bill
          </Typography>
          <div style={{display:'flex', flexDirection:'row'}}>
            <TextField onChange={handleChangeDate} value={valueDate} id="date" label="search with month" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 220 }} />

                <Select style={{ marginBottom: 20,marginRight:10 }}  value={month} onChange={handleChangeMonth}>
                <MenuItem value={'Month'}>Month</MenuItem>
                <MenuItem value={'01'}>Tháng 1</MenuItem>
                <MenuItem value={'02'}>Tháng 2</MenuItem>
                <MenuItem value={'03'}>Tháng 3</MenuItem>
                <MenuItem value={'04'}>Tháng 4</MenuItem>
                <MenuItem value={'05'}>Tháng 5</MenuItem>
                <MenuItem value={'06'}>Tháng 6</MenuItem>
                <MenuItem value={'07'}>Tháng 7</MenuItem>
                <MenuItem value={'08'}>Tháng 8</MenuItem>
                <MenuItem value={'09'}>Tháng 9</MenuItem>
                <MenuItem value={'10'}>Tháng 10</MenuItem>
                <MenuItem value={'11'}>Tháng 11</MenuItem>
                <MenuItem value={'12'}>Tháng 12</MenuItem>
              </Select>
              
              <Select style={{ marginBottom: 20 }} value={year} onChange={handleChangeYear}>
                <MenuItem value={'Year'}>Year</MenuItem>
                <MenuItem value={'2021'}>2021</MenuItem>
                <MenuItem value={'2022'}>2022</MenuItem>
                <MenuItem value={'2023'}>2023</MenuItem>
                <MenuItem value={'2024'}>2024</MenuItem>
                <MenuItem value={'2025'}>2025</MenuItem>
                <MenuItem value={'2026'}>2026</MenuItem>
                <MenuItem value={'2027'}>2027</MenuItem>
                <MenuItem value={'2028'}>2028</MenuItem>
                <MenuItem value={'2029'}>2029</MenuItem>
                <MenuItem value={'2030'}>2030</MenuItem>
               
                
              </Select>

          </div>
          <Typography variant="h5" gutterBottom>
            Total: {allBill?.total}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Price: {allBill?.price}
          </Typography>
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
                  rowCount={allBill?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {allBill?.bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) => {
                    const selectedUser = selected.indexOf(item?._id) !== -1;

                    return (
                      <TableRow hover tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, item._id)} />
                        </TableCell>

                        <TableCell align="left">{item.numberTable}</TableCell>

                        <TableCell align="left">{item.priceBill}</TableCell>

                        <TableCell align="left">{
                          item.status === "DON_MOI"
                            ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#82e8a7' }}>New</div>
                            : item.status === "DON_DA_XAC_NHAN"
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#facc17' }}>Wait chef</div>
                              : item.status === "BEP_XAC_NHAN" 
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#fb9948' }}>Wait place</div>
                              : item.status === "NHAN_VIEN_NHAN_MON" 
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#1f6991' }}>Done!</div>
                              : item.status === "HUY_DON" 
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: 'red' }}>Drop bill</div>
                              : (( item.status === "DA_THANH_TOAN") && item.isFailBill == true)
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#f0cb54' }}>Bill fail taked money</div>
                              : ((item.status === "FAIL_BILL" && item.status !== "DA_THANH_TOAN") && item.isFailBill == true)
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#f0cb54' }}>Bill đền</div>
                              : item.status === "DA_THANH_TOAN"
                              ? <div style={{ paddingTop: 7, paddingBottom: 7, fontWeight: 600, width: 'inherit',  color: '#308e53' }}>Taked money</div>
                              :<div>not status</div>
                                  }
                        </TableCell>

                        <TableCell align="left">{item.userActive?.username}</TableCell>
                        <TableCell align="left">{item.userTakeMoney?.username}</TableCell>
                        <TableCell align="left">{item.userPlaced?.username}</TableCell>

                        <TableCell align="left">{item.chefActive?.username}</TableCell>


                        <TableCell align="right" style={{ flexDirection: 'row' }}>
                          <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" onClick={() => handleOpenEditModal(item)}>
                              Edit
                            </Button>

                          </div>
                       
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
            count={allBill?.bills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            console.log('click editt', e);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingBottom: 20 }}>
            Thông tin chi tiết
          </Typography>

          <TextField
            id="modal-modal-description"
            disabled
            label="Phone"
            variant="outlined"
            defaultValue={userEdit?.email}
            style={{ paddingBottom: 20 }}
          />
          <TextField
            id="modal-modal-description"
            label="username"
            variant="outlined"
            defaultValue={userEdit?.username}
            style={{ paddingBottom: 20 }}
            onChange={(e) => setUsername(e.target.value)}

          />

          <div style={{ paddingBottom: 20 }}>
            <Select
              value={role}
              label="Role"
              onChange={handleChangeRole}

            >
              <MenuItem value={'customer'}>customer</MenuItem>
              <MenuItem value={'chef'}>chef</MenuItem>
              <MenuItem value={'cashier'}>cashier</MenuItem>
            </Select>
          </div>
          <TextField
            id="modal-modal-description"
            label="Phone"
            variant="outlined"
            defaultValue={userEdit?.phone}
            style={{ paddingBottom: 20 }}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button variant='contained' onClick={handleUpdate}>Save</Button>
        </Box>
      </Modal>
    </>
  );
}
