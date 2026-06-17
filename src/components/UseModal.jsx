
import { useState } from 'react';

const useModal = () => {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSize, setModalSize] = useState('xl');
  const [modalClass, setModalClass] = useState('');

  // Function to toggle modal visibility with title, content, size, and custom class
  const toggleModal = (title, content, size = 'xl',
    customClass = '') => {
    setModalTitle(title);
    setModalContent(content);
    setModalSize(size);
    setModalClass(customClass);

    setModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModal(false);
    setPatientDetails(null);
  };

  return {
    modal, modalContent, modalTitle,
    modalSize, modalClass, toggleModal, closeModal,
  };
};

export default useModal;
