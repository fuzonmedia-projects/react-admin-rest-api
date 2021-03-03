  
import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { fetchUtils } from 'react-admin';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const apiUrl = "http://localhost:3000";
const httpClient = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }
  
  options.credentials = 'include';
  
  return fetchUtils.fetchJson(url, options);
};


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState(0);
  const [username, setUsername] = useState(0);
  const [password, setPassword] = useState(0);
  const [cofirm_password, setConfirmPassword] = useState(0);
  const [warn, setWarn] = useState([]);

  function handleChange(e) {
    e.preventDefault();
    const value=e.target.value;
    const name=e.target.name;
    switch(name) {
      case "email":
        // code block
          setEmail(value);
        break;
      case "username":
        // code block
        setUsername(value);
        break;
      case "password":
        // code block
        setPassword(value);
        break;
      case "confirm-password":
          setConfirmPassword(value);
        break;
    }
    
  }
 function  handleSubmit(e) {
   e.preventDefault();
   setWarn(["error","processing"]);
   console.log(email,password,username,cofirm_password);

   const msg=validate();
   if(msg!=""){
     setWarn(["error",msg]);
     return;
   }
  const newuser={
     email:email,
     name:username,
     password:password,
   };
   const url=`${apiUrl}/register`;
   httpClient(url,{
     method:"POST",
     body:JSON.stringify(newuser),
   })
   .then(({json}) =>{
    //console.log("pp",json);
    if(json.status == 403)
    {
        if(typeof json.errors!=='undefined'){
              const [firstKey] = Object.keys(json.errors);
              setWarn(["error",json.errors[firstKey]]);
         }
    }else if(json.status == 200){
      setWarn(["success","Registere Successfully"]);
      //console.log(json,typeof json.status);
      // throw new Error("register fail");
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 3000);
    }
      

    }

    ).catch((e)=>{
       setWarn(["error","Cant submit"]);
       console.log(e);
     });



   
 }
//polarbear
 function validate() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //return "";
   var msg=""
   if(username.length < 2 ){
       msg="Username should be greater than 3 character";
   }else if(password.length < 8){
       msg="Password should be greater than 3 character";
   }else if(cofirm_password !== password){
      msg="Confirm Password not matching";
   }else if(!re.test(String(email).toLowerCase())){
      msg="Enter valid email";
   }
   return msg;
   
 }
 if(warn.length!==0){
   alert=<Alert severity={warn[0]} >{warn[1]}</Alert>;
 }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          {alert}
        
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />

           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            type="password"
            id="Username"
            autoComplete="current-password"
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="current-password"
            onChange={handleChange}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
