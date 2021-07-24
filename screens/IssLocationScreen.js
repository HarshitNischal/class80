
import React,{ Component } from "react"
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform, TouchableOpacity, ImageBackground, Image } from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import axios from 'axios';

export default class IssLoacationScreen extends Component{
    constructor(){
        super()
        this.state={location:{}}
    }
    getIssLocation=()=>{
     axios
     .get('https://api.wheretheiss.at/v1/satellites/25544')  
      .then(response=>{
          this.setState({
              location:response.data
          })
          .catch(error=>{
              alert(error.message)
          })
      })
    }
    componentDidMount(){
        this.getIssLocation()
    }
    render(){
        if(Object.keys(this.state.location).length===0){
        return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>
               Loading........;-;
            </Text>
        </View>
        )
        }
        else{
            return(
                <View style={styles.container}>
                    <SafeAreaView style={styles.androidSafeAreaView}/>
                    <ImageBackground source={require('../assets/iss_bg.jpg')} style={{
                        flex:1,
                        resizeMode:"cover"
                        }}>
               <View style={styles.TitleBar}>
                <Text style={styles.TitleText}>
                     Iss Location
                 </Text> 
                 </View>
                    <MapView
                    style={styles.map}
                    region={{
                    latitude: this.state.location.latitude,
                    longitude: this.state.location.longitude,
                    latitudeDelta: 100,
                    longitudeDelta: 100,
                    }}
                >
                    <Marker coordinate={{  latitude: this.state.location.latitude, longitude: this.state.location.longitude }}>
                    <Image source={require('../assets/iss_icon.png')} style={{
                    hieght:50,
                    width:50
                      }}/>
                            </Marker>
                </MapView>
                       <Text style={styles.routeText}>
                   Latitude:{this.state.location.latitude}
               </Text>
               <Text style={styles.routeText}>
               Longitude:{this.state.location.longitude}
               </Text>
               <Text style={styles.routeText}>
               Altitude(KM):{this.state.location.altitude}
               </Text>
               <Text style={styles.routeText}>
               Velocity(KM/hr):{this.state.location.velocity}
               </Text>
                    
              
                 </ImageBackground>
                 </View>)


        }
    }
}
const styles=StyleSheet.create({
    container:{flex:1},
    TitleBar:{
        flex:0.15,
        justifyContent:'center',
        alignItems:'center'
    },
    TitleText:{
        fontSize:40,
    fontWeight:"bold",
color:'black'},
androidSafeAreaView:{marginTop:Platform.OS==='android'?StatusBar.currentHeight:0},

RouteText:{
    fontSize:15,
fontWeight:"bold",
color:'black',
},

   map:{width:'100%',hieght:'100%'}
})