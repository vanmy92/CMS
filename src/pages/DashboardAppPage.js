import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, TextField, Select, MenuItem } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalDashboard } from 'src/redux/apiRequest';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [valueDate, setValueDate] = useState("")
  const [typeDate,setTypeDate] = useState("month")
  const [month,setMonth] = useState('Month')
  const [year,setYear] = useState('Year')


  const user = useSelector((state)=>state.user.login?.currentUser)
  const count = useSelector((state)=>state.bill.totalDashboard.total)
  console.log(count?.chartProduct);
  console.log(count);
  const theme = useTheme();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(()=>{
    if(!user){
      navigate('/login')
    }

    const payload = {
      date: valueDate,
      month:month,
      year:year
    }
    console.log(payload);
    getTotalDashboard(dispatch,payload)
  },[valueDate,year,month])

  const handleChangeDate = (e) => {
    setValueDate(e.target.value);
    setMonth('Month')
    setYear('Year')
  };

  const handleChangeMonth = e =>{
    setMonth(e.target.value)
    setValueDate(" ")
  }
  const handleChangeYear = e =>{
    setYear(e.target.value)
    setValueDate(" ")
  }
  return (
    <>
      <Helmet>
        <title> Dashboard | Domino's Restaurant </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Admin welcome back
        </Typography>
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

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Price" total={count?.countBill} icon={'tabler:brand-cashapp'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total User" total={count?.countUser} color="info" icon={'bx:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Product" total={count?.countProduct} color="warning" icon={'fluent:food-pizza-24-regular'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total ...." total={234} color="error" icon={'akar-icons:arrow-counter-clockwise'} />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Order"
              subheader="total order by month"
              chartLabels={[
                '01/2022',
                '02/2022',
                '03/2022',
                '04/2022',
                '05/2022',
                '06/2022',
                '07/2022',
                '08/2022',
                '09/2022',
                '10/2022',
                '11/2022',
                '12/2022',
              ]}
              // line,arena,column
              chartData={[
                {
                  name: '',
                  type: 'column', 
                  fill: 'solid',
                  data: count?.arrChart,
                },
               
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title="Product Selling"
              subheader="total product sell"
              chartLabels={count?.chartProduct?.name}
              // line,arena,column
              chartData={[
                {
                  name: '',
                  type: 'column', 
                  fill: 'solid',
                  data: count?.chartProduct?.total,
                },
               
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
