import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';

import { SelectChangeEvent } from '@mui/material/Select';
import { ArticleStatus } from '../../Models/enums/ArticleStatus';

interface EditSettingsProps {
  privacy: ArticleStatus;
  handlePrivacyChange: (event: SelectChangeEvent<ArticleStatus>) => void;
  coverPreview: string | null;
  handleCoverChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeCoverClick: () => void;
  handleGenerateSummary: () => void;
  summary: string;
  setSummary: (value: string) => void;
  handleSubmit: () => void;
  handlePreviewOpen: () => void;
}

const EditSettings: React.FC<EditSettingsProps> = ({
  privacy,
  handlePrivacyChange,
  coverPreview,
  handleCoverChange,
  handleChangeCoverClick,
  handleGenerateSummary,
  summary,
  setSummary,
  handleSubmit,
  handlePreviewOpen,
}) => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Box
        onClick={handleChangeCoverClick}
        sx={{
          border: '2px dashed',
          borderColor: 'secondary.main',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          '&:hover #upload-button-label': {
            display: 'block',
          },
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-button"
          onChange={handleCoverChange}
        />
        <label
          htmlFor="upload-button"
          id="upload-button-label"
          style={{
            display: 'none',
            position: 'absolute',
            zIndex: 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Button variant="contained" component="span">
            {coverPreview ? 'Change Cover' : 'Upload Cover'}
          </Button>
        </label>
        {coverPreview ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
            }}
          >
            <img
              src={coverPreview}
              alt="Cover Preview"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary">
            Upload Cover
          </Typography>
        )}
      </Box>
      <Box position="relative">
        <TextField
          fullWidth
          label="Summary"
          variant="outlined"
          multiline
          rows={4}
          margin="normal"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          InputLabelProps={{
            sx: {
              color: 'text.primary',
              '&.Mui-focused': {
                color: 'secondary.main',
              },
            },
          }}
          InputProps={{
            sx: {
              color: 'text.primary',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'text.secondary',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'secondary.main',
              },
            },
          }}
        />
        <IconButton
          onClick={handleGenerateSummary}
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            color: 'secondary.main',
          }}
        >
          <SummarizeIcon />
        </IconButton>
      </Box>
      <FormHelperText
        sx={{
          color: 'secondary.main',
          textAlign: 'right',
        }}
      >
        Click on the icon to use the AI summary
      </FormHelperText>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel
          id="privacy-select-label"
          sx={{
            color: 'text.primary',
            '&.Mui-focused': {
              color: 'secondary.main',
            },
          }}
        >
          Privacy Settings
        </InputLabel>
        <Select
          labelId="privacy-select-label"
          id="privacy-select"
          value={privacy}
          onChange={handlePrivacyChange}
          label="Privacy Settings"
          sx={{
            color: 'text.primary',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'text.secondary',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'secondary.main',
            },
            '& .MuiSelect-select': {
              backgroundColor: 'background.default',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'background.default',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    color: 'background.default',
                    backgroundColor: 'secondary.main',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value={ArticleStatus.Published}>Published</MenuItem>
          <MenuItem value={ArticleStatus.Archived}>Private</MenuItem>
          <MenuItem value={ArticleStatus.Draft}>Draft</MenuItem>
        </Select>
        <FormHelperText
          sx={{
            color: 'secondary.main',
            textAlign: 'right',
          }}
        >
          Article Privacy Selection
        </FormHelperText>
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          sx={{
            typography: 'caption',
          }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={handlePreviewOpen}
          sx={{
            typography: 'caption',
          }}
        >
          Preview
        </Button>
      </Box>
    </Box>
  );
};

export default EditSettings;
