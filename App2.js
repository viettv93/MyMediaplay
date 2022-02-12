import React, { useRef, useState } from 'react'
import { View, Slider, Image, Animated, TouchableOpacity, Easing, StyleSheet } from 'react-native'
import TrackPlayer, { useProgress } from 'react-native-track-player'
import { images, tracks } from './src/utils'



var index = 0
const App2 = () => {
    const rotate = useRef(new Animated.Value(0)).current
    const rotateImage = useRef(
        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true,
                isInteraction: false,
                easing: Easing.linear
            }),
            { iterations: 10 }
        )
    ).current
    const progress = useProgress()
    const rotateStyle = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })
    const [isPlaying, setIsPlaying] = useState(false)
    const[value, setValue]=useState(0)
    const previousButton = async () => {
        index--
        var previous = index
        await TrackPlayer.destroy()
        await TrackPlayer.add(tracks[previous])
        rotate.setValue(0)
        await TrackPlayer.play()
        rotateImage.start()
        setIsPlaying(true)

    }
    const playButton = async () => {

        await TrackPlayer.add(tracks[index])

        if (isPlaying === false) {
            await TrackPlayer.play()
            rotateImage.start()
        }
        else {
            await TrackPlayer.pause()
            rotateImage.stop()
        }
        setIsPlaying(!isPlaying)

    }
    const stopButton = async () => {
        await TrackPlayer.stop()
        rotate.setValue(0)
        setIsPlaying(false)

    }
    const nextButton = async () => {
        index++
        var next = index
        rotate.setValue(0)
        await TrackPlayer.destroy()
        await TrackPlayer.add(tracks[next])
        await TrackPlayer.play()
        rotateImage.start()
        setIsPlaying(true)
    }

    return (
        <View style={styles.container}>
            <Animated.Image
                source={images.background}
                resizeMode='cover'
                style={[styles.imageBackground, {transform: [{ rotate: rotateStyle }]}]
                    
                    

                    // styles.imageBackground,
                    // { transform: [{ rotate: rotateStyle }] }
                } />

            <View style={styles.slider}>
                <Slider 
                    maximumValue={progress.duration}
                    minimumValue={0}
                    value={progress.position}
                    thumbTintColor="red" 
                    onSlidingComplete={async()=>{
                        setValue(value)
                        await TrackPlayer.seekTo(value)
                    }}/>
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={previousButton}>
                    <Image
                        style={styles.image}
                        source={images.previous}
                        resizeMode="cover" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={playButton}>
                    <Image source={isPlaying ?
                        images.pause :
                        images.play}
                        resizeMode="cover"
                        style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={stopButton}>
                    <Image source={images.stop}
                        resizeMode="cover"
                        style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={nextButton}>
                    <Image
                        style={styles.image}
                        source={images.next}
                        resizeMode="cover" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40
    },
    container: {
        flex: 1,
        backgroundColor: "yellow",
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackground: {
        height: 200,
        width: 200,
        borderRadius: 100
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginTop: 30,
        alignItems: 'center',
        width: '100%'
    },
    slider: {
        width: '100%',
        marginTop: 20
    }

})
export default App2