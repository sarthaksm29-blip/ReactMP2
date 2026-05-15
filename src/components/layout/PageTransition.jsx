import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.1, ease: 'easeIn' } }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
