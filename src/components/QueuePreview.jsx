import { motion, AnimatePresence } from "framer-motion";
import "../styles/QueuePreview.css";

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const modal = {
  hidden:  { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2 } },
};

const READY_TILES = [2, 5, 8, 11, 15];

export default function QueuePreview({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="qp-backdrop"
        variants={backdrop}
        initial="hidden" animate="visible" exit="exit"
        onClick={onClose}
      />
      <div className="qp-portal">
        <motion.div
          className="qp-modal"
          variants={modal}
          initial="hidden" animate="visible" exit="exit"
          onClick={e => e.stopPropagation()}
        >
          <button className="qp-close" onClick={onClose}>✕</button>

          <h3 className="qp-title">How it works</h3>
          <p className="qp-sub">Two separate pages, synced in real time via Firebase.</p>

          <div className="qp-split">

            {/* ── Customer side ── */}
            <div className="qp-side">
              <div className="qp-mock qp-mock--customer">
                <div className="qp-mock-header">
                  <span className="qp-mock-logo">Event</span>
                </div>
                <div className="qp-mock-body">
                  <div className="qp-customer-card">
                    <div className="qp-customer-heading">Is my personalised notebook ready?</div>
                    <div className="qp-customer-sub">Enter the number on your ticket to check.</div>
                    <div className="qp-input-row">
                      <div className="qp-input">042</div>
                      <div className="qp-check-btn">Check →</div>
                    </div>
                    <div className="qp-result">Your personalised notebook is ready!</div>
                  </div>
                </div>
              </div>
              <div className="qp-side-label">Customer view</div>
              <p className="qp-side-desc">Customers scan a QR code at the booth, enter their ticket number, and instantly see if their item is ready to collect.</p>
            </div>

            <div className="qp-divider" />

            {/* ── Staff side ── */}
            <div className="qp-side">
              <div className="qp-mock qp-mock--studio">
                <div className="qp-mock-header qp-mock-header--light">
                  <div className="qp-studio-header-left">
                    <span className="qp-mock-logo qp-mock-logo--dark">Event Name</span>
                    <span className="qp-page-label">Staff view</span>
                  </div>
                  <div className="qp-header-stat">
                    <span className="qp-stat-num">5</span>
                    <span className="qp-stat-lbl">ready</span>
                  </div>
                </div>
                <div className="qp-mock-body">
                  <div className="qp-grid-hint">Tap a ticket to mark it ready</div>
                  <div className="qp-tile-grid">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className={`qp-tile ${READY_TILES.includes(i) ? "qp-tile--ready" : ""}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="qp-side-label">Staff view</div>
              <p className="qp-side-desc">Staff see a grid of 500 numbered tiles — one per ticket. Tap to mark ready (turns green). Tap again to undo, with a 4-second undo toast.</p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
