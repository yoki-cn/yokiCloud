import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";

import type { CollectedImage } from "../../data/collected";
import { fastFade } from "../../motion/presets";
import Panel from "../ui/Panel";

export type ImagePreviewModalProps = {
  image: CollectedImage | null;
  onClose: () => void;
};

export default function ImagePreviewModal({ image, onClose }: ImagePreviewModalProps) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div className="fixed inset-0 z-50" initial="hidden" animate="show" exit="hidden" variants={fastFade}>
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <div className="absolute inset-0 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Panel
                className="border-white/20"
                label="IMAGE VIEW / 图像预览"
                sublabel={`${image.id.toUpperCase()} / OPEN`}
                icon={LayoutGrid}
                right={
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 text-white/70" />
                  </button>
                }
              >
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/20">
                  <div className="scanline" />
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full max-h-[78vh] object-contain block"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Panel>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
