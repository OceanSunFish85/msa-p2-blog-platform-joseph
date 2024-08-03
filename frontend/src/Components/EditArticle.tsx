import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemText,
  List,
  useMediaQuery,
  Drawer,
  Fab,
  IconButton,
  InputAdornment,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { SelectChangeEvent } from '@mui/material/Select';

import {
  getArticleByIdThunk,
  updateArticleThunk,
} from '../store/slices/article';
import {
  uploadArticleMediaThunk,
  uploadCoverThunk,
} from '../store/slices/upload';
import { ArticleStatus } from '../Models/enums/ArticleStatus';
import { useTheme } from '@mui/material/styles';
import { generateSummaryThunk } from '../store/slices/ai';
import { useAppSelector } from '../store/useAppSelecter';
import { useAppDispatch } from '../store/useAppDispatch';

const EditArticle: React.FC = () => {
  const theme = useTheme();
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [privacy, setPrivacy] = useState<ArticleStatus>(
    ArticleStatus.Published
  );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const editorRef = useRef<Quill | null>(null);
  const hasInitializedQuill = useRef(false);
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const [error, setError] = useState('');
  const selectedArticleId = localStorage.getItem('selectedArticleId');

  const articleDetail = useAppSelector((state: any) => state.article.detail);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    if (selectedArticleId) {
      dispatch(getArticleByIdThunk(Number(selectedArticleId)));
    }
  }, [dispatch, selectedArticleId]);

  useEffect(() => {
    if (quillRef.current && !hasInitializedQuill.current) {
      try {
        const editor = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ font: [] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ align: [] }],
              ['link', 'image', 'video'],
              ['clean'],
            ],
          },
        });

        editor.on('text-change', () => {
          const content = editor.root.innerHTML;
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const newHeadings = Array.from(
            doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
          ).map((heading, index) => ({
            id: `${heading.tagName}-${index}`,
            text: (heading as HTMLElement).innerText,
            level: parseInt(heading.tagName[1]),
          }));
          setHeadings(newHeadings);
        });

        editorRef.current = editor;
        hasInitializedQuill.current = true;
      } catch (error) {
        console.error('Error initializing Quill editor:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (articleDetail && editorRef.current) {
      setTitle(articleDetail.title);
      setSummary(articleDetail.summary);
      setCoverPreview(articleDetail.cover);
      setPrivacy(articleDetail.status);
      editorRef.current.clipboard.dangerouslyPasteHTML(
        articleDetail.htmlContent
      );
    }
  }, [articleDetail]);

  const handlePrivacyChange = (event: SelectChangeEvent<ArticleStatus>) => {
    setPrivacy(event.target.value as ArticleStatus);
  };

  const handleHeadingClick = (id: string) => {
    const editor = editorRef.current;
    if (editor) {
      const element = editor.root.querySelector(`#${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderHeadings = (
    headings: Array<{ id: string; text: string; level: number }>
  ) => {
    return headings.map((heading) => (
      <ListItem
        button
        key={heading.id}
        onClick={() => handleHeadingClick(heading.id)}
        sx={{
          pl: heading.level * 2,
          typography: `h${Math.min(6, heading.level + 2)}`,
        }}
      >
        <ListItemText primary={heading.text} />
      </ListItem>
    ));
  };

  const handleGenerateSummary = async () => {
    if (editorRef.current) {
      const delta = editorRef.current.getContents();
      const text = delta.reduce((acc: string, op: any) => {
        if (typeof op.insert === 'string') {
          return (
            acc + op.insert.replace(/[\r\n]+/g, ' ').replace(/[^\w\s,\.]/gi, '')
          );
        }
        return acc;
      }, '');
      const result = await dispatch(generateSummaryThunk(text)).unwrap();
      setSummary(result);
    }
  };

  const handlePreviewOpen = () => {
    if (editorRef.current) {
      setPreviewContent(editorRef.current.root.innerHTML);
      setPreviewOpen(true);
    }
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 2MB');
      return;
    }

    if (file) {
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeCoverClick = () => {
    const inputElement = document.getElementById(
      'upload-button'
    ) as HTMLInputElement;
    inputElement.click();
  };

  const dataURLToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const extractImagesFromDelta = (delta: any) => {
    const images: string[] = [];
    delta.ops.forEach((op: any) => {
      if (op.insert && op.insert.image) {
        images.push(op.insert.image);
      }
    });
    return images;
  };

  const isValidBase64 = (dataURL: string): boolean => {
    const regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return regex.test(dataURL);
  };

  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
  };

  const replaceImagesInDelta = (delta: any, mediaUrls: string[]): any => {
    const newDelta = JSON.parse(JSON.stringify(delta));
    let imageIndex = 0;

    newDelta.ops.forEach((op: any) => {
      if (op.insert && op.insert.image) {
        if (isValidBase64(op.insert.image) && imageIndex < mediaUrls.length) {
          op.insert.image = mediaUrls[imageIndex++];
        }
      }
    });

    return newDelta;
  };

  const handleSubmit = async () => {
    if (editorRef.current && selectedArticleId) {
      const delta = editorRef.current.getContents();

      const images = extractImagesFromDelta(delta);
      const blobs = images
        .map((image, index) => {
          if (isValidBase64(image)) {
            return dataURLToBlob(image);
          } else {
            return null;
          }
        })
        .filter((blob) => blob !== null);

      const files = blobs.map((blob, index) =>
        blobToFile(blob, `image${index + 1}.${blob.type.split('/')[1]}`)
      );

      try {
        const mediaUrls = await dispatch(
          uploadArticleMediaThunk(files)
        ).unwrap();
        const newDelta = replaceImagesInDelta(delta, mediaUrls.urls);
        editorRef.current.setContents(newDelta);

        const quill = new Quill(document.createElement('div'));
        quill.setContents(newDelta);
        const htmlContent = quill.root.innerHTML;

        const coverUrl = cover
          ? await dispatch(uploadCoverThunk(cover)).unwrap()
          : coverPreview;

        const updateArticleRequest = {
          Title: title,
          Summary: summary,
          Cover: coverUrl,
          Status: privacy,
          HtmlContent: htmlContent,
        };

        await dispatch(
          updateArticleThunk({
            id: Number(selectedArticleId),
            data: updateArticleRequest,
          })
        );
        setSnackMessage('Article updated successfully!');
        setSnackOpen(true);
        //alert('Article updated successfully!');
      } catch (error) {
        console.error('Failed to update article:', error);
        alert('Failed to update article');
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexGrow: 1,
          marginTop: '80px',
          marginBottom: '64px',
          position: 'relative',
        }}
      >
        <Grid container spacing={2}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
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
                <Typography variant="h6">Table of Content</Typography>
                <List>{renderHeadings(headings)}</List>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              required
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                height: '80vh',
                overflow: 'auto',
              }}
            >
              <div
                ref={quillRef}
                style={{ height: isMobile ? '70%' : '90%', width: '100%' }}
              />
            </Box>
          </Grid>

          {!isMobile && (
            <Grid item xs={12} md={3}>
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
                <Typography variant="h6">Article Setting</Typography>
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
                      <MenuItem value={ArticleStatus.Published}>
                        Published
                      </MenuItem>
                      <MenuItem value={ArticleStatus.Archived}>
                        Private
                      </MenuItem>
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
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 8,
          bgcolor: theme.palette.secondary.main,
          opacity: 0.9,
          borderRadius: 1,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            opacity: 0.9,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 1,
            color: theme.palette.background.default,
            '& .MuiAlert-icon': {
              color: theme.palette.background.default, // 自定义图标颜色
            },
          }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.background.default }}>
          文章预览
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <div className="ql-container ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Button onClick={handlePreviewClose} color="secondary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      {isMobile && (
        <>
          <Fab
            color="secondary"
            aria-label="toc"
            sx={{ position: 'fixed', bottom: 80, right: 16 }}
            onClick={() => setTocOpen(true)}
          >
            <MenuBookIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="settings"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon />
          </Fab>
          <Drawer
            anchor="bottom"
            open={tocOpen}
            onClose={() => setTocOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                padding: 2,
                borderRadius: '8px 8px 0 0',
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            <Typography variant="h6">目录</Typography>
            <List>{renderHeadings(headings)}</List>
          </Drawer>
          <Drawer
            anchor="bottom"
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                padding: 2,
                borderRadius: '8px 8px 0 0',
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            <Typography variant="h6">Article Setting</Typography>
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
          </Drawer>
          <Snackbar
            open={snackOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 8,
              bgcolor: theme.palette.secondary.main,
              opacity: 0.9,
              borderRadius: 1,
            }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{
                width: '100%',
                opacity: 0.9,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 1,
                color: theme.palette.background.default,
                '& .MuiAlert-icon': {
                  color: theme.palette.background.default, // 自定义图标颜色
                },
              }}
            >
              {snackMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default EditArticle;
