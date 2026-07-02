import { motion, AnimatePresence } from "framer-motion";
import "../styles/ProjectDetail.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.28 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export default function ProjectDetail({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="detail-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <div className="detail-portal">
            <motion.div layoutId={`card-${project.id}`} className="detail-card">
              <motion.div layoutId={`card-inner-${project.id}`} className="detail-inner">

                <motion.button
                  className="detail-close"
                  onClick={onClose}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                  exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.1 } }}
                >
                  ✕
                </motion.button>

                <div className="card-header">
                  <motion.div layoutId={`card-status-${project.id}`} className="card-status">
                    {project.status}
                  </motion.div>
                  <div className="card-number">#{project.number}</div>
                </div>

                <motion.h2 layoutId={`card-title-${project.id}`} className="detail-title">
                  {project.title}
                </motion.h2>

                {/* Description — directly after title */}
                <motion.div
                  custom={0}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <p className="detail-description">{project.description}</p>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {project.link && project.link !== "#" ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      Visit project →
                    </a>
                  ) : (
                    <span className="detail-link detail-link--soon">Link coming soon</span>
                  )}
                </motion.div>

                {/* Tags — bottom */}
                <motion.div
                  custom={2}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="card-tags detail-tags"
                >
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </motion.div>

              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
