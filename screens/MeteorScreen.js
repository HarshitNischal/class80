import React,{ Component } from "react";
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform, TouchableOpacity, ImageBackground, Image , FlatList, Dimensions} from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component{
    constructor(){
        super()
        this.state={meteors:{}}
    }
    getMeteors=()=>{
    //retriving the data from api key generated from nasa studio
    axios
    .get('https://api.nasa.gov/planetary/apod?api_key=pO2Porof8xO4eKvX2sMLQwDa4qA0dbPBGWWkXWdr')  
     .then(response=>{
         this.setState({
             meteors:response.data.near_earth_object
         })
         .catch(error=>{
             alert(error.message)
         })
     })
    }
    componentDidMount(){
        this.getMeteors()
    }
    keyExtractor=(item,index)=>{
        index.toString()
    }
    renderItem=({item})=>{
    var meteor=item
    var bg_img,speed,size
    if(meteor.threat_score<=30){
        bg_img=require('../assets/meteor_bg1.png')
        speed=require('../assets/meteor_speed3.gif')
     size=100
    }
    else if(meteor.threat_score<=75){
        bg_img=require('../assets/meteor_bg2.png')
        speed=require('../assets/meteor_speed3.gif')
        size=150
    }
    else {
        bg_img=require('../assets/meteor_bg3.png')
        speed=require('../assets/meteor_speed3.gif')
        size=200
    }
    return(
        <View>
            <ImageBackground source={bg_img}style={styles.backgroundImage}>
         <View style={styles.gifContainer}>
        <Image
        source={speed} style={{width:size,hieght:size,alignSelf:'center'}}
        />
        <View>
            <Text style={{marginTop:400,marginLeft:50,fontSize:20,marginBottom:10,fontWeight:"bold",color:'white'}}>{item.name}</Text>
            <Text style={{marginTop:400,marginLeft:50,color:'white'}}>closest to Earth-{item.close_approach_data[0].close_approach_date_full}</Text>
            <Text style={{marginTop:400,marginLeft:50,color:'white'}}>minimum diameter(km)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
            <Text style={{marginTop:400,marginLeft:50,color:'white'}}>maximum diameter(km)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
            <Text style={{marginTop:400,marginLeft:50,color:'white'}}>velocity(km/hr)-{item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
            <Text style={{marginTop:400,marginLeft:50,color:'white'}}>missing Earth by(km)-{item.close_approach_data[0].miss_distance.kilometers}</Text>
        </View>
         </View>
            </ImageBackground>

        </View>
    )
    }
    render(){
     //object.keys method check if any key is there in a state or not, its checks the key name
        if(Object.keys(this.state.meteors).length===0){
                return(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>
                       Loading........;-;
                    </Text>
                </View>
                )
                }
                else{
               //meteor_arr contained all the erray of objects on a particular meteor date with the map function by iterating over all the keys of object(dates of next 7 days)   
                        var meteor_arr=Object.keys(this.state.meteors).map(meteor_date=>{
                            return this.state.meteors[meteor_date]
                        })
                        //concatinating all errays inside meteor_arr into another master erray with the concat . apply funtion 
                        var meteors=[].concat.apply([],meteor_arr)
                        meteors.forEach(function(element){
                            var diameter=(element.estimated_diameter.kilometers.estimated_diameter_min+element.estimated_diameter.kilometers.estimated_diameter_max)/2
                            var threatScore=(diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
                            element.threat_score=threatScore

                        })
                        meteors.sort(function(a,b){
                            return b.threat_score-a.threat_score
                        })
                        meteors=meteors.slice(0,5)
                        return(
                            <View style={styles.container}>
                          <FlatList
                          data={meteors}
                          renderItem={this.renderItem}
                          keyExtractor={this.keyExtractor}
                          horizontal={true}
                          />
                            </View>
                        )
                         }
    }}

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

   map:{width:'100%',hieght:'100%'},
   backgroundImage:{
       flex:1,
       resizeMode:"cover",
       width:Dimensions.get("window").width,
       height:Dimensions.get("window").height,

   },
   gifContainer:{justifyContent:"center",alignItem:"center",flex:1}
})