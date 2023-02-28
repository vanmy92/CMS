import { MenuItem, Modal, Select, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBillUser } from 'src/redux/apiRequest';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'scroll',
};
const ModalViewOrderUser = ({
  token,
  dataUser,
  openViewOrderModal,
  handleClose,
  setValueDate,
  valueDate,
  typeDate,
  month,setMonth,year,setYear
}) => {
  const billUser = useSelector((state) => state.bill.billUserActive.userBill);


  console.log(typeDate);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    handleClose();
  };


  useEffect(() => {
    const payload = {
      date: valueDate,
      month:month,
      year:year,
    };
    if (dataUser) {
      getAllBillUser(token, dispatch, dataUser?._id, payload);
    }
  }, [dataUser, valueDate,typeDate,month,year]);

  
  const handleChangeDate = (e) => {
    setValueDate(e.target.value);
    setMonth('Month')
    setYear('Year')

  };
  const handleChangeMonth = e =>{
    setMonth(e.target.value)
    setValueDate("")
  }
  const handleChangeYear = e =>{
    setYear(e.target.value)
    setValueDate("")
  }

  return (
    <Modal
      open={openViewOrderModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <h1 style={{ color: '#1f6991' }}>Hóa đơn của {dataUser?.username}</h1>
        </div>
        <Stack component="form" noValidate spacing={3}>
        <div style={{display:'flex', flexDirection:'row'}}>
              <TextField
                onChange={handleChangeDate}
                value={valueDate}
                id="date"
                label="time"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 220,marginRight:5 }}
              />
             
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
        </Stack>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 600, color: '#ee7638' }}>Total Bill: {billUser?.total} </p>
          {billUser?.isBonous == true && month!=='Month' ? <p style={{fontWeight: 600, color: '#880808'}}>thưởng</p> :<></>}
          <p style={{ fontWeight: 600, color: '#ee7638' }}>All Price: {billUser?.price}</p>
        </div>
        <div style={{ flexDirection: 'row', display: 'flex', paddingBottom: 7, borderBottom: '1px solid #bec1c7' }}>
          <div style={{ width: 150, color: '#A0AEC0', fontWeight: 600 }}>Table</div>
          <div style={{ width: 150, color: '#A0AEC0', fontWeight: 600 }}>Status</div>
          <div style={{ width: 200, color: '#A0AEC0', fontWeight: 600 }}>Product</div>
          <div style={{ width: 150, color: '#A0AEC0', fontWeight: 600 }}>Price</div>
        </div>
        <div>
          {billUser?.allBill.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderBottom: '1px solid #bec1c7',
                  paddingBottom: 15,
                  paddingTop: 15,
                }}
              >
                <div style={{ width: 150 }}>{item.numberTable}</div>
                <div style={{ width: 150 }}>
                  {item.status === 'DON_MOI' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: '#82e8a7' }}>New</div>
                  ) : item.status === 'DON_DA_XAC_NHAN' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: '#facc17' }}>Wait chef</div>
                  ) : item.status === 'BEP_XAC_NHAN' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: '#fb9948' }}>Wait place</div>
                  ) : item.status === 'NHAN_VIEN_NHAN_MON' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: '#1f6991' }}>Done!</div>
                  ) : item.status === 'HUY_DON' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: 'red' }}>Drop bill</div>
                  ) : item.status ==='DA_THANH_TOAN' ? (
                    <div style={{ fontWeight: 600, width: 'inherit', color: '#308e53' }}>Taked money</div>
                  )
                  : (
                    <div>not status</div>
                  )}
                </div>
                <div style={{ width: 200 }}>
                  {item.products.map((product, index) => {
                    return <div>{product.name}</div>;
                  })}
                </div>
                <div style={{ width: 150, color: '#1f6991', fontWeight: 600 }}>{item.priceBill} đ</div>
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalViewOrderUser;
