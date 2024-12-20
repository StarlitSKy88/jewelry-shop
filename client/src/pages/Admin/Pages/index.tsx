import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`page-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PageSection {
  id: string;
  title: string;
  content?: string;
  image?: string;
  type: 'banner' | 'section' | 'gallery';
}

const initialSections: Record<string, PageSection[]> = {
  home: [
    {
      id: '1',
      title: '主页Banner',
      image: 'https://via.placeholder.com/1920x1080',
      type: 'banner'
    },
    {
      id: '2',
      title: '品牌故事',
      content: '我们的品牌故事...',
      type: 'section'
    },
    {
      id: '3',
      title: '精选商品',
      type: 'gallery'
    }
  ],
  about: [
    {
      id: '4',
      title: '关于我们Banner',
      image: 'https://via.placeholder.com/1920x600',
      type: 'banner'
    },
    {
      id: '5',
      title: '公司简介',
      content: '公司简介内容...',
      type: 'section'
    }
  ]
};

const PageManager = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sections, setSections] = useState(initialSections);
  const [editDialog, setEditDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState<PageSection | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (section: PageSection) => {
    setCurrentSection(section);
    setEditDialog(true);
  };

  const handleSave = () => {
    if (currentSection) {
      const pageKey = tabValue === 0 ? 'home' : 'about';
      setSections(prev => ({
        ...prev,
        [pageKey]: prev[pageKey].map(section =>
          section.id === currentSection.id ? currentSection : section
        )
      }));
    }
    setEditDialog(false);
  };

  const handleDelete = (sectionId: string) => {
    const pageKey = tabValue === 0 ? 'home' : 'about';
    setSections(prev => ({
      ...prev,
      [pageKey]: prev[pageKey].filter(section => section.id !== sectionId)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        页面管理
      </Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="首页" />
          <Tab label="关于我们" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {sections.home.map((section) => (
              <Grid item xs={12} md={6} key={section.id}>
                <Card>
                  {section.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={section.image}
                      alt={section.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    {section.content && (
                      <Typography variant="body2" color="text.secondary">
                        {section.content}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(section)}
                    >
                      编辑
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(section.id)}
                    >
                      删除
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {sections.about.map((section) => (
              <Grid item xs={12} md={6} key={section.id}>
                <Card>
                  {section.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={section.image}
                      alt={section.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    {section.content && (
                      <Typography variant="body2" color="text.secondary">
                        {section.content}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(section)}
                    >
                      编辑
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(section.id)}
                    >
                      删除
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>编辑页面区块</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="标题"
              value={currentSection?.title || ''}
              onChange={(e) =>
                setCurrentSection(prev =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              sx={{ mb: 2 }}
            />
            {currentSection?.type !== 'gallery' && (
              <TextField
                fullWidth
                label="内容"
                multiline
                rows={4}
                value={currentSection?.content || ''}
                onChange={(e) =>
                  setCurrentSection(prev =>
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
                sx={{ mb: 2 }}
              />
            )}
            {(currentSection?.type === 'banner' || currentSection?.type === 'gallery') && (
              <TextField
                fullWidth
                label="图片URL"
                value={currentSection?.image || ''}
                onChange={(e) =>
                  setCurrentSection(prev =>
                    prev ? { ...prev, image: e.target.value } : null
                  )
                }
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PageManager; 