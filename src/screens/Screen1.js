import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView,
    Linking,
    TextInput,
    Alert,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {moderateScale} from 'react-native-size-matters';
  import ImagePicker from 'react-native-image-crop-picker';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import Loader from '../components/Loader';

  const axios = require('axios').default;
  const baseURL = 'https://serpapi.com/search.json?';
  
  const Screen1 = () => {
    // Camera
    const [imgUri, setImgUri] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [mainTitle, setMainTitle] = useState('');
    const [head2, setHead2] = useState('');
    const [imageURL, setimageURL] = useState(null);
  const [loading, setloading] = useState(false)
    const cam = () => {
      ImagePicker.openCamera({
        cropping: true,
        includeBase64: true,
        freeStyleCropEnabled: true,
      }).then(image => {
        console.log(image?.path);
        setImgUri(image?.path);
        postBase64(image?.data);
      });
    };
    const gallery = () => {
      ImagePicker.openPicker({
        cropping: true,
        includeBase64: true,
        freeStyleCropEnabled: true,
      }).then(image => {
        console.log(image);
        setImgUri(image?.path);
        postBase64(image?.data);
      });
    };
  
    const postBase64 = base64 => {
        setloading(true)
      axios
        .post(
          'https://buybestthemes.com/date_night_api/api/image-upload-64',
          {image: base64},
          {
            headers: {
              Accept: 'application/json',
              Authorization:
                'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWE3YWY2M2YwN2M0NzBhOGRkMDY3ZDJmYmRhOTM4NTg2NTFhNmZiMDExMzFhNDU3MzYwNDY4Y2Y3ZTNlOTliMWRmY2E0YmI4NjVjMzhkNjkiLCJpYXQiOjE2ODA1OTA3NzMuNjgzMjExLCJuYmYiOjE2ODA1OTA3NzMuNjgzMjE1LCJleHAiOjE3MTIyMTMxNzMuNjc4Njk0LCJzdWIiOiIxMTUiLCJzY29wZXMiOltdfQ.Pya0LJLNCn3mTWh0b6k79uIIghxqE7Pa7miGhBUiVUOCBhO-EfZ0q4PWcyu1S9EYTzaL3mFQYO2TeenJ0ssVFUaik1CYEKusY2zW-RpiK0ggk56nmOGEJuhgday92_hsxycliEoz7YagZFf5VLHtMCyUbttfsMP7BB8AzB8EcDzc2vlk-57_UAW4OmQfCnwGlPkYfDeNNt6V_1jyzJTHxCYSMC8BM_ezY1DoOU_O6rPE5VyvU4F4GR08-lviixcMITblWWl5DZz8jPj9xpF8xCw6CSdCla-fFZ-hXPKxbfTco7iUU1Z0Yt9brkwoLGBm1V_dqTpUrwdomrljbtaiQG5aL72ms4urxH0ro1yr8WXv9G1XYs2H1fx8uRKYQGTkO-lgr1o3ZrDD3782xH-g-oZj6IPkE_ABM3OSZWpunTM7pXPqKOW-bYkhzZJ-ddw6IslmTeNxnBA3VB0fNYRh3yZJokr8ZxOZBCEq0YzvDfuvlsGbAxseysUkETpbsvthaqwhkrjr0FssWVTlx7OrWYRz6SEYp8OUqtXNggVJg0LnTJPaq5DNI7Fxv8-mGgU5pAB3GvFhzDfjwCBn1G2gFW0rotOrAsIj8DJ7P6uJjVNzz-1bc9Gf4b_eQnqbH1M8lVxqnI0iqJMc5pJtu2kwg3M2R7KZBwoqmZOhodRELyA',
              'content-type': 'application/json',
            },
          },
        )
        .then(function (response) {
          console.log(response);
          console.log(response?.data?.data?.image_url, 'Url ');
          let imgUrl = (response?.data?.data?.image_url).replace(/\s+/g, '%20');
          setimageURL(imgUrl);
          setloading(false)
        })
        .catch(function (error) {
            setloading(false)
          Alert.alert('error');
          console.log(error)
        });
    };
  
    console.log(`${imageURL}`, 'Image uRL');
  
    // axios ....
  
    const hitApi = () => {
        setloading(true)
      setApiData([]);
      axios
        .get(baseURL, {
          params: {
            engine: 'google_lens',
            url: `${imageURL}`,
            // url:'https://qph.cf2.quoracdn.net/main-qimg-b2edd5fe9eea4c819a4e8fdfa99da285-lq',
            api_key:
              'bc029f79abb571f858be2932999dc46ac911f036746445a5c5de8fc3fea2167d',
          },
        })
        .then(res => {
          let data = res?.data;
          if (data?.knowledge_graph) {
            setMainTitle(data?.knowledge_graph[0]?.title);
          } else {
            setMainTitle('');
          }
          console.log(data, 'Dataa');
          // console.log(data?.knowledge_graph[0]?.title);
          setApiData(data?.visual_matches);
          setHead2('Visual Matches');
          console.log(res?.data?.visual_matches, 'hit api');
          setloading(false)
        })
        .catch(err => {
            Alert.alert('No Data Found');
            console.log(err, 'ERROR');
            setloading(false)
        });
    };
  
    useEffect(() => {
      if (imageURL !== null) {
        hitApi();
      }
    }, [imageURL]);
  
    const renderItem = ({index, item}) => {
      return (
        
          <View
            style={{
              flex: 1,
              paddingBottom: moderateScale(5),
              // borderWidth: 1,
              // borderColor: '#000',
              height: moderateScale(230),
              width: moderateScale(200),
              borderRadius: 30,
              alignItems: 'center',
              // justifyContent:'center'
            }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(item?.link)}
              style={{
                height: moderateScale(160),
                width: moderateScale(160),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // justifyContent:'center',
                // marginBottom: moderateScale(80),
                // marginRight: moderateScale(10),
                // borderWidth: 1,
                // borderColor: 'red',
                borderRadius: 30,
              }}>
              <Image
                source={{
                  uri: item?.thumbnail,
                }}
                resizeMode='cover'
                style={{height: '100%', width: '100%', borderRadius: 30}}></Image>
  
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: moderateScale(120),
                  height: 'auto',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginVertical: moderateScale(4),
                  // borderWidth:1,
                  // borderColor:'red',
                }}>
                <Image
                  source={{
                    uri: item?.source_icon,
                  }}
                  resizeMode="contain"
                  style={{
                    height: moderateScale(15),
                    width: moderateScale(15),
                    // borderWidth: 1,
                    // borderColor: 'red',
                  }}></Image>
                <Text style={{color: '#808080'}}>{item?.source}</Text>
              </View>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#000'}}>
                {item?.title.split(' ').slice(0, 5).join(' ')}...
              </Text>
            </TouchableOpacity>
          </View>
        
      );
    };
    return (
      <View style={{flex: 1}}>
         {loading? <Loader/> : null}
        {/* <View style={styles.ImgV}>
          {imgUri !== null ? (
            <Image source={{uri: imgUri}} style={styles.headImg} />
          ) : null}
        </View> */}
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width:'50%',
            marginLeft:'auto',
            marginRight:'auto',
            marginVertical:moderateScale(20)
          }}>
          <TouchableOpacity onPress={cam} style={{alignItems: 'center'}}>
            <Icon name="photo-camera" size={40} color="#000" />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={gallery} style={{alignItems: 'center'}}>
            <Icon name="photo-library" size={40} color="#000" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 25,
            color: '#000',
            marginTop: moderateScale(5),
            // marginBottom: moderateScale(5),
            marginLeft: moderateScale(5),
          }}>
          {mainTitle}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            marginTop: moderateScale(5),
            marginBottom: moderateScale(10),
            marginLeft: moderateScale(5),
          }}>
          {head2}
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <FlatList
            style={{flex: 1}}
            scrollEnabled={true}
            horizontal={false}
            numColumns={3}
            data={apiData}
            renderItem={renderItem}
          />
        </ScrollView>
      </View>
    );
  };
  const styles = StyleSheet.create({
    ImgV: {
      height: moderateScale(180, 0.8),
      width: moderateScale(280, 0.1),
      marginTop: moderateScale(20),
      borderRadius: 30,
      marginBottom: '4%',
      // borderColor: '#FFF',
      marginLeft: 'auto',
      marginRight: 'auto',
      // backgroundColor: '#363143',
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      // zIndex: 1,
      top: 14,
      left: 27,
    },
    headImg: {
      height: moderateScale(180, 0.8),
      width: moderateScale(280, 0.1),
  
      position: 'absolute',
      borderRadius: 20,
      zIndex: 1,
      resizeMode: 'contain',
      // top:10,
      // left:10
    },
  });
  export default Screen1;
  