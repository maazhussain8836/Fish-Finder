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
  Button,
  ToastAndroid,
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

  const [apiData, setApiData] = useState([]);
  const [mainTitle, setMainTitle] = useState('');
  const [head2, setHead2] = useState('');
  const [imageURL, setimageURL] = useState(null);
  const [loading, setloading] = useState(false);
  const [fishExist, setFishExist] = useState();
  // const [base64, setbase64] = useState('');
  const cam = () => {
    ImagePicker.openCamera({
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
    }).then(image => {
      console.log(image?.data, 'base 64');
      handleImageUpload(image?.data);
    });
  };
  const gallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
    }).then(image => {
      console.log(image);
      handleImageUpload(image?.data);
    });
  };

  useEffect(() => {
    if (fishExist == true && imageURL !== null) {
      setHead2('');
      setMainTitle('');
      setApiData([]);
      hitApi();
    }
  }, [imageURL]);

  const postBase64 = base64 => {
    setloading(true);
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
        let imgUrl = (response?.data?.data?.image_url).replace(/\s+/g, '%20');
        setimageURL(imgUrl);
        setloading(false);
      })
      .catch(function (error) {
        setloading(false);
        Alert.alert('error');
        console.log(error);
      });
  };

  // axios ....
  const handleImageUpload = base64 => {
    const apiKey = 'AIzaSyDEWD5MLAof7UnDMH5mVf9Fpwr_dLtH5X0';
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
            },
          ],
        },
      ],
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    axios
      .post(endpoint, requestBody, config)
      .then(res => {
        console.log(res?.data?.responses[0]);
        let data = res?.data?.responses[0]?.labelAnnotations;
        const isFishExist = data.some(item =>
          Object.values(item).includes('Rectangle'),
        );
        setFishExist(isFishExist);
        if (isFishExist == true) {
          postBase64(base64);
        } else {
          setApiData([]);
          setHead2('');
          setMainTitle('');
          Alert.alert('Alert ! This App rechognize Fish Image only'); // show alert if no fish found in data
        }
        console.log(isFishExist, 'fish exist');
      })
      .catch(err => {
        if (err) {
          Alert.alert('No Fish found in Image!!');
        }
      });
  };

  const hitApi = () => {
    setApiData([]);
    setloading(true);
    axios
      .get(baseURL, {
        params: {
          engine: 'google_lens',
          url: `${imageURL}`,
          // url:'https://qph.cf2.quoracdn.net/main-qimg-b2edd5fe9eea4c819a4e8fdfa99da285-lq',
          api_key:
            'd131c5262954312c05f71db8d9fb906e65ed030d1741e3457c8c295d33366cce',
        },
      })
      .then(res => {
        let data = res?.data;
        setApiData(data?.visual_matches);
        if (data?.knowledge_graph) {
          setMainTitle(data?.knowledge_graph[0]?.title);
        } else {
          setMainTitle('');
        }
        console.log(data, 'Dataa');
        if (data?.search_parameters?.url == 'null') {
          setHead2('Did not get  Data , Try Again ');
        } else {
          setHead2('Visual Matches');
        }

        setloading(false);
      })
      .catch(err => {
        Alert.alert('Api Error');
        console.log(err, 'ERROR');
        setloading(false);
      });
  };

  const renderItem = ({index, item}) => {
    return (
      <View
        style={{
          flex: 1,
          paddingBottom: moderateScale(5),
          marginLeft: moderateScale(8),
          // borderWidth: 1,
          // borderColor: '#000',
          height: moderateScale(230),
          width: moderateScale(170),
          borderRadius: 30,
          alignItems: 'flex-start',
          // justifyContent:'flex-start'
        }}>
        <TouchableOpacity
          onPress={() => Linking.openURL(item?.link)}
          style={{
            height: moderateScale(160),
            width: moderateScale(160),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderRadius: 30,
          }}>
          <Image
            source={{
              uri: item?.thumbnail,
            }}
            resizeMode="cover"
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
              }}></Image>
            <Text style={{color: '#808080', marginLeft: moderateScale(8)}}>
              {item?.source}
            </Text>
          </View>
          <Text style={{fontSize: 14, fontWeight: '500', color: '#000'}}>
            {/* {item?.title.split(' ').slice(0, 5).join(' ')}... */}
            {item?.title.substring(0, 16) + '...'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {loading ? <Loader /> : null}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginVertical: moderateScale(20),
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
          fontStyle: 'italic',
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
