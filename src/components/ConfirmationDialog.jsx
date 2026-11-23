import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function ConfirmationDialog({ open, title, message, confirmLabel = 'Yes', cancelLabel = 'Not yet', onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-title" hideClose className="confirm">
      <h2 id="confirm-title" className="confirm__title">{title}</h2>
      {message && <p className="confirm__message">{message}</p>}
      <div className="confirm__actions">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant="gold" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
