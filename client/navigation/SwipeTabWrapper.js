import Animated, {
runOnJS,
useSharedValue,
useAnimatedStyle,
withSpring,
} from "react-native-reanimated";

const DRAG_RESISTANCE = 0.35;
const SWIPE_THRESHOLD = 70;

const translateX = useSharedValue(0);

const pan = Gesture.Pan()
.onUpdate((event) => {
// Follow finger with slight resistance so it feels premium
translateX.value = event.translationX * DRAG_RESISTANCE;
})
.onEnd((event) => {
const index = TAB_ORDER.indexOf(route.name);
if (index < 0) {
translateX.value = withSpring(0);
return;
}   
        if (event.translationX < -SWIPE_THRESHOLD && index < TAB_ORDER.length - 1) {
            runOnJS(goTo)(TAB_ORDER[index + 1]);
        } else if (event.translationX > SWIPE_THRESHOLD && index > 0) {
            runOnJS(goTo)(TAB_ORDER[index - 1]);
        }
            
const dragStyle = useAnimatedStyle(() => ({
transform: [{ translateX: translateX.value }],
}));

return (
<GestureDetector gesture={pan}>
<Animated.View style={[{ flex: 1 }, dragStyle]}>{children}</Animated.View>
</GestureDetector>
);

