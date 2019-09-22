import React, { useState, useEffect, useReducer } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ButtonBase, Typography, TextField, Button } from '@material-ui/core';
import Github from './Icons/Github';
import Hex from './Icons/Hex';
import Medium from './Icons/Medium';
import Twitter from './Icons/Twitter';
import Carbon from './assets/carbon.png';
import EthLogo from './assets/Eth.png';
import Footprint from './assets/foot.png';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://terminal.co/networks/ethereum_main/3428b88273cdf858',
  ),
);

const INITIAL_VALUES = {
  ethAddress: '',
  upperBound: '',
  lowerBound: '',
};

const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/Kinrezc',
  GITHUB: 'https://github.com/kinrezC',
  MEDIUM: 'https://blog.terminal.co/',
  TERMINAL: 'https://terminal.co/projects/yLYGOelqRdVbWaZJ/drive',
};

const NETWORK = 'ethereum_main';

const initialState = { buttonState: 'submit' };

const submitReducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return { buttonState: 'submit' };
    case 'pendingRes':
      return { buttonState: 'pending' };
    case 'hasRes':
      return { buttonState: 'reset' };
    default:
      throw new Error();
  }
};

const arrow = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.4 } },
};

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
    marginBottom: 8,
    marginTop: 40,
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
    width: 530,
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
    marginTop: 80,
  },
  title: {
    fontFamily: 'Nunito Sans',
  },
  submitButton: {
    width: 430,
    height: 50,
    backgroundColor: '#bb01b8',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#bb01b8',
    },
  },
  submitContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 37,
    marginTop: 25,
  },
  errorWrapper: {
    position: 'absolute',
    bottom: 25,
  },
  errorMsg: {
    fontFamily: 'Nunito Sans',
    color: 'red',
  },
  btnText: {
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    letterSpacing: 1.15,
  },
  loaderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 34,
    marginTop: 25,
  },
  loader: {
    height: 30,
    width: 30,
    borderRadius: 8,
    backgroundColor: '#bb01b8',
    marginTop: 25,
  },
  resWrapper: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  resContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
  },
  resText: {
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
    color: 'white',
  },
  githubIcon: {
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 95px)',
  },
  twitterIcon: {
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 45px)',
  },
  mediumIcon: {
    position: 'absolute',
    top: 8,
    left: 'calc(50% + 5px)',
  },
  terminalIcon: {
    position: 'absolute',
    top: 8,
    left: 'calc(50% + 55px)',
  },
  resetButton: {
    padding: 10,
    background: 'transparent',
    borderRadius: 10,
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
  resetContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 39,
    marginTop: 35,
  },
});

