import Header from "./components/Header";
import Nav from "./components/Nav";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { useHistory, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import {format} from 'date-fns';

function App(){
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "My First Post",
      datetime: "July 16, 2021 11:47:39 AM",
      body: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem architecto et iusto sit commodi doloribus consequatur quibusdam consequuntur quia illo quos ut sequi quidem, aliquid quisquam dolorem temporibus at culpa?Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores optio amet aperiam sed! Excepturi mollitia a voluptatibus repellendus ab consequuntur."
    },
    {
      id: 2,
      title: "My Second Post",
      datetime: "July 16, 2021 11:47:39 AM",
      body: "Lorem icing elit. Autem architecto et iusto sit commodi doloribus consequatur quibusdam consequuntur quia illo quos ut sequi quidem, aliquid quisquam dolorem temporibus at culpa? amet ame kaavab banilie ssd porhre saac arrvzfaln sdioor nsz lsi elib bako le jis dsconsectetur adipisicing elit. Maiores optio amet aperiam sed! Excepturi mollitia a voluptatibus repellendus ab consequuntur."
    },
    {
      id: 3,
      title: "My Third Post",
      datetime: "July 16, 2021 11:47:39 AM",
      body: "Lorem ips adipisicing elit. sed! Excepturi mollitia a voluptatibus repellendus ab consequuntur."
    }
  ]);
  const [search, setSearch] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [postTitle ,setPostTitle] =useState('');
  const [postBody ,setPostBody] =useState('');

  const history = useHistory();
  useEffect(()=>{
    const filteredPosts= posts.filter(post=>
        ((post.body).toLowerCase()).includes(search.toLowerCase())
        || (((post.title).toLowerCase()).includes(search.toLowerCase()))
      );
    
    setSearchResults(filteredPosts);

  }, [posts,search])

  const handleSubmit= (e)=>{
    e.preventDefault();
    const id= posts.lenght ? (posts[posts.length-1].id +1) : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = {id,title:postTitle,datetime, body:postBody};
    setPosts([...posts, newPost]);
    setPostTitle('');
    setPostBody('');
    history.push('/');
  }

  const handleDelete = (id) =>{
    const postList= posts.filter((post)=> post.id !== id);
    setPosts(postList);
    history.push('/');
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
