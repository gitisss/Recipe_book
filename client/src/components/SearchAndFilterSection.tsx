// client/src/components/SearchAndFilterSection.tsx
import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Chip,
  Button,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchAndFilterSection: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>חיפוש וסינון</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="חפש מתכונים..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <Button variant="text" startIcon={<FilterListIcon />}>
          סנן (Placeholder)
        </Button>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="קטגוריה 1 (Placeholder)" onClick={() => {}} />
        <Chip label="קטגוריה 2 (Placeholder)" onClick={() => {}} />
        <Chip label="מועדפים (Placeholder)" variant="outlined" onClick={() => {}} />
      </Box>
    </Paper>
  );
};

export default SearchAndFilterSection;