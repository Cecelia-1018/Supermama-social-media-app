// import {AddForumImage} from './AddForumImage'; 
// import {ImageOrVideo} from 'react-native-image-crop-picker';

// // * Step 2 : Write a image change
// const onImageChange1 = (image: ImageOrVideo) => {
//     console.log(image);
  
//     const user = firebase.auth().currentUser;
  
//     if(user){
//       const d = new Date();
//       var hours = d.getHours(); //To get the Current Hours
//       var min = d.getMinutes(); //To get the Current Minutes
//     let Id = "Img1F" + hours + min ;
  
//     //* step 2 a : upload image to storage
//     let reference = storage().ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id); //2
//     let task = reference.putFile(image.path.toString());
  
//     task
//       .then(() => {
//         console.log('Image uploaded to the bucket!');
//       })
//       .catch(e => console.log('uploading image error =>', e));
//     }
//   };
  
//   const onImageChange2 = (image: ImageOrVideo) => {
//     console.log(image);
  
//     const user = firebase.auth().currentUser;
  
//     if(user){
//       const d = new Date();
//       var hours = d.getHours(); //To get the Current Hours
//       var min = d.getMinutes(); //To get the Current Minutes
//     let Id = "Img2F" + hours + min ;
  
//     //* step 2 a : upload image to storage
//     let reference = storage().ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id); //2
//     let task = reference.putFile(image.path.toString());
  
//     task
//       .then(() => {
//         console.log('Image uploaded to the bucket!');
//       })
//       .catch(e => console.log('uploading image error =>', e));
//     }
//   };
  
//   const onImageChange3 = (image: ImageOrVideo) => {
//     console.log(image);
  
//     const user = firebase.auth().currentUser;
  
//     if(user){
//       const d = new Date();
//       var hours = d.getHours(); //To get the Current Hours
//       var min = d.getMinutes(); //To get the Current Minutes
//     let Id = "Img3F" + hours + min ;
  
//     //* step 2 a : upload image to storage
//     let reference = storage().ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id); //2
//     let task = reference.putFile(image.path.toString());
  
//     task
//       .then(() => {
//         console.log('Image uploaded to the bucket!');
//       })
//       .catch(e => console.log('uploading image error =>', e));
//     }
//   };

// // // * step 3 declare picture url for displaying (rmb import useState at top)
//   // const [imageUrlForum1, setImageUrlForum1] = useState('https://cdn-icons.flaticon.com/png/512/4211/premium/4211763.png?token=exp=1648220654~hmac=ebf191b8963f08df9a5eb075c7a66adc');
//   // const [imageUrlForum2, setImageUrlForum2] = useState('https://cdn-icons.flaticon.com/png/512/4211/premium/4211763.png?token=exp=1648220654~hmac=ebf191b8963f08df9a5eb075c7a66adc');
//   // const [imageUrlForum3, setImageUrlForum3] = useState('https://cdn-icons.flaticon.com/png/512/4211/premium/4211763.png?token=exp=1648220654~hmac=ebf191b8963f08df9a5eb075c7a66adc');
//   // * step 3 declare picture url for displaying (rmb import useState at top)
//   const [imageUrlForum1, setImageUrlForum1] = useState(undefined);
//   const [imageUrlForum2, setImageUrlForum2] = useState(undefined);
//   const [imageUrlForum3, setImageUrlForum3] = useState(undefined);

//   useEffect(() => {
//     if(user){
//       const d = new Date();
//     var hours = d.getHours(); //To get the Current Hours
//     var min = d.getMinutes(); //To get the Current Minutes
//   let Id = "Img1F" + hours + min ;


//     storage()
//       .ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id) //name in storage in firebase console
//       .getDownloadURL()
//       .then((url) => {
//         setImageUrlForum1(url);
//       })
//       .catch((e) => console.log('Errors while downloading => ', e));
//     }


//   }, []);

//   useEffect(() => {
//     if(user){
//       const d = new Date();
//       var hours = d.getHours(); //To get the Current Hours
//       var min = d.getMinutes(); //To get the Current Minutes
//     let Id = "Img2F" + hours + min ;
  
//     storage()
//       .ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id) //name in storage in firebase console
//       .getDownloadURL()
//       .then((url) => {
//         setImageUrlForum2(url);
//       })
//       .catch((e) => console.log('Errors while downloading => ', e));
//     }


//   }, []);

//   useEffect(() => {
//     if(user){
//       const d = new Date();
//     var hours = d.getHours(); //To get the Current Hours
//     var min = d.getMinutes(); //To get the Current Minutes
//   let Id = "Img3F" + hours + min ;

//     storage()
//       .ref('gs://supermama-6aa87.appspot.com/Forum/'+user.uid +'/' + Id) //name in storage in firebase console
//       .getDownloadURL()
//       .then((url) => {
//         setImageUrlForum3(url);
//       })
//       .catch((e) => console.log('Errors while downloading => ', e));
//     }


//   }, []);

//   img1: imageUrlForum1,
//   img2: imageUrlForum2,
//   img3: imageUrlForum3,

//   <Card.Content> 
//   <Title>Add Image</Title>
//   <Text>Press pink boxes to add image.Maximum 3 images upload.</Text>
//   <ScrollView
//       horizontal={true}
//       showsHorizontalScrollIndicator={false}
//     >
//       <AddForumImage onChange={onImageChange1} source={{uri: imageUrlForum1}} /> 
//       <AddForumImage onChange={onImageChange2} source={{uri: imageUrlForum2}} /> 
//       <AddForumImage onChange={onImageChange3} source={{uri: imageUrlForum3}} /> 
//   </ScrollView>
//   </Card.Content> 