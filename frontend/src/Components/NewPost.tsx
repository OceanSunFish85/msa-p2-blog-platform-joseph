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
  Divider,
  Card,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';

const NewPost: React.FC = () => {
  const theme = useTheme();
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [privacy, setPrivacy] = useState<string>('public');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const editorRef = useRef<Quill | null>(null); // Ref to store the Quill editor instance
  const hasInitializedQuill = useRef(false); // Ref to track if Quill has been initialized
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]); // State to store headings

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

  const handlePrivacyChange = (event: SelectChangeEvent<string>) => {
    setPrivacy(event.target.value as string);
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

  const handlePreviewOpen = () => {
    if (editorRef.current) {
      setPreviewContent(editorRef.current.root.innerHTML);
      setPreviewOpen(true);
    }
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
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
        <Box
          sx={{
            position: 'fixed',
            top: '100px',
            left: '320px',
            width: '260px',
            padding: 2,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6">目录</Typography>
          <List>{renderHeadings(headings)}</List>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{ marginLeft: '220px', marginRight: '220px' }}
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="文章标题"
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
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
        </Grid>

        <Box
          sx={{
            position: 'fixed',
            top: '100px',
            right: '256px',
            width: '300px',
            padding: 2,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: 1,
            boxShadow: 3,
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
              <Button variant="contained" color="secondary">
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
        </Box>
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
    </Box>
  );
};

export default NewPost;
