import Layout from "./Layout";
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost"
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";

import Home from "./components/Home";
import { useNavigate, Routes , Route } from "react-router-dom";
import { useState, useEffect } from "react";
import {format} from 'date-fns';
import api from './api/posts';

function App(){
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [postTitle ,setPostTitle] =useState('');
  const [postBody ,setPostBody] =useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchPosts= async()=>{
      try{
        const response= await api.get('/posts');
        if(response.data) setPosts(response.data)
      } catch (err){
        if(response){
          // Not in 200 reponse range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else{
          console.log(`Error: ${err.message}`)
        }
      }
    }

    fetchPosts();
  },[])

  useEffect(()=>{
    const filteredPosts= posts.filter((post)=>
        ((post.body).toLowerCase()).includes(search.toLowerCase())
        || (((post.title).toLowerCase()).includes(search.toLowerCase()))
      );
    
    setSearchResults(filteredPosts);

  }, [posts,search])

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const id= posts.length ? (posts[posts.length-1].id +1) : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = {id, title:postTitle, datetime, body:postBody};

    try{
      const response = await api.post('/posts',newPost)
      setPosts([...posts, response.data]);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleEdit = async (id) =>{
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const editedPost = {id, title: editTitle, datetime, body: editBody};
    try{
      const response = await api.put(`/posts/${id}`,editedPost)
      setPosts(posts.map(post => post.id === id ? {...response.data} : {posts}))
      setEditTitle('');
      setEditBody('');
      navigate('/');
    }catch(err){
      console.log(`Error in handleEdit ${err.message}`)
    }
  }

  const handleDelete = async (id) =>{
    try{
      const response = await api.delete (`/posts/${id}`)
      const postList= posts.filter((post)=> post.id !== id);
      setPosts(postList);
      navigate('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }
  return (
    
    <Routes>
      <Route path="/" element={<Layout
        search={search}
        setSearch={setSearch}
      />}>
        <Route index element={<Home posts={searchResults} />}/>
        <Route  path="post">
          <Route index element = {<NewPost 
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            postBody={postBody}
            setPostBody={setPostBody}
            setPostTitle={setPostTitle}
          />} />
          <Route path="post/:id" element={<PostPage 
            posts={posts} 
            handleDelete={handleDelete}
          />} />
        
        </Route>
        <Route path="/edit/:id" element={<EditPost 
          posts={posts}
          handleEdit={handleEdit}
          editTitle={editTitle}
          editBody={editBody}
          setEditBody={setEditBody}
          setEditTitle={setEditTitle}
        />} />
        
        <Route path="about" element={<About />} />
        
        <Route path="*" element={<Missing />} /> 
      </Route>
    </Routes>
  )
}
export default App
