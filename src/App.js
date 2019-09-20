import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { motion, useAnimation } from 'framer-motion';
import { Typography, TextField, Button } from '@material-ui/core';
import Carbon from './assets/carbon.png';
import EthLogo from './assets/Eth.png';
import Footprint from './assets/foot.png';

// TODO: INITIALIZE WEB3 AND UPDATE WITH CURRENT BLOCK
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://terminal.co/networks/ethereum_main/3428b88273cdf858',
  ),
);

const NETWORK = 'ethereum_main';

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
    width: 430,
    marginTop: 22,
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Nunito Sans',
      color: 'white',
      '& fieldset': {
        borderColor: '#393939',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& label.Mui-focused': {
      color: 'white',
      fontFamily: 'Nunito Sans',
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'Nunito Sans',
      color: 'white',
    },
    '& .MuiInputLabel-outlined': {
      color: 'white',
      fontFamily: 'Nunito Sans',
    },
    '& .MuiFormHelperText-root': {
      color: 'white',
      fontFamily: 'Nunito Sans',
      fontWeight: 'bold',
    },
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 300,
    paddingBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 50,
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
  title: {
    fontFamily: 'Nunito Sans',
  },
  submitButton: {
    marginTop: 25,
    width: 430,
    height: 50,
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
    fontFamily: 'Nunito Sanas',
    color: 'red',
    fontWeight: 'bold',
  },
  btnText: {
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    letterSpacing: 1.15,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 8,
    background: 'white',
    marginTop: 150,
  },
  loader: {
    height: 30,
    width: 30,
    borderRadius: 8,
    backgroundColor: '#bb01b8',
    marginTop: 25,
  },
  resContainer: {
    marginTop: 30,
  },
  resText: {
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    color: 'white',
  },
});

const App = () => {
  const controls = useAnimation();
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [blockNumber, setBlockNumber] = useState('');
  const [invalidInput, setInvalidInput] = useState(false);
  const [gasUsed, setGasUsed] = useState('');
  const [feesPaid, setFeesPaid] = useState('');
  const [values, setValues] = useState({
    ethAddress: '',
    lowerBound: '',
    upperBound: '',
  });

  const handleSubmit = () => {
    if (
      /^(0x)+[0-9a-fA-F]{40}$/i.test(values.ethAddress) &&
      Number(values.lowerBound) < Number(values.upperBound) &&
      Number(values.lowerBound) >= 0 &&
      Number(values.upperBound) > 0 &&
      Number(values.upperBound) <= blockNumber &&
      Number(values.lowerBound) < blockNumber
    ) {
      setDisableSubmit(true);
      fetchData();
      return;
    }
    setInvalidInput(true);
  };

  const handleChange = name => event => {
    setInvalidInput(false);
    setValues({ ...values, [name]: event.target.value });
  };

  const fetchData = () => {
    axios
      .post(
        'https://us-central1-terminal-prd.cloudfunctions.net/custom_api_fc5a3b6d7eb4-45a3-bf3f-fb4be68b7b83',
        {
          address: values.ethAddress,
          lowerBound: values.lowerBound,
          upperBound: values.upperBound,
          network: NETWORK,
        },
        {
          headers: {
            'ApiKey': 'IYFLu2akdq6D4WhIqhZVVw==',
            'ApiSecret': 'lnlZOjCeKJm2OOh5vQ2FxNwwRYm7PCt10XNEU/8Bkyw=',
          },
        },
      )
      .then(res => console.log(res));
  };

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

  useEffect(() => {
    if (disableSubmit) {
    }
  });

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
        <div className={classes.formContainer}>
          <div className={classes.headerContainer}>
            <Typography variant="h4" className={classes.title}>
              ETH · Carbon · Footprint
            </Typography>
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
            {disableSubmit ? (
              <motion.div
                className={classes.loader}
                animate={{
                  scale: [1, 2.5, 2, 1, 1],
                  rotate: [0, 0, 270, 270, 0],
                  borderRadius: ['20%', '20%', '50%', '50%', '20%'],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  times: [0, 0.2, 0.5, 0.8, 1],
                  loop: Infinity,
                  repeatDelay: 1,
                }}
              />
            ) : (
              <Button
                className={classes.submitButton}
                onClick={() => handleSubmit()}
              >
                <Typography variant="subtitle1" className={classes.btnText}>
                  View Results
                </Typography>
              </Button>
            )}
          </form>
        </div>
        <div className={classes.errorWrapper}>
          {invalidInput && (
            <Typography variant="h6" className={classes.errorMsg}>
              Invalid Input
            </Typography>
          )}
        </div>
        {gasUsed && (
          <motion.div className={classes.resContainer}>
            <Typography variant="subtitle2" className={classes.resText}>
              {`Gas Used: ${gasUsed}`}
            </Typography>
          </motion.div>
        )}
        {feesPaid && (
          <motion.div className={classes.resContainer}>
            <Typography variant="subtitle2" className={classes.resText}>
              {`Fees Paid: ${feesPaid}`}
            </Typography>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;
