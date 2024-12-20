import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import AddressForm from '../../../components/AddressForm';
import AddressList from '../../../components/AddressList';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

const AddressPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleAdd = () => {
    setSelectedAddress(null);
    setOpenForm(true);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedAddress(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4">收货地址</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            添加地址
          </Button>
        </Box>

        <AddressList onEdit={handleEdit} />

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <AddressForm
              address={selectedAddress}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AddressPage; 