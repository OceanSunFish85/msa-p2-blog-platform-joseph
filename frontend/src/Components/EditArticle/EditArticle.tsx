import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  ListItem,
  ListItemText,
  List,
  useMediaQuery,
  Drawer,
  Fab,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { ArticleStatus } from '../../Models/enums/ArticleStatus';
import { generateSummaryThunk } from '../../store/slices/ai';
import {
  getArticleByIdThunk,
  updateArticleThunk,
} from '../../store/slices/article';
import {
  uploadArticleMediaThunk,
  uploadCoverThunk,
} from '../../store/slices/upload';
import { useAppDispatch } from '../../store/useAppDispatch';
import { useAppSelector } from '../../store/useAppSelecter';
import PreviewDialog from '../NewPost/PreviewDialog';
import EditSnackbar from './EditSnackbar';
import EditSettings from './EditSetting';

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
        .map((image, _index) => {
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
                <EditSettings
                  privacy={privacy}
                  handlePrivacyChange={handlePrivacyChange}
                  coverPreview={coverPreview}
                  handleCoverChange={handleCoverChange}
                  handleChangeCoverClick={handleChangeCoverClick}
                  handleGenerateSummary={handleGenerateSummary}
                  summary={summary}
                  setSummary={setSummary}
                  handleSubmit={handleSubmit}
                  handlePreviewOpen={handlePreviewOpen}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      <EditSnackbar
        open={snackOpen}
        message={snackMessage}
        onClose={handleSnackbarClose}
      />
      <PreviewDialog
        open={previewOpen}
        handleClose={handlePreviewClose}
        title={title}
        content={previewContent}
      />
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
            <Typography variant="h6">Catalogue</Typography>
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
            <EditSettings
              privacy={privacy}
              handlePrivacyChange={handlePrivacyChange}
              coverPreview={coverPreview}
              handleCoverChange={handleCoverChange}
              handleChangeCoverClick={handleChangeCoverClick}
              handleGenerateSummary={handleGenerateSummary}
              summary={summary}
              setSummary={setSummary}
              handleSubmit={handleSubmit}
              handlePreviewOpen={handlePreviewOpen}
            />
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default EditArticle;
