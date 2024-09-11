import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Fab, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostList from './components/PostList';
import CreatePostModal from './components/CreatePostModal';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (title: string, body: string, author: string) => {
    try {
      await backend.createPost(title, body, author);
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <PostList posts={posts} />
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setIsModalOpen(true)}
        >
          <AddIcon />
        </Fab>
        <CreatePostModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </Box>
    </Container>
  );
};

export default App;