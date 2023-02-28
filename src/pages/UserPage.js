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
import { getAllUser, updateUser } from 'src/redux/apiRequest';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import ModalViewOrderUser from 'src/components/modal/ModalViewOrderUser';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'stage', label: 'Stage', alignRight: false },

  // { id: 'status', label: 'Status', alignRight: false },
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

export default function UserPage() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewOrderModal, setOpenViewOrderModal] = useState(false);
  const [valueDate, setValueDate] = useState("")
  const [typeDate,setTypeDate] = useState("month")
  
  const [month,setMonth] = useState('Month')
  const [year,setYear] = useState('Year')

  const [userEdit, setUserEdit] = useState();
  const [userViewOrder, setUserViewOrder] = useState();


  const [role, setRole] = useState()
  const [username, setUsername] = useState()
  const [phone, setPhone] = useState()
  const [stage, setStage] = useState()

  const [idEdit, setIdEdit] = useState();

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
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    getAllUser(user?.accessToken, dispatch);
  }, [openEditModal]);

  const handleOpenEditModal = (item) => {
    setOpenEditModal(true);
    setUserEdit(item);
    setRole(item.role)
    setPhone(item.phone)
    setIdEdit(item._id)
  };
  const handleClose = () => {
    setOpenEditModal(false);
    setUserViewOrder()
    setOpenViewOrderModal(false)
    setValueDate('')
    setMonth('Month')
    setYear('Year')
  };
  const handleChangeRole = (e) => {
    setRole(e.target.value);
  }
  const handleChangeStage = (e) => {
    setStage(e.target.value);
  }

  const handleUpdate = () => {
    const newUpdate = {
      username,
      role,
      phone,
      stage,
    }
    updateUser(idEdit, user?.accessToken, newUpdate, dispatch)
    setOpenEditModal(false)
  }
  const handleOpenOrder = (item) => {
    setOpenViewOrderModal(true)
    setUserViewOrder(item);
  }
  return (
    <>
      <Helmet>
        <title> User | Domino's </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
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
                  rowCount={allUser?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {allUser?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                    const selectedUser = selected.indexOf(item?.username) !== -1;

                    return (
                      <TableRow hover key={item._id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, item.username)} />
                        </TableCell>

                        <TableCell align="left">{item.username}</TableCell>

                        <TableCell align="left">{item.email}</TableCell>

                        <TableCell align="left">{item.role}</TableCell>

                        <TableCell align="left">{item.phone}</TableCell>
                        
                        <TableCell align="left">{item.stage}</TableCell>


                        <TableCell align="right" style={{ flexDirection: 'row' }}>
                          <div style={{ flexDirection: 'row', display: 'flex' }}>
                            <Button variant="outlined" onClick={() => handleOpenEditModal(item)}>
                              Edit
                            </Button>
                            {item.role === 'chef' ? <></> : <Button onClick={() => handleOpenOrder(item)} style={{ marginLeft: 20 }} variant="outlined">View Order</Button>}
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
            count={allUser?.length}
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


      {/* Modal */}
      <ModalViewOrderUser month={month} setMonth={setMonth} year={year} setYear={setYear} setTypeDate={setTypeDate} typeDate={typeDate} setValueDate={setValueDate} valueDate={valueDate} token={user?.accessToken} dataUser={userViewOrder} openViewOrderModal={openViewOrderModal} handleClose={handleClose} />

  

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
          
           <div style={{ paddingBottom: 20 }}>
            <Select
              value={userEdit?.stage}
              label="Stage"
              onChange={handleChangeStage}
            >
              <MenuItem value={'STAGE_1'}>Khu 1</MenuItem>
              <MenuItem value={'STAGE_2'}>khu 2</MenuItem>
              <MenuItem value={'STAGE_3'}>khu 3</MenuItem>
            </Select>
          </div>
          <Button variant='contained' onClick={handleUpdate}>Save</Button>
        </Box>
      </Modal>
    </>
  );
}
