import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
  Box,
  Container,
  Grid,
  TextField,
  useMediaQuery,
  Drawer,
  Fab,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';

import PreviewDialog from './PreviewDialog';
import { ArticleStatus } from '../../Models/enums/ArticleStatus';
import { generateSummaryThunk } from '../../store/slices/ai';
import { createNewArticle } from '../../store/slices/article';
import {
  uploadArticleMediaThunk,
  uploadCoverThunk,
} from '../../store/slices/upload';
import { useAppDispatch } from '../../store/useAppDispatch';
import ArticleSettings from './ArticleSetting';
import TableOfContent from './TableofContent';
import { useNavigate } from 'react-router-dom';

const NewPost: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Quill | null>(null);
  const [privacy, setPrivacy] = useState<ArticleStatus>(
    ArticleStatus.Published
  );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [summary, setSummary] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const [isContentEmpty, setIsContentEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
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
          handleTextChange(content);
          setIsContentEmpty(editor.getText().trim().length === 0);
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Error initializing Quill editor:', error);
      }
    }
  }, []);

  const handleTextChange = (content: string) => {
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
    setPreviewContent(content);
  };

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
    setPreviewOpen(true);
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
      setCover(file); // Save the file temporarily
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

  const handleSubmit = async () => {
    if (editorRef.current) {
      const delta = editorRef.current.getContents();

      const images = extractImagesFromDelta(delta);
      const blobs = images
        .map((image, index) => {
          if (isValidBase64(image)) {
            return dataURLToBlob(image);
          } else {
            console.error(`Image ${index + 1} is not a valid Base64 URL.`);
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

        const coverUrl = await dispatch(uploadCoverThunk(cover)).unwrap();

        const newArticleRequest = {
          title: title,
          summary: summary,
          cover: coverUrl,
          status: privacy,
          htmlContent: htmlContent,
        };

        const newArticleId = await dispatch(
          createNewArticle(newArticleRequest)
        ).unwrap();
        console.log('New article ID:', newArticleId);
        navigate('/account');
      } catch (error) {
        console.error('Failed to upload media:', error);
      }
    }
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
              <TableOfContent
                headings={headings}
                handleHeadingClick={handleHeadingClick}
              />
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
              <ArticleSettings
                coverPreview={coverPreview}
                handleChangeCoverClick={handleChangeCoverClick}
                handleCoverChange={handleCoverChange}
                summary={summary}
                setSummary={setSummary}
                handleGenerateSummary={handleGenerateSummary}
                privacy={privacy}
                handlePrivacyChange={handlePrivacyChange}
                handleSubmit={handleSubmit}
                handlePreviewOpen={handlePreviewOpen}
                disableSubmit={!title.trim() || isContentEmpty || !cover}
              />
            </Grid>
          )}
        </Grid>
      </Container>

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
            <TableOfContent
              headings={headings}
              handleHeadingClick={handleHeadingClick}
            />
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
            <ArticleSettings
              coverPreview={coverPreview}
              handleChangeCoverClick={handleChangeCoverClick}
              handleCoverChange={handleCoverChange}
              summary={summary}
              setSummary={setSummary}
              handleGenerateSummary={handleGenerateSummary}
              privacy={privacy}
              handlePrivacyChange={handlePrivacyChange}
              handleSubmit={handleSubmit}
              handlePreviewOpen={handlePreviewOpen}
              disableSubmit={!title.trim() || isContentEmpty || !cover}
            />
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default NewPost;
