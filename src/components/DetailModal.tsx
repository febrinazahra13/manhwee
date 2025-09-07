import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Manhwa } from "../types";

interface DetailModalProps {
  item: Manhwa | null;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const [mounted, setMounted] = useState(false);

  // Hover State
  const [isHovered, setIsHovered] = useState(false);

  // Reposition State
  const [isRepositionMode, setIsRepositionMode] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [tempOffset, setTempOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Saved Offset from localStorage
  useEffect(() => {
    if (!item) return;
    const saved = localStorage.getItem(`cover-offset-${item.id}`);
    if (saved) {
      setOffsetY(parseInt(saved, 10));
      setTempOffset(parseInt(saved, 10));
    }
  }, [item]);

  if (!mounted || !item) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRepositionMode) return;
    setIsDragging(true);
    setStartY(e.clientY - tempOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isRepositionMode) return;
    const newOffset = e.clientY - startY;

    // Allow Larger Drags Area
    const maxOffset = 100;   // drag image lower
    const minOffset = -300;  // drag image higher
    setTempOffset(Math.max(minOffset, Math.min(maxOffset, newOffset)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "2px 6px",
            background: "#f8f8f8",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Cover Image */}
        <div
          style={{
            width: "100%",
            height: "250px",
            overflow: "hidden",
            borderRadius: "8px",
            marginBottom: "16px",
            position: "relative",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeaveCapture={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          <img
            src={item.cover || "https://via.placeholder.com/512?text=No+Image"}
            alt={item.title}
            draggable={false}
            style={{
              width: "100%",
              height: "auto",
              transform: `translateY(${isRepositionMode ? tempOffset : offsetY}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease",
              userSelect: "none",
              cursor: isRepositionMode
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
            }}
          />

          {/* Reposition Button (hover only) */}
          {!isRepositionMode && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 20,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <button
                onClick={() => setIsRepositionMode(true)}
                style={{
                  background: "white",
                  color: "black",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  border: "1px solid #ddd",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
              >
                Reposition
              </button>
            </div>
          )}

          {/* Save / Cancel Buttons */}
          {isRepositionMode && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 20,
                display: "flex",
                gap: "6px",
              }}
            >
              <button
                onClick={() => {
                  setOffsetY(tempOffset);
                  localStorage.setItem(
                    `cover-offset-${item.id}`,
                    String(tempOffset)
                  );
                  setIsRepositionMode(false);
                }}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempOffset(offsetY);
                  setIsRepositionMode(false);
                }}
                style={{
                  background: "#ccc",
                  color: "black",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Title & Author */}
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
          {item.title}
        </h2>
        <p style={{ color: "#555", marginBottom: "12px" }}>
          {item.author || "Unknown Author"}
        </p>

        {/* Detail Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 16px",
            fontSize: "14px",
          }}
        >
          <p><strong>Type:</strong> {item.type || "-"}</p>
          <p><strong>Genres:</strong> {item.genres?.length ? item.genres.join(", ") : "-"}</p>
          <p><strong>Status:</strong> {item.status || "Not Started"}</p>
          <p><strong>Rating:</strong> {item.rating ? "⭐".repeat(item.rating) : "-"}</p>
          <p><strong>Chapters:</strong> {item.currentChapter || 0}/{item.totalChapters || "?"}</p>
          <p>
            <strong>Link:</strong>{" "}
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {item.link}
              </a>
            ) : "-"}
          </p>
          <p><strong>Started:</strong> {item.startedAt || "-"}</p>
          <p><strong>Finished:</strong> {item.finishedAt || "-"}</p>
        </div>

        {/* Notes */}
        <div style={{ marginTop: "12px" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>Notes:</h3>
          <p style={{ whiteSpace: "pre-line", color: "#333" }}>
            {item.notes || "-"}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}