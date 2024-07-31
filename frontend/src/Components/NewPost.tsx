import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Delta from 'quill-delta';
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
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { SelectChangeEvent } from '@mui/material/Select';
import { useAppDispatch } from '../store/useAppDispatch';
import { uploadArticleMediaThunk } from '../store/slices/upload';
import { ArticleStatus } from '../Models/enums/ArticleStatus';
import { useTheme } from '@mui/material/styles';
import { generateSummaryThunk } from '../store/slices/ai';

const NewPost: React.FC = () => {
  const theme = useTheme();
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [privacy, setPrivacy] = useState<ArticleStatus>(
    ArticleStatus.Published
  );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const editorRef = useRef<Quill | null>(null); // Ref to store the Quill editor instance
  const hasInitializedQuill = useRef(false); // Ref to track if Quill has been initialized
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]); // State to store headings
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [summary, setSummary] = React.useState('');

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
            id: `${heading.tagName}-${index}`, // Use tagName and index to ensure unique keys
            text: (heading as HTMLElement).innerText,
            level: parseInt(heading.tagName[1]), // Get the heading level from the tag name (e.g., '1' from 'H1')
          }));
          setHeadings(newHeadings);
        });

        editorRef.current = editor; // Save the editor instance to the ref
        hasInitializedQuill.current = true; // Mark as initialized
      } catch (error) {
        console.error('Error initializing Quill editor:', error);
      }
    }
  }, []);

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
          pl: heading.level * 2, // Set padding left based on heading level
          typography: `h${Math.min(6, heading.level + 2)}`, // Set typography based on heading level
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
      console.log('Text:', text);
      const result = await dispatch(generateSummaryThunk(text)).unwrap();
      setSummary(result);
      console.log('Summary:', result);
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

  const dataURLToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : ''; // 使用可选链操作符来安全地提取 MIME 类型
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
    if (editorRef.current) {
      const delta = editorRef.current.getContents();
      //console.log('Delta format:', delta);

      const images = extractImagesFromDelta(delta);
      //console.log('Extracted images:', images);

      const blobs = images
        .map((image, index) => {
          if (isValidBase64(image)) {
            //console.log(`Image ${index + 1} is a valid Base64 URL.`);
            return dataURLToBlob(image);
          } else {
            console.error(`Image ${index + 1} is not a valid Base64 URL.`);
            return null;
          }
        })
        .filter((blob) => blob !== null);

      //console.log('Converted Blobs:', blobs);

      const files = blobs.map((blob, index) =>
        blobToFile(blob, `image${index + 1}.${blob.type.split('/')[1]}`)
      );

      try {
        const mediaUrls = await dispatch(
          uploadArticleMediaThunk(files)
        ).unwrap();
        //console.log('Uploaded media URLs:', mediaUrls);

        const newDelta = replaceImagesInDelta(delta, mediaUrls.urls);
        console.log('New Delta format:', newDelta);
        editorRef.current.setContents(newDelta);
      } catch (error) {
        console.error('Failed to upload media:', error);
      }
    }
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
              <div ref={quillRef} style={{ height: '90%', width: '100%' }} />
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
                  {/* <TextField
                    fullWidth
                    label="文章标签"
                    variant="outlined"
                    margin="normal"
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
                  /> */}
                  <TextField
                    fullWidth
                    label="文章封面"
                    variant="outlined"
                    margin="normal"
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
                  <Box position="relative">
                    <TextField
                      fullWidth
                      label="文章摘要"
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
                      }}
                    >
                      <SummarizeIcon />
                    </IconButton>
                  </Box>
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
                    </Select>
                    <FormHelperText
                      sx={{ color: theme.palette.secondary.main }}
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
                      color="primary"
                      sx={{
                        typography: 'caption', // 设置较小的字体大小
                      }}
                    >
                      Save As Draft
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmit}
                      sx={{
                        typography: 'caption', // 设置较小的字体大小
                      }}
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
            </Grid>
          )}
        </Grid>
      </Container>

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
              '& .MuiDrawer-paper': { padding: 2, borderRadius: '8px 8px 0 0' },
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
              '& .MuiDrawer-paper': { padding: 2, borderRadius: '8px 8px 0 0' },
            }}
          >
            <Typography variant="h6">文章设置</Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="文章标签"
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <TextField
                fullWidth
                label="文章封面"
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <TextField
                fullWidth
                label="文章摘要"
                variant="outlined"
                multiline
                rows={4}
                margin="normal"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel
                  id="privacy-select-label"
                  style={{ color: theme.palette.text.primary }}
                >
                  隐私设置
                </InputLabel>
                <Select
                  labelId="privacy-select-label"
                  id="privacy-select"
                  value={privacy}
                  onChange={handlePrivacyChange}
                  label="隐私设置"
                  style={{ color: theme.palette.text.primary }}
                >
                  <MenuItem value="public">公开</MenuItem>
                  <MenuItem value="private">私密</MenuItem>
                </Select>
                <FormHelperText style={{ color: theme.palette.secondary.main }}>
                  选择文章的隐私设置
                </FormHelperText>
              </FormControl>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 2,
                }}
              >
                <Button variant="contained" color="primary">
                  保存草稿
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  发布文章
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handlePreviewOpen}
                >
                  预览
                </Button>
              </Box>
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default NewPost;
