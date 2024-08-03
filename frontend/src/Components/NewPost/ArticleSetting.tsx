import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { ArticleStatus } from '../../Models/enums/ArticleStatus';

interface ArticleSettingsProps {
  coverPreview: string | null;
  handleChangeCoverClick: () => void;
  handleCoverChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  summary: string;
  setSummary: (summary: string) => void;
  handleGenerateSummary: () => void;
  privacy: ArticleStatus;
  handlePrivacyChange: (event: SelectChangeEvent<ArticleStatus>) => void;
  handleSubmit: () => void;
  handlePreviewOpen: () => void;
  disableSubmit: boolean;
}

const ArticleSettings: React.FC<ArticleSettingsProps> = ({
  coverPreview,
  handleChangeCoverClick,
  handleCoverChange,
  summary,
  setSummary,
  handleGenerateSummary,
  privacy,
  handlePrivacyChange,
  handleSubmit,
  handlePreviewOpen,
  disableSubmit,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '100px',
        padding: 2,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6">Article Settings</Typography>
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
                color: theme.palette.text.primary,
                '&.Mui-focused': {
                  color: theme.palette.secondary.main,
                },
              },
            }}
            InputProps={{
              sx: {
                color: theme.palette.text.primary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.text.secondary,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
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
              color: theme.palette.secondary.main,
            }}
          >
            <SummarizeIcon />
          </IconButton>
        </Box>
        <FormHelperText
          sx={{
            color: theme.palette.secondary.main,
            textAlign: 'right',
          }}
        >
          Click on the icon to use the AI summary
        </FormHelperText>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel
            id="privacy-select-label"
            sx={{
              color: theme.palette.text.primary,
              '&.Mui-focused': {
                color: theme.palette.secondary.main,
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
              color: theme.palette.text.primary,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.secondary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
              },
              '& .MuiSelect-select': {
                backgroundColor: theme.palette.background.default,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.palette.background.default,
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      color: theme.palette.background.default,
                      backgroundColor: theme.palette.secondary.main,
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
              color: theme.palette.secondary.main,
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
              typography: 'caption', // 设置较小的字体大小
            }}
            disabled={disableSubmit}
          >
            Publish
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handlePreviewOpen}
            sx={{
              typography: 'caption', // 设置较小的字体大小
            }}
          >
            Preview
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ArticleSettings;
