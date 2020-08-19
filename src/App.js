import React, {useState, useEffect} from 'react';
import {Form, Button, Container, Col, Row, ListGroup, Image, Modal} from 'react-bootstrap'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  var [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://reqres.in/api/users',
      );
        
      setData(result.data.data);
      console.log(result.data.data);
    };

    fetchData();
  }, []);

  const [show, setShow] = useState(false);
  var [editItem, setEditItem] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //_________________________________________Insert_________________________________________
  const [profile, setProfile] = useState(
    {email: '', first_name: '', last_name: '', avatar: 'https://i0.wp.com/www.mvhsoracle.com/wp-content/uploads/2018/08/default-avatar.jpg?ssl=1'}
  );

  const handleChange = (event) => {
    setProfile({...profile, [event.target.name]: event.target.value})
  } 

  const handleSubmit = (e) => {
    e.preventDefault()
    var emailList = [];
    for (let element of data){
      emailList.push(element.email);
    }
    console.log(emailList);
    if (emailList.indexOf(profile.email) != -1){
      alert('Email address existed!')
      return;
    }
    axios.post('https://reqres.in/api/users', profile)
      .then(function (response) {
          console.log(response)
          //profileList.push(profile);
          //console.log(data);
          setData(data.concat(profile));
          data = data.concat(profile);
          console.log(data);
      })
      .catch(function (error) {
          console.log(error)
      }) 
  }

  //_________________________________________Edit_________________________________________
  const [editProfile, setEditProfile] = useState(
    {email: '', first_name: '', last_name: '', avatar: ''}
  );

  const handleEditChange = (event) => {
    setEditProfile({...editProfile, [event.target.name]: event.target.value})
  } 

  const handleEditSubmit = (e) => {
    e.preventDefault()
    var emailList = [];
    for (let element of data){
      emailList.push(element.email);
    }
    console.log(editProfile);
    axios.put('https://reqres.in/api/users', editProfile)
      .then(function (response) {
          console.log(response)
          //profileList.push(profile);
          console.log(editItem);
          // setData(data.concat(profile));
          // data = data.concat(profile);
          console.log(editProfile.email);
          
          data[emailList.indexOf(editItem.email)].first_name = editProfile.first_name;
          data[emailList.indexOf(editItem.email)].last_name = editProfile.last_name;
          data[emailList.indexOf(editItem.email)].avatar = editProfile.avatar;
          data[emailList.indexOf(editItem.email)].email = editProfile.email;
          
          setData(data);
          console.log(data);
          handleClose();
      })
      .catch(function (error) {
          console.log(error)
      }) 
  }

  const handleUpdate = (item) => {
    handleShow();
    setEditItem(item);
    setEditProfile(item);
  }

  const editModalRender = (item) => {
    if (item)
    return ( 
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formEdit" onSubmit={handleEditSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name </Form.Label>
              <Form.Control type="text" name="first_name" placeholder={item.first_name} defaultValue={item.first_name} onChange={handleEditChange} required />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" placeholder={item.last_name}  defaultValue={item.last_name}  onChange={handleEditChange} required/>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder={item.email}  defaultValue={item.email} onChange={handleEditChange} required />
            </Form.Group>

            <Form.Group controlId="formAvatarURL">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control type="text" name="avatar" placeholder={item.avatar}  defaultValue={item.avatar} onChange={handleEditChange} />
            </Form.Group>
          </Form>   
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
 
    )
  }

  //_________________________________________Delete_________________________________________
  const handleDelete = (item) => {
    var emailList = [];
    for (let element of data){
      emailList.push(element.email);
    }
    axios.delete('https://reqres.in/api/users', profile.email)
      .then(res => {
        setData(data.filter(element => element.email != item.email));
        //data = data.splice(emailList.indexOf(item.email), 1);
        console.log(data);
      })
      .catch(function (error) {
          console.log(error)
      }) 
  }

  const profileRender = (data) => {
    if (data)
    return ( <div className="profile">
      {data && data.map(item => (
        <Container class='container'>
            <Image className='profileimg' src={item.avatar} alt='Profile Picture'/>
            <Button className='btnEdit' onClick={() => handleUpdate(item)}> Edit</Button>
            <Button className='btnDel' onClick={() => handleDelete(item)}> Delete</Button>
            <ListGroup>
              <ListGroup.Item><b>Name:</b> {item.first_name + ' ' + item.last_name}</ListGroup.Item>
              <ListGroup.Item><b>Email Address:</b> {item.email}</ListGroup.Item>
            </ListGroup>
        </Container>      
      ))}
    </div>
    )
  }

  return (
    <div>
      <div className="App">
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name </Form.Label>
            <Form.Control type="text" name="first_name" placeholder="Enter your first name" onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="last_name" placeholder="Enter your last name" onChange={handleChange} required/>
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter your email address" onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="formAvatarURL">
            <Form.Label>Avatar URL</Form.Label>
            <Form.Control type="text" name="avatar" placeholder="Enter your avatar URL (default if blank)" onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>  
        {editModalRender(editItem)} 
    </div>
    {profileRender(data)}
  </div>
  );
}

export default App;