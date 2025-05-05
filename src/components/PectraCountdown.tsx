'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Define the structure of a network
interface NetworkConfig {
  beaconApi: string;
  rpc: string;
  target: number;
  targetepoch:number;
  name: string;
}

// Define the available networks
const networks: Record<string, NetworkConfig> = {
  sepolia: {
    beaconApi: "https://ethereum-sepolia-beacon-api.publicnode.com",
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    target: 7118848,
    targetepoch: 222464,
    name: "Sepolia",
  },
  holesky: {
    beaconApi: "https://ethereum-holesky-beacon-api.publicnode.com",
    rpc: "https://ethereum-holesky-rpc.publicnode.com",
    target: 3710976,
    targetepoch: 115968,
    name: "Holesky",
  },
  mainnet: {
    beaconApi: "https://ethereum-beacon-api.publicnode.com",
    rpc: "https://ethereum-rpc.publicnode.com",
    target: 11649024,
    targetepoch: 364032,
    name: "Mainnet",
  },
};

const PectraCountdown: React.FC = () => {
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [timer, setTimer] = useState<number>(13); // 13-second timer
  const [network, setNetwork] = useState<keyof typeof networks>('mainnet'); // Default network
  const [loading, setLoading] = useState<boolean>(true); // Show loader only on first load
  const [countdown, setCountdown] = useState<string>(''); // Countdown for days, hours, minutes
  const [isUpgradeLive, setIsUpgradeLive] = useState<boolean>(false); // Track if the upgrade is live

  const countdownInterval = useRef<NodeJS.Timeout | null>(null); // Store interval reference

  const fetchData = async () => {
    try {
      const { beaconApi, rpc, target } = networks[network];

      // Fetch the latest block header to get the current slot
      const beaconResponse = await fetch(
        `${beaconApi}/eth/v1/beacon/headers/head`
      );
      const beaconData = await beaconResponse.json();
      const slot: number = parseInt(beaconData.data.header.message.slot);

      // Calculate the epoch from the slot (1 epoch = 32 slots)
      const epoch: number = Math.floor(slot / 32);

      // Fetch the current block number from the execution layer
      const executionResponse = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });

      const executionData = await executionResponse.json();
      const blockNumber: number = parseInt(executionData.result, 16);

      setCurrentSlot(slot);
      setCurrentEpoch(epoch);
      setCurrentBlock(blockNumber);

      // Check if the upgrade is live
      if (target !== 999999999 && slot >= target) {
        setIsUpgradeLive(true);
        setCountdown('');
        return;
      } else {
        setIsUpgradeLive(false);
      }

      // Countdown logic with live updates
      if (target !== 999999999 && !isUpgradeLive) {
        const slotsRemaining: number = target - slot;
        let totalSecondsRemaining: number = slotsRemaining * 12; // 12 seconds per slot

        // Clear previous interval if it exists
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }

        countdownInterval.current = setInterval(() => {
          if (totalSecondsRemaining <= 0) {
            clearInterval(countdownInterval.current!);
            setCountdown('0D 0H 0M 0S');
            return;
          }

          totalSecondsRemaining -= 1; // Decrement every second
          const days: number = Math.floor(totalSecondsRemaining / (3600 * 24));
          const hours: number = Math.floor(
            (totalSecondsRemaining % (3600 * 24)) / 3600
          );
          const minutes: number = Math.floor(
            (totalSecondsRemaining % 3600) / 60
          );
          const seconds: number = Math.floor(totalSecondsRemaining % 60);

          setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
        }, 1000);
      } else {
        setCountdown('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      console.log(currentBlock);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      setTimer(13); // Reset the timer to 13 seconds after each fetch
    }, 13000); // Fetch every 13 seconds

    // Countdown timer that resets every second
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 13 : prev - 1)); // Countdown logic
    }, 1000);

    fetchData(); // Fetch on initial load

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [network]);

  const handleNetworkChange = (newNetwork: keyof typeof networks) => {
    setNetwork(newNetwork);
    setLoading(true); // Show loader when switching networks
  };

  // Calculate the slots in the current epoch
  const startSlot = currentEpoch * 32;
  const slotsInEpoch = Array.from({ length: 32 }, (_, i) => startSlot + i);

  // Split the slots into two rows
  const firstRowSlots = slotsInEpoch.slice(0, 18);
  const secondRowSlots = slotsInEpoch.slice(18);

  // Calculate the slots remaining until the target
  const slotsRemaining = networks[network].target - currentSlot;
  // const epochsRemaining = networks[network].targetepoch - currentEpoch;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      className="flex flex-col items-center p-8 max-w-6xl mx-auto mt-6 
    rounded-2xl shadow-2xl border border-purple-300/50 
    bg-white/30 dark:bg-gray-900/30 
    backdrop-blur-xl backdrop-saturate-150 text-gray-900 dark:text-white"
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-extrabold mb-6 text-center"
      >
        🚀 PECTRA Upgrade ({networks[network].name})
      </motion.h2>

      {/* Network Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex space-x-4 mb-6"
      >
        {['holesky', 'sepolia', 'mainnet'].map((net) => (
          <motion.button
            key={net}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNetworkChange(net)}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg text-lg
            ${
              network === net
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-105 shadow-purple-500/50'
                : 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white hover:scale-105 hover:shadow-lg hover:bg-purple-400 dark:hover:bg-purple-500 hover:text-white'
            }`}
          >
            {net.charAt(0).toUpperCase() + net.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Loader or Upgrade Status */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      ) : isUpgradeLive || slotsRemaining <= 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-bold animate-pulse text-center"
        >
          🎉 The upgrade is now live on the Ethereum {networks[network].name}{' '}
          testnet! 🎉
        </motion.p>
      ) : (
        <>
          {/* Slots Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="p-6 mb-6 bg-gray-700 text-white rounded-xl text-xs font-normal flex flex-col items-center shadow-lg"
          >
            {/* First Row of Slots */}
            <motion.div
              className="flex flex-wrap justify-center mb-4 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {firstRowSlots.map((slot) => {
                const isProcessed = slot < currentSlot;
                const isCurrent = slot === currentSlot;
                
                return (
                  <motion.div
                    key={slot}
                    whileHover={{ scale: 1.1 }}
                    className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold transition-all
                    ${isCurrent ? 'bg-teal-500 animate-pulse shadow-lg' : isProcessed ? 'bg-purple-500' : 'bg-gray-500'}
                  `}
                  >
                    {slot}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Second Row of Slots */}
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {secondRowSlots.map((slot) => {
                const isProcessed = slot < currentSlot;
                const isCurrent = slot === currentSlot;
                return (
                  <motion.div
                    key={slot}
                    whileHover={{ scale: 1.1 }}
                    className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold transition-all
                    ${isCurrent ? 'bg-green-500 animate-pulse shadow-lg' : isProcessed ? 'bg-purple-500' : 'bg-blue-500'}
                  `}
                  >
                    {slot}
                  </motion.div>
                );
              })}
              <motion.div
                className="flex flex-col items-center ml-4 pt-3 pb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {networks[network].target !== 999999999 ? (
                  <>
                    <p className="text-xs font-bold">
                      {slotsRemaining} slots away
                    </p>
                    <p className="text-xs">.................</p>
                    <p className="text-sm font-bold">{countdown}</p>
                  </>
                ) : (
                  <p className="text-xs font-bold">Not announced yet!</p>
                )}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 flex items-center justify-center bg-yellow-500 text-white rounded-lg font-bold shadow-lg"
              >
                PECTRA
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Refresh Timer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-sm mb-2"
          >
            Refreshes in {timer} seconds
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-sm"
          >
            * The slot, epoch, and block numbers update every 13 seconds.
          </motion.p>
        </>
      )}
    </motion.div>
  );
};

export default PectraCountdown;
