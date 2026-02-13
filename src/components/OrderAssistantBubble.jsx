import React, { useState } from 'react';
import OrderAssistantPanel from './OrderAssistantPanel';

/**
 * Burbuja flotante del asistente de órdenes
 */
export default function OrderAssistantBubble({ onOrderCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNotifications(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleOrderCreated(order) {
    onOrderCreated && onOrderCreated(order);
    setIsOpen(false);
  }

  return (
    <div className="order-assistant-bubble">
      {!isOpen && (
        <button
          className="assistant-trigger"
          onClick={handleToggle}
          title="Asistente de Órdenes"
        >
          <span className="assistant-icon">🤖</span>
          {hasNotifications && <span className="notification-badge">!</span>}
        </button>
      )}

      {isOpen && (
        <div className="assistant-window">
          <div className="assistant-window-header">
            <h3>🤖 Asistente de Órdenes</h3>
            <button className="close-btn" onClick={handleClose}>
              ✖️
            </button>
          </div>

          <div className="assistant-window-body">
            <OrderAssistantPanel
              onOrderCreated={handleOrderCreated}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
