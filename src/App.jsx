import Header from "./components/Header";
import Nav from "./components/Nav";
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost"
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { useHistory, Switch, Route } from "react-router-dom";
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
  const history = useHistory();

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
      history.push('/');
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
      history.push('/');
    }catch(err){
      console.log(`Error in handleEdit ${err.message}`)
    }
  }

  const handleDelete = async (id) =>{
    try{
      const response = await api.delete (`/posts/${id}`)
      const postList= posts.filter((post)=> post.id !== id);
      setPosts(postList);
      history.push('/');
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }
  return (
    <div className="App">
      <Header title={"My React Blog Page"} />
      <Nav search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path="/">
          <Home posts={searchResults} />
        </Route>
        <Route exact path="/post">
          <NewPost 
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            postBody={postBody}
            setPostBody={setPostBody}
            setPostTitle={setPostTitle}
          />
        </Route>
        <Route exact path="/edit/:id">
          <EditPost 
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            editBody={editBody}
            setEditBody={setEditBody}
            setEditTitle={setEditTitle}
          />
        </Route>
        <Route exact path="/post/:id">
          <PostPage posts={posts} handleDelete={handleDelete}/>
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route path="*">
          <Missing />
        </Route>
      </Switch>
      <Footer />
    </div>
  )
}
export default App
