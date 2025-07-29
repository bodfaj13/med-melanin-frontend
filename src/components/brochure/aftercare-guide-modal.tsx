import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';
import BrochureSections from './brochure-sections';

interface AftercareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTabIndex?: number;
}

const AftercareGuideModal: React.FC<AftercareGuideModalProps> = ({
  isOpen,
  onClose,
  initialTabIndex = 0,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl' scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent maxW='90vw' h='90vh' mx='auto'>
        <ModalHeader>Interactive Aftercare Guide</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Box h='full' overflow='auto'>
            <BrochureSections initialTabIndex={initialTabIndex} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AftercareGuideModal;