const App = () => {
  const controls = useAnimation();
  const footer = useAnimation();
  const results = useAnimation();
  const loadingAnimation = useAnimation();
  const classes = useStyles();
  const [state, dispatch] = useReducer(submitReducer, initialState);
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
      dispatch({ type: 'pendingRes' });
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
    axios({
      method: 'post',
      url:
        'https://us-central1-terminal-prd.cloudfunctions.net/null_9b7f3fa69d7a-4a37-ac34-df0640660076',
      data: {
        'address': values.ethAddress,
        'lowerBound': values.lowerBound,
        'upperBound': values.upperBound,
        'network': NETWORK,
      },
      headers: {
        'ApiKey': 'IYFLu2akdq6D4WhIqhZVVw==',
        'ApiSecret': 'lnlZOjCeKJm2OOh5vQ2FxNwwRYm7PCt10XNEU/8Bkyw=',
      },
    })
      .then(res => {
        dispatch({ type: 'hasRes' });
        console.log(res);
        res.data.feesPaid
          ? setFeesPaid(`${web3.utils.fromWei(res.data.feesPaid, 'ether')} ETH`)
          : setFeesPaid(`Unable to get fees paid :(`);
        res.data.gasUsed
          ? setGasUsed(res.data.gasUsed)
          : setGasUsed(`Unable to get gas usage :(`);
      })
      .catch(error => {
        dispatch({ type: 'hasRes' });
        setGasUsed(`Unable to get gas usage :(`);
        setFeesPaid(`Unable to get fees paid :(`);
      });
  };

  const resetClicked = () => {
    setValues({ ...INITIAL_VALUES });
    dispatch({ type: 'reset' });
    document.getElementById('ethAddress').value = '';
    document.getElementById('lowerBound').value = '';
    document.getElementById('upperBound').value = '';
    setGasUsed('');
    setFeesPaid('');
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
      transition: {
        delay: i * 0.5,
        loop: Infinity,
        duration: 2.2,
        ease: 'easeInOut',
      },
    }));
  }, [controls]);

  useEffect(() => {
    if (gasUsed && feesPaid) {
      results.start(i => ({
        opacity: [0, 1],
        transition: {
          delay: i * 1,
          duration: 2,
        },
      }));
    }
  }, [gasUsed, feesPaid]);

  useEffect(() => {
    footer.start(i => ({
      opacity: [0, 1],
      transition: {
        delay: i * 1,
        duration: 1,
      },
    }));
  }, [footer]);

  useEffect(() => {
    loadingAnimation.start(i => ({}));
  }, [loadingAnimation]);

  return (
    <div className={classes.root}>
      <div className={classes.appContainer}>
        <div className={classes.titleContainer}>
          <motion.div animate={controls} custom={0}>
            <img src={EthLogo} className={classes.images} alt="eth" />
          </motion.div>
          <motion.div animate={controls} custom={1}>
            <img src={Carbon} className={classes.images} alt="carbon" />
          </motion.div>
          <motion.div animate={controls} custom={2}>
            <img src={Footprint} className={classes.images} alt="footprint" />
          </motion.div>
        </div>
        <div className={classes.formContainer}>
          <div className={classes.headerContainer}>
            <Typography variant="h4" className={classes.title}>
              ETH · Carbon · Footprint
            </Typography>
          </div>
          <form autocomplete="off" className={classes.form} id="input-form">
            <TextField
              id="ethAddress"
              name="ethAddress"
              label="Ethereum Address"
              className={classes.textfield}
              value={values.address}
              onChange={handleChange('ethAddress')}
              margin="normal"
              variant="outlined"
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
            />
          </form>
          <AnimatePresence>
            {state.buttonState === 'submit' && (
              <div className={classes.submitContainer}>
                <Button
                  className={classes.submitButton}
                  onClick={() => handleSubmit()}
                >
                  <Typography variant="subtitle1" className={classes.btnText}>
                    View Results
                  </Typography>
                </Button>
              </div>
            )}
            {state.buttonState === 'pending' && (
              <div className={classes.loaderContainer}>
                <motion.div
                  className={classes.loader}
                  animate={{
                    scale: [1, 2, 1.7, 1, 1],
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
              </div>
            )}
            {//@NOTE SECOND DIV ADDED TO FORCE FULL DOM RERENDER OTHERWISE ANIMATIONS BREAK
            state.buttonState === 'reset' && (
              <div className={classes.resetContainer}>
                <div>
                  <motion.div
                    className={classes.resetButton}
                    onClick={resetClicked}
                    whileHover={{ rotate: 360, duration: 0.4, scale: 2 }}
                    initial={{ scale: 1.5 }}
                  >
                    <motion.svg
                      width="100"
                      height="100"
                      xmlns="http://www.w3.org/2000/svg"
                      variants={arrow}
                    >
                      <path
                        d="M12.8 5.1541V2.5a.7.7 0 0 1 1.4 0v5a.7.7 0 0 1-.7.7h-5a.7.7 0 0 1 0-1.4h3.573c-.7005-1.8367-2.4886-3.1-4.5308-3.1C4.8665 3.7 2.7 5.85 2.7 8.5s2.1665 4.8 4.8422 4.8c1.3035 0 2.523-.512 3.426-1.4079a.7.7 0 0 1 .986.9938C10.7915 14.0396 9.2186 14.7 7.5422 14.7 4.0957 14.7 1.3 11.9257 1.3 8.5s2.7957-6.2 6.2422-6.2c2.1801 0 4.137 1.1192 5.2578 2.8541z"
                        fill="#fff"
                        fillRule="nonzero"
                      />
                    </motion.svg>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className={classes.errorWrapper}>
          {invalidInput && (
            <Typography variant="h6" className={classes.errorMsg}>
              Invalid Input
            </Typography>
          )}
        </div>
        <div className={classes.resWrapper}>
          <AnimatePresence>
            {feesPaid && gasUsed && (
              <>
                <motion.div
                  className={classes.resContainer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <Typography variant="subtitle1" className={classes.resText}>
                    {`Gas Used`}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.resText}>
                    {`${gasUsed}`}
                  </Typography>
                </motion.div>
                <motion.div
                  className={classes.resContainer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <Typography variant="subtitle1" className={classes.resText}>
                    {`Fees Paid`}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.resText}>
                    {`${feesPaid}`}
                  </Typography>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={footer}
        custom={0}
        className={classes.githubIcon}
      >
        <ButtonBase
          onClick={() => window.open(SOCIAL_LINKS['GITHUB'], '_blank')}
        >
          <Github style={{ height: 35, width: 35, color: 'white' }} />
        </ButtonBase>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={footer}
        custom={1}
        className={classes.twitterIcon}
      >
        <ButtonBase
          onClick={() => window.open(SOCIAL_LINKS['TWITTER'], '_blank')}
        >
          <Twitter style={{ height: 35, width: 35, color: 'white' }} />
        </ButtonBase>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={footer}
        custom={2}
        className={classes.mediumIcon}
      >
        <ButtonBase
          onClick={() => window.open(SOCIAL_LINKS['MEDIUM'], '_blank')}
        >
          <Medium style={{ height: 35, width: 35, color: 'white' }} />
        </ButtonBase>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={footer}
        custom={3}
        className={classes.terminalIcon}
      >
        <ButtonBase
          onClick={() => window.open(SOCIAL_LINKS['TERMINAL'], '_blank')}
        >
          <Hex style={{ height: 35, width: 35, color: 'white' }} />
        </ButtonBase>
      </motion.div>
    </div>
  );
};

export default App;
