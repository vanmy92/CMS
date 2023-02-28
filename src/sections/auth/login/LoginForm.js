import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { loginUser } from 'src/redux/apiRequest';

import Iconify from '../../../components/iconify';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const user = useSelector((state)=>state.user.login?.currentUser)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handleClick = () => {
    const newUser = {
      email,password
    }
    loginUser(newUser,dispatch)
    navigate('/dashboard', { replace: true });
  };

  useEffect(()=>{
    if(user){
      navigate('/dashboard',{ replace: true })
    }
  })
  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e)=>setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          onChange={(e)=>setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
