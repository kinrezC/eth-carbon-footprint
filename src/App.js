import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { makeStyles } from '@material-ui/styles';
import { motion, useAnimation } from 'framer-motion';
import { Typography, TextField, Button } from '@material-ui/core';
import Carbon from './assets/carbon.png';
import EthLogo from './assets/Eth.png';
import Footprint from './assets/foot.png';

// TODO: INITIALIZE WEB3 AND UPDATE WITH CURRENT BLOCK

const web3 = new Web3();

const useStyles = makeStyles({
  root: {
    backgroundImage:
      'linear-gradient(320deg, rgba(2,0,36,1) 0%, rgba(61,69,77,1) 100%)',
    minHeight: '100%',
    minWidth: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textfield: {
    width: 500,
    marginTop: 22,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9e1aeb',
      },
    },
    '& label.Mui-focused': {
      color: '#e8ba23',
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiFormHelperText-root': {
      color: 'white',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 75,
  },
  images: {
    height: 150,
    width: 150,
    maxHeight: 150,
    maxWidth: 150,
    padding: 20,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 65,
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: '#bb01b8',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#bb01b8',
    },
  },
  errorWrapper: {
    marginTop: 20,
    position: 'fixed',
  },
  errorMsg: {
    color: 'red',
    fontWeight: 'bold',
  },
});

function App() {
  const controls = useAnimation();
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [blockNumber, setBlockNumber] = useState(null);
  const [invalidInput, setInvalidInput] = useState(false);
  const [values, setValues] = useState({
    ethAddress: '',
    lowerBound: '',
    upperBound: '',
  });

  const handleSubmit = () => {
    if (
      /^(0x)+[0-9a-fA-F]{40}$/i.test(values.ethAddress) &&
      Number(values.lowerBound) < Number(values.upperBound) &&
      Number(values.lowerBound) > 0 &&
      Number(values.upperBound) > 0 &&
      Number(values.upperBound) > blockNumber &&
      Number(values.lowerBound) > blockNumber
    ) {
      setDisableSubmit(true);
    }
    setInvalidInput(true);
  };

  const handleChange = name => event => {
    setInvalidInput(false);
    setValues({ ...values, [name]: event.target.value });
  };
  // TODO: SET BLOCK ON MOUNT
  useEffect(() => {
    web3.eth.getBlockNumber().then(res => setBlockNumber(res));
  }, []);

  useEffect(() => {
    const pollForBlock = setInterval(() => {
      web3.eth.getBlockNumber().then(res => setBlockNumber(res));
    }, 5000);
    return () => clearInterval(pollForBlock);
  }, []);

  useEffect(() => {
    controls.start(i => ({
      y: [-12, 12, -12],
      initial: false,
      transition: {
        delay: i * 0.3,
        loop: Infinity,
        duration: 2.2,
        ease: 'easeInOut',
      },
    }));
  }, [controls]);

  return (
    <div className={classes.root}>
      <div className={classes.appContainer}>
        <div className={classes.titleContainer}>
          <motion.div animate={controls} custom={0}>
            <img src={EthLogo} className={classes.images} />
          </motion.div>
          <motion.div animate={controls} custom={1}>
            <img src={Carbon} className={classes.images} />
          </motion.div>
          <motion.div animate={controls} custom={2}>
            <img src={Footprint} className={classes.images} />
          </motion.div>
        </div>
        <form autocomplete="off" className={classes.form}>
          <TextField
            id="ethAddress"
            name="ethAddress"
            label="Ethereum Address"
            className={classes.textfield}
            value={values.address}
            onChange={handleChange('ethAddress')}
            margin="normal"
            variant="outlined"
            disabled={disabled}
          />
          <TextField
            id="lowerBound"
            name="lowerBound"
            label="Lower Bound Block Number"
            className={classes.textfield}
            value={values.address}
            onChange={handleChange('lowerBound')}
            margin="normal"
            variant="outlined"
            disabled={disabled}
          />
          <TextField
            id="upperBound"
            name="upperBound"
            label="Upper Bound Block Number"
            className={classes.textfield}
            value={values.address}
            onChange={handleChange('upperBound')}
            margin="normal"
            variant="outlined"
            helperText={`Current Block: ${blockNumber}`}
            disabled={disabled}
          />
        </form>
        <div className={classes.errorWrapper}>
          {invalidInput && (
            <Typography variant="h6" className={classes.errorMsg}>
              Invalid Input!
            </Typography>
          )}
        </div>
        <Button
          variant="contained"
          className={classes.submitButton}
          disabled={disableSubmit}
          onClick={() => handleSubmit()}
        >
          See Your Gas Usage!
        </Button>
      </div>
    </div>
  );
}

export default App;
